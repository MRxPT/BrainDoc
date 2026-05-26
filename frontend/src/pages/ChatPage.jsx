import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Tooltip, CircularProgress, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { AddOutlined, RefreshOutlined, AutoAwesomeOutlined } from "@mui/icons-material";
import DocumentSidebar from "../components/DocumentSidebar";
import ChatWindow from "../components/ChatWindow";
import UploadDialog from "../components/UploadDialog";
import { LampContainer } from "../components/ui/lamp";
import { listDocuments, getDocument } from "../api/documents";
import { getAISettings } from "../api/settings";
import { useAppTheme } from "../context/ThemeContext";

const POLL = 3000;

export default function ChatPage() {
  const { mode } = useAppTheme();
  const isDark = mode === "dark";
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiConfigured, setAiConfigured] = useState(null);

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
      setDocuments(data);
      setError("");
    } catch {
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  useEffect(() => {
    const processing = documents.filter((d) => d.status === "processing");
    if (!processing.length) return;
    const t = setInterval(async () => {
      const updates = await Promise.all(
        processing.map((d) => getDocument(d.id).then((r) => r.data).catch(() => null))
      );
      setDocuments((prev) =>
        prev.map((d) => updates.find((u) => u?.id === d.id) || d)
      );
      if (selected && processing.find((d) => d.id === selected.id)) {
        const u = updates.find((u) => u?.id === selected.id);
        if (u) setSelected(u);
      }
    }, POLL);
    return () => clearInterval(t);
  }, [documents, selected]);

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 56px)",
      position: "relative",
      zIndex: 1,
    }}>
      {/*  Top bar  */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 3, py: 1.25,
        borderBottom: "1px solid rgba(63,114,175,0.08)",
        background: isDark ? "rgba(12,32,60,0.7)" : "rgba(249,247,247,0.95)",
        backdropFilter: "blur(20px)",
        flexShrink: 0,
        zIndex: 10,
      }}>
        <Box display="flex" alignItems="center" gap={1.25}>
          <AutoAwesomeOutlined sx={{ fontSize: 15, color: "#3F72AF" }} />
          <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.01em", color: isDark ? "#F9F7F7" : "#112D4E" }}>
            Brain<span style={{ color: "#3F72AF" }}>Doc</span>
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={fetchDocs}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid rgba(63,114,175,0.15)",
                background: "transparent",
                color: isDark ? "rgba(63,114,175,0.5)" : "rgba(63,114,175,0.6)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <RefreshOutlined style={{ fontSize: 15 }} />
            </motion.button>
          </Tooltip>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(63,114,175,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setUploadOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 16px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg,#3F72AF,#2d5a8e)",
              color: "#fff", fontWeight: 800, fontSize: "0.8rem",
              cursor: "pointer", fontFamily: "Inter,sans-serif",
              boxShadow: "0 0 16px rgba(63,114,175,0.25)",
            }}>
            <AddOutlined style={{ fontSize: 15 }} /> Upload PDF
          </motion.button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ mx: 2, mt: 1, borderRadius: 2, flexShrink: 0 }}>
          {error}
        </Alert>
      )}

      {/*  Main content  */}
      <Box display="flex" flex={1} overflow="hidden" sx={{ minHeight: 0 }}>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" width="100%">
            <CircularProgress sx={{ color: "#3F72AF" }} size={28} />
          </Box>
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

            {/*  Right panel: lamp OR chat  */}
            <Box flex={1} overflow="hidden" sx={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
              {selected ? (
                /* Active document -> wrap in full-height box so ChatWindow's
                   internal height:"100%" has a proper flex reference */
                <Box flex={1} overflow="hidden" sx={{ minHeight: 0 }}>
                  <ChatWindow document={selected} aiConfigured={aiConfigured} onRefreshAI={checkAI} />
                </Box>
              ) : (
                /* No document -> full-area lamp (study desk with table lamp) */
                <Box sx={{ flex: 1, height: "100%", minHeight: 0 }}>
                  <LampContainer>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.8, ease: "easeInOut" }}
                      style={{ textAlign: "center" }}
                    >
                      {/* Primary headline - largest, brightest, sits right in the light */}
                      <Typography sx={{
                        fontSize: "2.4rem",
                        fontWeight: 900,
                        background: "linear-gradient(180deg, #ffffff 0%, #67e8f9 50%, #0891b2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.15,
                        mb: 1.5,
                        textShadow: "none",
                      }}>
                        Study smarter
                      </Typography>

                      {/* Subtitle - secondary, dimmer, smaller */}
                      <Typography sx={{
                        fontSize: "0.9rem",
                        color: "rgba(148,216,240,0.55)",
                        mb: 3.5,
                        lineHeight: 1.75,
                        fontWeight: 400,
                        letterSpacing: "0.01em",
                      }}>
                        Select a document from the sidebar<br />
                        to begin your AI-powered study session
                      </Typography>

                      {/* Tag chips - tertiary, lowest visual weight */}
                      <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                        {["Upload PDF", "Semantic Search", "AI Analysis"].map((tag) => (
                          <Box key={tag} sx={{
                            px: 1.75, py: 0.45, borderRadius: "100px",
                            background: "rgba(6,182,212,0.07)",
                            border: "1px solid rgba(6,182,212,0.15)",
                            fontSize: "0.7rem",
                            color: "rgba(103,232,249,0.4)",
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                          }}>
                            {tag}
                          </Box>
                        ))}
                      </Box>
                    </motion.div>
                  </LampContainer>
                </Box>
              )}
            </Box>
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
