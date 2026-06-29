import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Tooltip, CircularProgress, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { AddOutlined, RefreshOutlined, AutoAwesomeOutlined, ChevronRightOutlined, ChevronLeftOutlined } from "@mui/icons-material";
import DocumentSidebar from "../components/DocumentSidebar";
import ChatWindow from "../components/ChatWindow";
import UploadDialog from "../components/UploadDialog";
import { listDocuments, getDocument } from "../api/documents";
import { getAISettings } from "../api/settings";
import { NeonBadge, ProgressBar } from "../components/ui/design-system";

const A = "#ff6a3d";
const POLL = 3000;

// ── Context Panel (right side) ────────────────────────────────────────────
function ContextPanel({ sources = [], docName = "", collapsed, onToggle }) {
  const mockSources = sources.length > 0 ? sources : [
    "The document discusses retrieval-augmented generation as a method to improve LLM accuracy...",
    "Vector embeddings enable semantic similarity search across large document corpora...",
    "In-memory FAISS indexing provides sub-millisecond nearest-neighbor retrieval...",
  ];

  return (
    <Box sx={{
      width: collapsed ? 0 : 280, flexShrink: 0,
      borderLeft: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(12,12,12,0.85)", backdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      position: "relative",
    }}>
      {/* Toggle button */}
      <Box
        onClick={onToggle}
        sx={{
          position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)",
          width: 28, height: 28, borderRadius: "50%", zIndex: 10,
          background: "rgba(22,22,22,0.95)", border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", backdropFilter: "blur(12px)",
          color: "rgba(255,255,255,0.4)",
          transition: "border-color 0.15s, color 0.15s",
          "&:hover": { borderColor: "rgba(255,106,61,0.3)", color: A },
        }}
      >
        {collapsed
          ? <ChevronLeftOutlined sx={{ fontSize: 14 }} />
          : <ChevronRightOutlined sx={{ fontSize: 14 }} />}
      </Box>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Header */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
              <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
                Retrieved Context
              </Typography>
              <NeonBadge color="orange" size="xs">{mockSources.length}</NeonBadge>
            </Box>
            {docName && (
              <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", mt: 0.5 }} noWrap>
                {docName}
              </Typography>
            )}
          </Box>

          {/* Source chunks */}
          <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
            <AnimatePresence>
              {mockSources.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Box sx={{
                    p: 2, mb: 1.5, borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer", transition: "all 0.15s",
                    "&:hover": { background: "rgba(255,106,61,0.04)", borderColor: "rgba(255,106,61,0.12)" },
                  }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography sx={{ fontSize: "0.58rem", fontWeight: 800, color: "rgba(255,106,61,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Chunk {i + 1}
                      </Typography>
                      <Typography sx={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
                        p.{i + 1}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {src}
                    </Typography>
                    <Box mt={1.5}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography sx={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.2)" }}>Relevance</Typography>
                        <Typography sx={{ fontSize: "0.58rem", color: A, fontFamily: "'JetBrains Mono', monospace" }}>
                          {(0.95 - i * 0.08).toFixed(2)}
                        </Typography>
                      </Box>
                      <ProgressBar value={(0.95 - i * 0.08) * 100} max={100} height={2} />
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          {/* Footer hint */}
          <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.15)", lineHeight: 1.5 }}>
              These are the semantic chunks retrieved for the last AI response.
            </Typography>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <Box sx={{
      flex: 1, height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <Box sx={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(255,106,61,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
        width: 280, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,106,61,0.45), transparent)",
        boxShadow: "0 0 20px rgba(255,106,61,0.25)",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: "15px", mx: "auto", mb: 3,
            background: "rgba(255,106,61,0.06)", border: "1px solid rgba(255,106,61,0.13)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 40px rgba(255,106,61,0.08)",
          }}>
            <AutoAwesomeOutlined sx={{ fontSize: 26, color: A }} />
          </Box>
        </motion.div>

        <Typography sx={{
          fontSize: "1.5rem", fontWeight: 800,
          background: "linear-gradient(180deg, #f5f5f5 0%, rgba(255,255,255,0.35) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.03em", mb: 1.25,
          fontFamily: "'DM Sans', Inter, sans-serif",
        }}>
          Select a document
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.22)", mb: 3.5, lineHeight: 1.7 }}>
          Choose a PDF from the sidebar to start<br />your AI-powered chat session
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
          {["Upload PDF", "Semantic Search", "RAG Intelligence"].map((tag) => (
            <Box key={tag} sx={{
              px: 1.75, py: 0.4, borderRadius: "100px",
              background: "rgba(255,106,61,0.04)", border: "1px solid rgba(255,106,61,0.1)",
              fontSize: "0.68rem", color: "rgba(255,106,61,0.38)", fontWeight: 500,
            }}>
              {tag}
            </Box>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
}

// ── Main ChatPage ─────────────────────────────────────────────────────────
export default function ChatPage() {
  const [documents, setDocuments]     = useState([]);
  const [selected, setSelected]       = useState(null);
  const [uploadOpen, setUploadOpen]   = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
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
    <Box sx={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 56px)",
      position: "relative", zIndex: 1,
      background: "#0a0a0a",
    }}>
      {/* Top bar */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 3, py: 1.25,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(10,10,10,0.92)", backdropFilter: "blur(24px)",
        flexShrink: 0, zIndex: 10,
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: A, boxShadow: `0 0 8px ${A}` }} />
          <Typography sx={{ fontWeight: 800, fontSize: "0.83rem", color: "#f5f5f5", fontFamily: "'DM Sans', Inter, sans-serif" }}>
            Brain<Box component="span" sx={{ color: A }}>Doc</Box>
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.18)" }}>
            / chat workspace
          </Typography>
          {selected && (
            <NeonBadge color={selected.status === "ready" ? "green" : "amber"}>
              {selected.status === "ready" ? "Ready" : "Indexing"}
            </NeonBadge>
          )}
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Refresh documents">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={fetchDocs}
              style={{
                width: 30, height: 30, borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "transparent",
                color: "rgba(255,255,255,0.25)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <RefreshOutlined style={{ fontSize: 13 }} />
            </motion.button>
          </Tooltip>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,106,61,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setUploadOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 7, border: "none",
              background: A, color: "#fff",
              fontWeight: 700, fontSize: "0.78rem",
              cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
              boxShadow: "0 0 14px rgba(255,106,61,0.22)",
              transition: "box-shadow 0.2s",
            }}>
            <AddOutlined style={{ fontSize: 14 }} /> Upload PDF
          </motion.button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError("")}
          sx={{ mx: 2, mt: 1, borderRadius: 2, flexShrink: 0, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}>
          {error}
        </Alert>
      )}

      {/* Three-panel layout */}
      <Box display="flex" flex={1} overflow="hidden" sx={{ minHeight: 0 }}>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" width="100%">
            <CircularProgress sx={{ color: A }} size={26} />
          </Box>
        ) : (
          <>
            {/* Panel 1 — Document sidebar */}
            <DocumentSidebar
              documents={documents}
              selected={selected}
              onSelect={setSelected}
              onDeleted={(id) => {
                setDocuments((p) => p.filter((d) => d.id !== id));
                if (selected?.id === id) setSelected(null);
              }}
            />

            {/* Panel 2 — Chat area */}
            <Box flex={1} overflow="hidden" sx={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
              {selected ? (
                <Box flex={1} overflow="hidden" sx={{ minHeight: 0 }}>
                  <ChatWindow document={selected} aiConfigured={aiConfigured} onRefreshAI={checkAI} />
                </Box>
              ) : (
                <EmptyState />
              )}
            </Box>

            {/* Panel 3 — Context panel (collapsible) */}
            <ContextPanel
              sources={[]}
              docName={selected?.original_name || ""}
              collapsed={ctxCollapsed}
              onToggle={() => setCtxCollapsed((s) => !s)}
            />
          </>
        )}
      </Box>

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(doc) => { setDocuments((p) => [doc, ...p]); setSelected(doc); }}
      />
    </Box>
  );
}
