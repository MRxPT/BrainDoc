import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RefreshCw, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { CircularProgress } from "@mui/material";
import DocumentSidebar from "../components/DocumentSidebar";
import ChatWindow from "../components/ChatWindow";
import UploadDialog from "../components/UploadDialog";
import { listDocuments, getDocument } from "../api/documents";
import { getAISettings } from "../api/settings";

const P = "#2563eb";
const POLL = 3000;

/* ── Context Panel ────────────────────────────────────────────────── */
function ContextPanel({ sources = [], docName = "", collapsed, onToggle }) {
  const mockSources = sources.length > 0 ? sources : [
    "The document discusses retrieval-augmented generation as a method to improve LLM accuracy...",
    "Vector embeddings enable semantic similarity search across large document corpora...",
    "In-memory FAISS indexing provides sub-millisecond nearest-neighbor retrieval...",
  ];

  return (
    <div style={{
      width: collapsed ? 0 : 268, flexShrink: 0,
      borderLeft: "1px solid #f1f5f9",
      background: "#fafbfc", display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
    }}>
      {/* Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)",
          width: 28, height: 28, borderRadius: "50%", zIndex: 10,
          background: "#fff", border: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          color: "#94a3b8", transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}
      >
        {collapsed ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
      </button>

      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>
                Retrieved Context
              </p>
              <span style={{ padding: "1px 7px", borderRadius: 999, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)", fontSize: 10, fontWeight: 700, color: P }}>
                {mockSources.length}
              </span>
            </div>
            {docName && <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{docName}</p>}
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
            {mockSources.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <div style={{
                  padding: 12, marginBottom: 8, borderRadius: 10,
                  background: "#fff", border: "1px solid #f1f5f9",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  cursor: "default", transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e0eeff"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>Chunk {i + 1}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>p.{i + 1}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {src}
                  </p>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>Relevance</span>
                      <span style={{ fontSize: 10, color: P, fontFamily: "monospace", fontWeight: 600 }}>{(0.95 - i * 0.08).toFixed(2)}</span>
                    </div>
                    <div style={{ height: 3, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(0.95 - i * 0.08) * 100}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                        style={{ height: "100%", background: `linear-gradient(90deg,${P},#7c3aed)`, borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
              Semantic chunks retrieved for the last AI response.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── Main ChatPage ────────────────────────────────────────────────── */
export default function ChatPage() {
  const [documents, setDocuments]       = useState([]);
  const [selected, setSelected]         = useState(null);
  const [uploadOpen, setUploadOpen]     = useState(false);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [aiConfigured, setAiConfigured] = useState(null);
  const [ctxCollapsed, setCtxCollapsed] = useState(false);

  const checkAI = useCallback(() => {
    getAISettings()
      .then(({ data }) => setAiConfigured(data.is_configured))
      .catch(() => setAiConfigured(false));
  }, []);

  useEffect(() => { checkAI(); }, [checkAI]);
  useEffect(() => {
    window.addEventListener("focus", checkAI);
    return () => window.removeEventListener("focus", checkAI);
  }, [checkAI]);

  const fetchDocs = useCallback(async () => {
    try {
      const { data } = await listDocuments();
      setDocuments(data); setError("");
    } catch { setError("Failed to load documents."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  useEffect(() => {
    const processing = documents.filter((d) => d.status === "processing");
    if (!processing.length) return;
    const t = setInterval(async () => {
      const updates = await Promise.all(
        processing.map((d) => getDocument(d.id).then((r) => r.data).catch(() => null))
      );
      setDocuments((prev) => prev.map((d) => updates.find((u) => u?.id === d.id) || d));
      if (selected && processing.find((d) => d.id === selected.id)) {
        const u = updates.find((u) => u?.id === selected.id);
        if (u) setSelected(u);
      }
    }, POLL);
    return () => clearInterval(t);
  }, [documents, selected]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", paddingTop: 88, background: "#fff", boxSizing: "border-box" }}>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px", borderBottom: "1px solid #f1f5f9",
        background: "#fff", flexShrink: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Chat Workspace</span>
            {selected && (
              <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 999, background: selected.status === "ready" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${selected.status === "ready" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`, fontSize: 11, fontWeight: 600, color: selected.status === "ready" ? "#10b981" : "#f59e0b" }}>
                {selected.status === "ready" ? "Ready" : "Indexing"}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={fetchDocs}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <RefreshCw size={13} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setUploadOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff",
              fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)", transition: "box-shadow 0.2s",
            }}
          >
            <Plus size={14} /> Upload PDF
          </motion.button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ margin: "8px 16px 0", padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 13, color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {error}
          <button onClick={() => setError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Three-panel layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <CircularProgress size={24} style={{ color: P }} />
          </div>
        ) : (
          <>
            <DocumentSidebar
              documents={documents}
              selected={selected}
              onSelect={setSelected}
              onDeleted={(id) => {
                setDocuments((p) => p.filter((d) => d.id !== id));
                if (selected?.id === id) setSelected(null);
              }}
            />
            <div style={{ flex: 1, overflow: "hidden", minHeight: 0, display: "flex", flexDirection: "column" }}>
              {selected ? (
                <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
                  <ChatWindow document={selected} aiConfigured={aiConfigured} onRefreshAI={checkAI} />
                </div>
              ) : (
                <ChatWindow document={null} aiConfigured={aiConfigured} onRefreshAI={checkAI} />
              )}
            </div>
            <ContextPanel
              sources={[]}
              docName={selected?.original_name || ""}
              collapsed={ctxCollapsed}
              onToggle={() => setCtxCollapsed((s) => !s)}
            />
          </>
        )}
      </div>

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(doc) => { setDocuments((p) => [doc, ...p]); setSelected(doc); }}
      />
    </div>
  );
}
