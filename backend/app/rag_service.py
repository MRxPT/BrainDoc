"""
RAG pipeline — fully local by default, optional cloud LLM upgrade.

PDF → PyMuPDF text OR Tesseract OCR (300 DPI)
→ sentence-aware chunks → all-MiniLM-L6-v2 embeddings → FAISS
→ semantic search → smart extractive answer (local, no API key, instant)
   OR Groq / Gemini / OpenAI if user configures a key
"""
import io
import pickle
import re
from pathlib import Path
from typing import List, Tuple, Optional

import faiss
from app.config import get_settings

settings = get_settings()

# ── Lazy singletons ───────────────────────────────────────────────────────────
_embedder = None
_faiss_cache: dict = {}   # doc_id → (index, chunks) — stays in RAM
_hf_model = None
_hf_tokenizer = None


def get_embedder():
    global _embedder
    if _embedder is None:
        from sentence_transformers import SentenceTransformer
        print("[RAG] Loading embedding model...")
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
        print("[RAG] Embedding model ready.")
    return _embedder


def get_hf_model():
    """Load flan-t5-base for local generative QA (no API key needed)."""
    global _hf_model, _hf_tokenizer
    if _hf_model is None:
        from transformers import T5ForConditionalGeneration, T5Tokenizer
        import warnings
        warnings.filterwarnings("ignore")
        print("[RAG] Loading HuggingFace flan-t5-base...")
        _hf_tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-base", legacy=True)
        _hf_model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-base")
        print("[RAG] HuggingFace model ready.")
    return _hf_model, _hf_tokenizer


# ── PDF extraction ────────────────────────────────────────────────────────────

def _preprocess_image(img):
    from PIL import ImageFilter, ImageEnhance
    img = img.convert("L")
    img = ImageEnhance.Contrast(img).enhance(2.0)
    img = img.filter(ImageFilter.SHARPEN)
    return img


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    import fitz

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages_text = [page.get_text("text").strip() for page in doc]
    doc.close()

    digital_text = "\n\n".join(t for t in pages_text if t)
    if len(digital_text.strip()) > 200:
        print(f"[RAG] Digital PDF — {len(digital_text)} chars")
        return digital_text

    # OCR fallback
    print("[RAG] Image PDF — running OCR at 300 DPI...")
    import pytesseract
    from PIL import Image

    for path in [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        "/usr/bin/tesseract", "/usr/local/bin/tesseract",
    ]:
        if Path(path).exists():
            pytesseract.pytesseract.tesseract_cmd = path
            break

    doc2 = fitz.open(stream=pdf_bytes, filetype="pdf")
    ocr_pages = []
    for i, page in enumerate(doc2):
        mat = fitz.Matrix(300 / 72, 300 / 72)
        pix = page.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        img = _preprocess_image(img)
        try:
            text = pytesseract.image_to_string(img, lang="eng", config="--psm 6 --oem 3").strip()
            if text:
                ocr_pages.append(text)
            print(f"[RAG] OCR {i+1}/{len(doc2)}: {len(text)} chars")
        except Exception as e:
            print(f"[RAG] OCR page {i+1} error: {e}")
    doc2.close()

    full = "\n\n".join(ocr_pages)
    if not full.strip():
        raise ValueError("Could not extract text from this PDF.")
    print(f"[RAG] OCR done — {len(full)} chars")
    return full


# ── Chunking ──────────────────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = 400, overlap: int = 80) -> List[str]:
    sentences = re.split(r'(?<=[.!?\n])\s+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

    chunks, current = [], []
    for sent in sentences:
        current.extend(sent.split())
        if len(current) >= chunk_size:
            chunks.append(" ".join(current))
            current = current[-overlap:]
    if current:
        chunks.append(" ".join(current))

    # Filter mostly-noise chunks
    clean = [c for c in chunks if sum(ch.isalpha() for ch in c) / max(len(c), 1) > 0.3]
    return clean if clean else chunks


# ── FAISS ─────────────────────────────────────────────────────────────────────

def _idx_dir(doc_id: str) -> Path:
    p = Path(settings.faiss_index_dir) / doc_id
    p.mkdir(parents=True, exist_ok=True)
    return p


def build_faiss_index(doc_id: str, chunks: List[str]) -> int:
    embedder = get_embedder()
    vecs = embedder.encode(
        chunks, batch_size=32, show_progress_bar=False,
        convert_to_numpy=True, normalize_embeddings=True,
    ).astype("float32")

    index = faiss.IndexFlatIP(vecs.shape[1])
    index.add(vecs)

    # Skip writing to disk for Ephemeral RAG
    # d = _idx_dir(doc_id)
    # faiss.write_index(index, str(d / "index.faiss"))
    # with open(d / "chunks.pkl", "wb") as f:
    #     pickle.dump(chunks, f)

    # Cache in memory immediately after building
    _faiss_cache[doc_id] = (index, chunks)
    return len(chunks)


def search_faiss(doc_id: str, query: str, top_k: int = 5) -> List[Tuple[str, float]]:
    # Use in-memory cache — avoids disk I/O on every query
    if doc_id not in _faiss_cache:
        d = _idx_dir(doc_id)
        if not d.exists() or not (d / "index.faiss").exists():
            raise Exception("Session expired. This PDF was processed temporarily in-memory and is no longer available.")
        index = faiss.read_index(str(d / "index.faiss"))
        with open(d / "chunks.pkl", "rb") as f:
            chunks = pickle.load(f)
        _faiss_cache[doc_id] = (index, chunks)

    index, chunks = _faiss_cache[doc_id]

    embedder = get_embedder()
    q_vec = embedder.encode(
        [query], convert_to_numpy=True, normalize_embeddings=True,
    ).astype("float32")

    k = min(top_k, len(chunks))
    scores, indices = index.search(q_vec, k)
    return [
        (chunks[idx], float(score))
        for score, idx in zip(scores[0], indices[0])
        if idx >= 0
    ]


# ── Answer generation ─────────────────────────────────────────────────────────

NO_ANSWER = "The uploaded PDF does not contain enough information to answer this."

SYSTEM_PROMPT = (
    "You are an AI assistant. Answer the question using ONLY the document context provided. "
    "If the answer is not in the context, say: "
    "'The uploaded PDF does not contain enough information to answer this.' "
    "The context may contain OCR noise — interpret it intelligently. "
    "Give a clear, complete answer."
)


async def generate_answer(
    question: str,
    context_chunks: List[str],
    chat_history: Optional[List[dict]] = None,
    provider: str = "local",
    api_key: str = "",
) -> str:
    # ── Cloud LLMs ────────────────────────────────────────────────────────────
    if api_key and api_key != "local" and provider in ("groq", "openai", "gemini"):
        context = "\n\n---\n\n".join(context_chunks)
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in (chat_history or [])[-8:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({
            "role": "user",
            "content": f"Document context:\n\n{context}\n\nQuestion: {question}",
        })
        if provider == "groq":
            return await _call_openai_compat(
                messages, api_key,
                base_url="https://api.groq.com/openai/v1",
                model="llama-3.3-70b-versatile",
            )
        elif provider == "openai":
            return await _call_openai_compat(messages, api_key)
        elif provider == "gemini":
            return await _call_gemini(question, context, api_key)

    # ── HuggingFace local generative model (flan-t5-base) ────────────────────
    if provider == "huggingface":
        return _hf_answer(question, context_chunks, chat_history)

    # ── Default: fast extractive answer (no model needed) ────────────────────
    return _local_extractive_answer(question, context_chunks)


def _hf_answer(
    question: str,
    context_chunks: List[str],
    chat_history: Optional[List[dict]] = None,
) -> str:
    """
    HuggingFace local QA — two-stage pipeline:
    1. Use flan-t5-base to identify the most relevant sentence per chunk
    2. Expand short answers to full sentences from the source
    Falls back to extractive if model gives nothing useful.
    """
    import torch

    model, tokenizer = get_hf_model()

    clean_chunks = [_clean_ocr_text(c) for c in context_chunks]
    clean_chunks = [c for c in clean_chunks if len(c.strip()) > 20]
    if not clean_chunks:
        return NO_ANSWER

    best_answer = ""
    best_score  = 0

    for chunk in clean_chunks[:3]:   # top 3 chunks only — keep it fast
        # Split into sentences for targeted search
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', chunk) if len(s.strip()) > 15]
        if not sentences:
            continue

        # Score each sentence with flan-t5 using a yes/no relevance check
        # This is much faster than full generation per chunk
        for sent in sentences[:8]:   # max 8 sentences per chunk
            prompt = (
                f"Does this sentence answer the question?\n"
                f"Sentence: {sent}\n"
                f"Question: {question}\n"
                f"Answer yes or no:"
            )
            inputs = tokenizer(prompt, return_tensors="pt", max_length=256, truncation=True)
            with torch.no_grad():
                out = model.generate(**inputs, max_new_tokens=5)
            verdict = tokenizer.decode(out[0], skip_special_tokens=True).strip().lower()

            if "yes" in verdict:
                # This sentence is relevant — score by length (more info = better)
                score = len(sent)
                if score > best_score:
                    best_score = score
                    best_answer = sent

    if best_answer:
        return best_answer

    # Fallback: use extractive method
    return _local_extractive_answer(question, context_chunks)


def _clean_ocr_text(text: str) -> str:
    """Remove OCR garbage characters and normalize whitespace."""
    import unicodedata

    # Replace common OCR garbage with sensible equivalents
    replacements = {
        "¾": "", "¼": "", "½": "", "║": " ", "│": " ", "┐": "",
        "┘": "", "┌": "", "└": "", "─": "-", "═": "-", "□": "",
        "■": "", "▪": "", "•": "-", "·": "-", "°": "",
        "\x00": "", "\ufffd": "", "Γöé": "", "Γ£ô": "",
        "ΓöÇ": "-", "Γöî": "", "Γöò": "",
    }
    for bad, good in replacements.items():
        text = text.replace(bad, good)

    # Remove non-printable / non-ASCII control characters
    cleaned = []
    for ch in text:
        cat = unicodedata.category(ch)
        # Keep: letters, numbers, punctuation, spaces
        if cat.startswith(("L", "N", "P", "Z")) or ch in " \n\t-.,;:!?()[]\"'":
            cleaned.append(ch)
        else:
            cleaned.append(" ")
    text = "".join(cleaned)

    # Collapse multiple spaces / weird whitespace
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove lines that are mostly non-alphabetic (OCR noise lines)
    lines = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        alpha = sum(c.isalpha() for c in line)
        if alpha / max(len(line), 1) > 0.35:
            lines.append(line)
    return "\n".join(lines).strip()


def _format_answer(sentences: list, question: str) -> str:
    """Format extracted sentences into a clean, readable answer."""
    q_lower = question.lower()

    # Detect if question wants a list
    list_triggers = (
        "list", "what are", "features", "types", "steps", "summarize",
        "summary", "key points", "main points", "advantages", "disadvantages",
        "benefits", "examples", "applications", "uses", "kinds",
    )
    wants_list = any(t in q_lower for t in list_triggers)

    # Simple "what is X" / "define X" → short paragraph, max 2 sentences
    simple_triggers = ("what is", "what are", "define", "meaning of", "explain")
    is_simple = any(t in q_lower for t in simple_triggers) and not any(
        t in q_lower for t in ("list", "features", "types", "applications")
    )

    if is_simple:
        # Return only the single best sentence
        best = sentences[0].strip().rstrip(".")
        return best + "." if best else NO_ANSWER

    if wants_list and len(sentences) > 1:
        bullets = []
        for s in sentences[:5]:   # max 5 bullets
            s = s.strip().rstrip(".")
            if s:
                bullets.append(f"• {s}.")
        return "\n".join(bullets)

    # Default: clean paragraph, max 3 sentences
    para = " ".join(s.strip() for s in sentences[:3] if s.strip())
    return para if para else NO_ANSWER


def _local_extractive_answer(
    question: str,
    context_chunks: List[str],
) -> str:
    """
    Fast local answering without any LLM.
    Cleans OCR noise, scores sentences by keyword overlap,
    and formats the answer readably.
    """
    if not context_chunks:
        return NO_ANSWER

    # Clean OCR noise from all chunks first
    clean_chunks = [_clean_ocr_text(c) for c in context_chunks]
    clean_chunks = [c for c in clean_chunks if len(c.strip()) > 30]
    if not clean_chunks:
        return NO_ANSWER

    STOPWORDS = {
        "what", "is", "are", "the", "a", "an", "of", "in", "on", "at", "to",
        "for", "with", "how", "why", "when", "where", "who", "which", "does",
        "do", "did", "was", "were", "be", "been", "being", "have", "has", "had",
        "will", "would", "could", "should", "can", "may", "might", "shall",
        "this", "that", "these", "those", "it", "its", "and", "or", "but",
        "not", "no", "so", "if", "then", "than", "as", "by", "from", "about",
        "tell", "me", "explain", "describe", "give", "list", "define",
    }

    q_words = set(re.sub(r"[^\w\s]", "", question.lower()).split()) - STOPWORDS
    if not q_words:
        q_words = set(question.lower().split())

    # Split cleaned chunks into sentences
    all_sentences = []
    for chunk in clean_chunks:
        for s in re.split(r"(?<=[.!?])\s+", chunk):
            s = s.strip()
            if len(s) > 25:
                all_sentences.append(s)

    if not all_sentences:
        # Fall back to first 3 sentences of top chunk
        first = clean_chunks[0]
        sents = re.split(r"(?<=[.!?])\s+", first)
        return _format_answer([s.strip() for s in sents[:3] if s.strip()], question) or NO_ANSWER

    # Score sentences by keyword overlap + subject-word bonus
    subject = re.sub(r"^(what is|what are|define|explain|describe)\s+", "", question.lower()).strip()
    subject_words = set(subject.split()) - STOPWORDS

    def score(s: str) -> float:
        words = set(re.sub(r"[^\w\s]", "", s.lower()).split())
        overlap = len(q_words & words)
        # Extra weight if sentence contains the subject directly
        subject_hit = len(subject_words & words) * 1.5
        length_bonus = min(len(words) / 25, 1.0) * 0.2
        return overlap + subject_hit + length_bonus

    scored = sorted(all_sentences, key=score, reverse=True)
    top = [s for s in scored[:8] if score(s) > 0]

    if not top:
        # No keyword match — return summary of top chunk
        sents = re.split(r"(?<=[.!?])\s+", clean_chunks[0])
        return _format_answer([s.strip() for s in sents[:3] if s.strip()], question) or NO_ANSWER

    # Deduplicate similar sentences
    unique = [top[0]]
    for s in top[1:]:
        words_s = set(s.lower().split())
        is_dup = any(
            len(words_s & set(u.lower().split())) / max(len(words_s), 1) > 0.65
            for u in unique
        )
        if not is_dup:
            unique.append(s)
        if len(unique) >= 3:   # hard cap — never return more than 3 sentences
            break

    return _format_answer(unique, question) or NO_ANSWER


async def _call_openai_compat(
    messages: list, api_key: str,
    base_url: str = "https://api.openai.com/v1",
    model: str = "gpt-3.5-turbo",
) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=api_key, base_url=base_url)
    resp = await client.chat.completions.create(
        model=model, messages=messages, temperature=0.1, max_tokens=1024,
    )
    return resp.choices[0].message.content.strip()


async def _call_gemini(question: str, context: str, api_key: str) -> str:
    import httpx
    prompt = (
        f"{SYSTEM_PROMPT}\n\nDocument context:\n{context}\n\nQuestion: {question}"
    )
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-1.5-flash:generateContent?key={api_key}"
    )
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
        r.raise_for_status()
    return r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
