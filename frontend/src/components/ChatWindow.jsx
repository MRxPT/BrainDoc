import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Copy, ChevronDown, ChevronUp, Settings,
  Sparkles, User, Search, AlignLeft, Lightbulb, Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { askQuestion } from "../api/documents";
import { getAISettings } from "../api/settings";
import { CircularProgress } from "@mui/material";
import AISettingsDrawer from "./AISettingsDrawer";

const P = "#2563eb";
const EASE = [0.22, 0.61, 0.36, 1];

// ── Typing dots ───────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i}
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
          style={{ width: 5, height: 5, borderRadius: "50%", background: P }}
        />
      ))}
    </div>
  );
}

// ── Stream text ───────────────────────────────────────────────────
function StreamText({ text }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 7);
    return () => clearInterval(id);
  }, [text]);
  return (
    <p style={{ fontSize: 14, lineHeight: 1.75, color: "#334155", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {displayed}
      {displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
          style={{ display: "inline-block", width: 2, height: "1em", background: P, marginLeft: 2, verticalAlign: "text-bottom", borderRadius: 1 }} />
      )}
    </p>
  );
}

// ── Command palette ───────────────────────────────────────────────
const COMMANDS = [
  { cmd: "/summarize", icon: <AlignLeft size={13} />,  hint: "Summarize the entire document" },
  { cmd: "/search",    icon: <Search size={13} />,     hint: "Semantic search within document" },
  { cmd: "/analyze",   icon: <Sparkles size={13} />,   hint: "Analyze key themes and topics" },
  { cmd: "/extract",   icon: <Lightbulb size={13} />,  hint: "Extract the main key points" },
  { cmd: "/insights",  icon: <Lightbulb size={13} />,  hint: "Generate AI insights" },
];

function CommandPalette({ query, onSelect }) {
  const filtered = COMMANDS.filter((c) => c.cmd.startsWith(query) || query === "/");
  if (!filtered.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.16, ease: EASE }}
      style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
      <div style={{ padding: "8px 14px 6px", borderBottom: "1px solid #f1f5f9" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" }}>Commands</span>
      </div>
      {filtered.map((c, i) => (
        <motion.div key={c.cmd} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
          onClick={() => onSelect(c.cmd)} style={{ cursor: "pointer" }}>
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, transition: "background 0.12s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ color: P, display: "flex" }}>{c.icon}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 1px" }}>{c.cmd}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{c.hint}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Bubble ────────────────────────────────────────────────────────
function Bubble({ msg, isLatestAI }) {
  const isUser = msg.role === "user";
  const isError = msg.isError;
  const [showSrc, setShowSrc] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, flexShrink: 0, background: isUser ? "linear-gradient(135deg,#2563eb,#7c3aed)" : isError ? "#fef2f2" : "#f0f7ff", border: isUser ? "none" : `1px solid ${isError ? "#fecaca" : "#e0eeff"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isUser ? "0 2px 8px rgba(37,99,235,0.3)" : "none" }}>
          {isUser ? <User size={13} color="#fff" /> : <Sparkles size={13} color={isError ? "#ef4444" : P} />}
        </div>
        <div style={{ maxWidth: "80%", minWidth: 0 }}>
          <div style={{ padding: "12px 16px", background: isUser ? "linear-gradient(135deg,rgba(37,99,235,0.08),rgba(124,58,237,0.06))" : isError ? "#fef2f2" : "#fff", border: `1px solid ${isUser ? "rgba(37,99,235,0.15)" : isError ? "#fecaca" : "#e2e8f0"}`, borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            {isLatestAI && !isUser && !isError
              ? <StreamText text={msg.content} />
              : <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0, color: isError ? "#dc2626" : isUser ? "#1e3a5f" : "#334155", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</p>}
          </div>
          {!isUser && !isError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, marginLeft: 4 }}>
              <button onClick={copy} title={copied ? "Copied!" : "Copy"} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", display: "flex", padding: 2, borderRadius: 4 }} onMouseEnter={(e) => { e.currentTarget.style.color = P; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}>
                <Copy size={11} />
              </button>
              {msg.sources?.length > 0 && (
                <button onClick={() => setShowSrc((s) => !s)} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 999, cursor: "pointer", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)", color: "#2563eb", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(37,99,235,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(37,99,235,0.06)"; }}>
                  {showSrc ? <ChevronUp size={10} /> : <ChevronDown size={10} />}{msg.sources.length} sources
                </button>
              )}
            </div>
          )}
          <AnimatePresence>
            {showSrc && msg.sources?.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {msg.sources.map((s, i) => (
                    <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const SUGGESTIONS = ["Summarize this document", "What are the key points?", "Extract main topics", "What conclusions are drawn?"];

// AI provider display names
const PROVIDER_LABELS = {
  local:   { name: "Brain Core", color: "#10b981" },
  groq:    { name: "Groq · Llama 3.3", color: "#2563eb" },
  gemini:  { name: "Gemini Flash", color: "#7c3aed" },
  openai:  { name: "GPT-3.5", color: "#0ea5e9" },
};

// ── Main ChatWindow ───────────────────────────────────────────────
export default function ChatWindow({ document, aiConfigured, onRefreshAI }) {
  const navigate = useNavigate();
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [sessionId, setSessionId]       = useState(null);
  const [showCommands, setShowCommands] = useState(false);
  const [latestAIIndex, setLatestAIIndex] = useState(-1);
  const [aiProvider, setAiProvider]     = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Load current AI provider for display
  useEffect(() => {
    getAISettings().then(({ data }) => {
      if (data.is_configured) setAiProvider(data.provider);
      else setAiProvider(null);
    }).catch(() => {});
  }, [aiConfigured]);

  useEffect(() => {
    setMessages([]); setSessionId(null); setInput("");
    setLatestAIIndex(-1); setShowCommands(false);
  }, [document?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowCommands(e.target.value.startsWith("/"));
  };

  const handleCommandSelect = (cmd) => {
    const prompts = {
      "/summarize": "Please provide a comprehensive summary of this document.",
      "/search":    "Search this document for: ",
      "/analyze":   "Analyze the key themes and topics in this document.",
      "/extract":   "Extract and list the most important points from this document.",
      "/insights":  "What are the most valuable insights from this document?",
    };
    setInput(prompts[cmd] || cmd + " ");
    setShowCommands(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const send = async (overrideText) => {
    const q = (overrideText || input).trim();
    if (!q || loading) return;
    setMessages((p) => [...p, { role: "user", content: q }]);
    setInput(""); setShowCommands(false); setLoading(true);
    try {
      const { data } = await askQuestion(document.id, q, sessionId);
      setSessionId(data.session_id);
      setMessages((p) => {
        const next = [...p, { role: "assistant", content: data.answer, sources: data.sources }];
        setLatestAIIndex(next.length - 1);
        return next;
      });
    } catch (err) {
      const detail = err.response?.data?.detail || "Something went wrong. Please try again.";
      setMessages((p) => [...p, { role: "assistant", content: detail, isError: true }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const onKey = (e) => {
    if (e.key === "Escape") { setShowCommands(false); return; }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Empty state
  if (!document) {
    return (
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", background: "#fff" }}>
        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#f0f7ff", border: "1px solid #e0eeff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 4px 24px rgba(37,99,235,0.1)" }}>
            <Sparkles size={28} color={P} />
          </div>
        </motion.div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Select a document</h3>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.7 }}>Choose a PDF from the sidebar to start<br />your AI-powered chat session</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["Upload PDF", "Semantic Search", "RAG Intelligence"].map((tag) => (
            <span key={tag} style={{ padding: "4px 12px", borderRadius: 999, background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)", fontSize: 12, color: "#2563eb", fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (aiConfigured === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#fff" }}>
        <CircularProgress size={24} style={{ color: P }} />
      </div>
    );
  }

  const providerInfo = PROVIDER_LABELS[aiProvider] || { name: "Brain Core", color: "#10b981" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", background: "#fff" }}>

      {/* AI Settings Drawer */}
      <AISettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={(info) => {
          if (info) setAiProvider(info.provider);
          else setAiProvider(null);
          onRefreshAI?.();
          setSettingsOpen(false);
        }}
      />

      {/* Loading progress bar */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 10 }}>
            <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: "100%", width: "40%", background: `linear-gradient(90deg,transparent,${P},transparent)` }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header — document name + AI model badge + settings */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        {/* Left: doc info */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: document.status === "ready" ? "#10b981" : "#f59e0b", boxShadow: document.status === "ready" ? "0 0 7px #10b981" : "0 0 7px #f59e0b" }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
              {document.original_name}
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
              {document.status === "ready" ? `${document.chunk_count} chunks · ready` : "Indexing..."}
            </p>
          </div>
        </div>

        {/* Right: AI model pill + settings button */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* AI model indicator — click to open settings drawer */}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setSettingsOpen(true)}
            title="Click to change AI model"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, cursor: "pointer", background: aiConfigured ? `${providerInfo.color}10` : "rgba(245,158,11,0.08)", border: `1px solid ${aiConfigured ? providerInfo.color + "30" : "rgba(245,158,11,0.25)"}`, fontFamily: "inherit", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 12px ${aiConfigured ? providerInfo.color + "25" : "rgba(245,158,11,0.2)"}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <Zap size={11} color={aiConfigured ? providerInfo.color : "#f59e0b"} />
            <span style={{ fontSize: 12, fontWeight: 600, color: aiConfigured ? providerInfo.color : "#b45309" }}>
              {aiConfigured ? providerInfo.name : "No AI — click to configure"}
            </span>
          </motion.button>

          {/* Settings gear — opens drawer */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 45 }} whileTap={{ scale: 0.94 }}
            onClick={() => setSettingsOpen(true)}
            title="AI Settings"
            style={{ background: "none", border: "1.5px solid #e2e8f0", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            <Settings size={14} />
          </motion.button>
        </div>
      </div>

      {/* Not configured warning */}
      {!aiConfigured && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: "0 16px 0", padding: "10px 14px", background: "#fffbeb", border: "1px solid #fed7aa", borderBottom: "none", borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={13} color="#f59e0b" />
            <span style={{ fontSize: 13, color: "#b45309", fontWeight: 500 }}>No AI model configured — using local extractive search</span>
          </div>
          <button onClick={() => setSettingsOpen(true)}
            style={{ padding: "4px 12px", borderRadius: 7, border: "1px solid #fed7aa", background: "#fff", color: "#b45309", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Configure →
          </button>
        </motion.div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px" }}>
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div style={{ textAlign: "center", marginTop: 32, marginBottom: 24 }}>
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity }}>
                <Sparkles size={30} color="rgba(37,99,235,0.18)" style={{ display: "block", margin: "0 auto 12px" }} />
              </motion.div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 5px", letterSpacing: "-0.02em" }}>Ask anything</h3>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 18px" }}>{document.original_name}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
                {SUGGESTIONS.map((s) => (
                  <motion.button key={s} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => document.status === "ready" && send(s)}
                    style={{ padding: "7px 14px", borderRadius: 999, cursor: document.status === "ready" ? "pointer" : "not-allowed", background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12, color: "#64748b", fontWeight: 500, fontFamily: "inherit", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { if (document.status === "ready") { e.currentTarget.style.background = "rgba(37,99,235,0.06)"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.2)"; e.currentTarget.style.color = P; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
                    {s}
                  </motion.button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#cbd5e1", marginTop: 14 }}>Type / for commands · Enter to send</p>
            </div>
          </motion.div>
        )}

        {messages.map((m, i) => (
          <Bubble key={i} msg={m} isLatestAI={i === latestAIIndex && m.role === "assistant"} />
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: "#f0f7ff", border: "1px solid #e0eeff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={13} color={P} />
              </div>
              <div style={{ padding: "12px 16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px 14px 14px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <TypingDots />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Indexing warning */}
      {document.status !== "ready" && (
        <div style={{ margin: "0 16px 8px", padding: "9px 13px", borderRadius: 9, background: "#fffbeb", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#b45309" }}>Indexing document — please wait</span>
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: "10px 16px 14px", borderTop: "1px solid #f1f5f9", background: "#fff" }}>
        <div style={{ position: "relative" }}>
          <AnimatePresence>
            {showCommands && <CommandPalette query={input} onSelect={handleCommandSelect} />}
          </AnimatePresence>

          <div
            style={{ display: "flex", gap: 9, alignItems: "flex-end", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 13, padding: "9px 11px", transition: "border-color 0.2s, box-shadow 0.2s" }}
            onFocusCapture={(e) => { e.currentTarget.style.borderColor = P; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
            onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; } }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={onKey}
              disabled={loading || document.status !== "ready"}
              placeholder={document.status === "ready" ? "Ask anything — type / for commands..." : "Waiting for document..."}
              rows={1}
              style={{ flex: 1, resize: "none", border: "none", outline: "none", background: "transparent", fontSize: 14, lineHeight: 1.55, color: "#0f172a", fontFamily: "inherit", opacity: (loading || document.status !== "ready") ? 0.5 : 1, maxHeight: 120, overflow: "auto", padding: 0 }}
              onInput={(e) => { e.target.style.height = "0"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
            />
            <motion.button
              whileHover={(input.trim() && !loading) ? { scale: 1.08 } : {}}
              whileTap={(input.trim() && !loading) ? { scale: 0.94 } : {}}
              onClick={() => send()}
              disabled={!input.trim() || loading || document.status !== "ready"}
              style={{ width: 34, height: 34, borderRadius: 9, border: "none", flexShrink: 0, background: (input.trim() && !loading) ? "linear-gradient(135deg,#2563eb,#7c3aed)" : "#e2e8f0", color: (input.trim() && !loading) ? "#fff" : "#94a3b8", cursor: (input.trim() && !loading) ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: (input.trim() && !loading) ? "0 3px 10px rgba(37,99,235,0.28)" : "none", transition: "all 0.2s" }}
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
