"""
RAG pipeline — lightweight, Render-compatible.

PDF → PyMuPDF text OR Tesseract OCR (300 DPI)
→ sentence-aware chunks → fastembed ONNX embeddings (no torch/GPU needed)
→ in-memory numpy cosine store → semantic search
→ fast extractive answer (local, no API key)
   OR Groq / Gemini / OpenAI if user configures a key
"""
import io
import re
from pathlib import Path
from typing import List, Tuple, Optional

from app.config import get_settings

settings = get_settings()

NO_ANSWER = "The uploaded PDF does not contain enough information to answer this."

SYSTEM_PROMPT = (
    "You are an AI assistant. Answer the question using ONLY the document context provided. "
    "If the answer is not in the context, say: "
    "'The uploaded PDF does not contain enough information to answer this.' "
    "The context may contain OCR noise — interpret it intelligently. "
    "Give a clear, complete answer."
)

# ── Lazy singletons ───────────────────────────────────────────────────────────
_embedder = None

# doc_id → (embeddings np.ndarray shape [N,384], chunks list[str])
_vector_store: dict = {}


def get_embedder():
    """Load fastembed ONNX embedder — no torch, no GPU, ~150 MB."""
    global _embedder
    if _embedder is None:
        from fastembed import TextEmbedding
        print("[RAG] Loading fastembed ONNX embedding model...")
        _embedder = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        print("[RAG] Embedding model ready.")
    return _embedder


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
        "/usr/bin/tesseract",
        "/usr/local/bin/tesseract",
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


# ── In-memory vector store (numpy cosine similarity) ─────────────────────────

def build_vector_index(doc_id: str, chunks: List[str]) -> int:
    """Encode chunks and store embeddings in memory. Returns chunk count."""
    import numpy as np

    embedder = get_embedder()
    # fastembed returns a generator of numpy arrays
    vecs = list(embedder.embed(chunks))
    vecs = np.array(vecs, dtype="float32")

    # Normalize for cosine similarity via dot product
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1, norms)
    vecs = vecs / norms

    _vector_store[doc_id] = (vecs, chunks)
    print(f"[RAG] Indexed {len(chunks)} chunks for doc {doc_id}")
    return len(chunks)


# Alias for backwards compatibility with documents.py
build_faiss_index = build_vector_index


def search_vectors(doc_id: str, query: str, top_k: int = 5) -> List[Tuple[str, float]]:
    """Return top-k (chunk, score) pairs for the given query."""
    import numpy as np

    if doc_id not in _vector_store:
        raise Exception(
            "Session expired. This PDF was processed temporarily in-memory "
            "and is no longer available. Please upload the PDF again."
        )

    vecs, chunks = _vector_store[doc_id]
    embedder = get_embedder()

    q_vec = list(embedder.embed([query]))[0].astype("float32")
    norm = float(np.linalg.norm(q_vec))
    if norm > 0:
        q_vec = q_vec / norm

    scores = np.dot(vecs, q_vec)
    top_indices = np.argsort(scores)[::-1][:top_k]

    return [(chunks[i], float(scores[i])) for i in top_indices]


# Alias for backwards compatibility with chat.py
search_faiss = search_vectors


# ── Answer generation ─────────────────────────────────────────────────────────

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

    # ── Default: fast extractive answer (no model needed) ────────────────────
    return _local_extractive_answer(question, context_chunks)


def _clean_ocr_text(text: str) -> str:
    """Remove OCR garbage characters and normalize whitespace."""
    import unicodedata

    replacements = {
        "¾": "", "¼": "", "½": "", "║": " ", "│": " ", "┐": "",
        "┘": "", "┌": "", "└": "", "─": "-", "═": "-", "□": "",
        "■": "", "▪": "", "•": "-", "·": "-", "°": "",
        "\x00": "", "\ufffd": "", "Γöé": "", "Γ£ô": "",
        "ΓöÇ": "-", "Γöî": "", "Γöò": "",
    }
    for bad, good in replacements.items():
        text = text.replace(bad, good)

    cleaned = []
    for ch in text:
        cat = unicodedata.category(ch)
        if cat.startswith(("L", "N", "P", "Z")) or ch in " \n\t-.,;:!?()[]\"'":
            cleaned.append(ch)
        else:
            cleaned.append(" ")
    text = "".join(cleaned)

    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

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

    list_triggers = (
        "list", "what are", "features", "types", "steps", "summarize",
        "summary", "key points", "main points", "advantages", "disadvantages",
        "benefits", "examples", "applications", "uses", "kinds",
    )
    wants_list = any(t in q_lower for t in list_triggers)

    simple_triggers = ("what is", "what are", "define", "meaning of", "explain")
    is_simple = any(t in q_lower for t in simple_triggers) and not any(
        t in q_lower for t in ("list", "features", "types", "applications")
    )

    if is_simple:
        best = sentences[0].strip().rstrip(".")
        return best + "." if best else NO_ANSWER

    if wants_list and len(sentences) > 1:
        bullets = []
        for s in sentences[:5]:
            s = s.strip().rstrip(".")
            if s:
                bullets.append(f"• {s}.")
        return "\n".join(bullets)

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

    all_sentences = []
    for chunk in clean_chunks:
        for s in re.split(r"(?<=[.!?])\s+", chunk):
            s = s.strip()
            if len(s) > 25:
                all_sentences.append(s)

    if not all_sentences:
        first = clean_chunks[0]
        sents = re.split(r"(?<=[.!?])\s+", first)
        return _format_answer([s.strip() for s in sents[:3] if s.strip()], question) or NO_ANSWER

    subject = re.sub(r"^(what is|what are|define|explain|describe)\s+", "", question.lower()).strip()
    subject_words = set(subject.split()) - STOPWORDS

    def score(s: str) -> float:
        words = set(re.sub(r"[^\w\s]", "", s.lower()).split())
        overlap = len(q_words & words)
        subject_hit = len(subject_words & words) * 1.5
        length_bonus = min(len(words) / 25, 1.0) * 0.2
        return overlap + subject_hit + length_bonus

    scored = sorted(all_sentences, key=score, reverse=True)
    top = [s for s in scored[:8] if score(s) > 0]

    if not top:
        sents = re.split(r"(?<=[.!?])\s+", clean_chunks[0])
        return _format_answer([s.strip() for s in sents[:3] if s.strip()], question) or NO_ANSWER

    unique = [top[0]]
    for s in top[1:]:
        words_s = set(s.lower().split())
        is_dup = any(
            len(words_s & set(u.lower().split())) / max(len(words_s), 1) > 0.65
            for u in unique
        )
        if not is_dup:
            unique.append(s)
        if len(unique) >= 3:
            break

    return _format_answer(unique, question) or NO_ANSWER


async def _call_openai_compat(
    messages: list,
    api_key: str,
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
    prompt = f"{SYSTEM_PROMPT}\n\nDocument context:\n{context}\n\nQuestion: {question}"
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-1.5-flash:generateContent?key={api_key}"
    )
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
        r.raise_for_status()
    return r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
