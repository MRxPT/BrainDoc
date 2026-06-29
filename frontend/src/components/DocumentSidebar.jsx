import React, { useState } from "react";
import { Box, Typography, Tooltip, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { PictureAsPdfOutlined, DeleteOutlined, CheckCircleOutlined, ErrorOutlined, HourglassEmptyOutlined } from "@mui/icons-material";
import { deleteDocument } from "../api/documents";

const ACCENT = "#ff6a3d";
const STATUS = {
  ready:      { icon: <CheckCircleOutlined sx={{ fontSize: 10 }} />, color: "#22c55e" },
  processing: { icon: <HourglassEmptyOutlined sx={{ fontSize: 10 }} />, color: "#f59e0b" },
  error:      { icon: <ErrorOutlined sx={{ fontSize: 10 }} />, color: "#ef4444" },
};

function fmt(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentSidebar({ documents, selected, onSelect, onDeleted }) {
  const [deleting, setDeleting] = useState(null);
  const [hovered, setHovered]   = useState(null);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeleting(id);
    try { await deleteDocument(id); onDeleted(id); }
    catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  return (
    <Box sx={{
      width: 248, flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column",
      background: "rgba(255,255,255,0.015)",
      backdropFilter: "blur(20px)",
      height: "100%",
    }}>
      {/* Header */}
      <Box sx={{
        px: 2.5, py: 1.75,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", gap: 1,
      }}>
        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: ACCENT, boxShadow: `0 0 6px ${ACCENT}`, flexShrink: 0 }} />
        <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
          Documents
        </Typography>
      </Box>

      {documents.length === 0 ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, textAlign: "center" }}>
          <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <PictureAsPdfOutlined sx={{ fontSize: 32, color: "rgba(255,255,255,0.07)", mb: 1.5 }} />
          </motion.div>
          <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            No documents yet.<br />Upload a PDF to begin.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
          <AnimatePresence>
            {documents.map((doc, i) => {
              const sc = STATUS[doc.status] || STATUS.processing;
              const isSel = selected?.id === doc.id;
              const isHov = hovered === doc.id;

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Box
                    onClick={() => onSelect(doc)}
                    onMouseEnter={() => setHovered(doc.id)}
                    onMouseLeave={() => setHovered(null)}
                    sx={{
                      mx: 1, mb: 0.5, px: 1.5, py: 1.2, borderRadius: "9px",
                      cursor: "pointer", position: "relative",
                      background: isSel
                        ? "rgba(255,106,61,0.08)"
                        : isHov ? "rgba(255,255,255,0.03)" : "transparent",
                      border: "1px solid",
                      borderColor: isSel ? "rgba(255,106,61,0.2)" : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Box display="flex" alignItems="flex-start" gap={1.25} pr={2.5}>
                      <PictureAsPdfOutlined sx={{ fontSize: 15, color: isSel ? ACCENT : "rgba(255,255,255,0.2)", mt: 0.1, flexShrink: 0 }} />
                      <Box minWidth={0} flex={1}>
                        <Typography sx={{
                          fontSize: "0.78rem", fontWeight: 600, lineHeight: 1.3,
                          color: isSel ? "#f5f5f5" : "rgba(255,255,255,0.55)",
                        }} noWrap>
                          {doc.original_name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} mt={0.35}>
                          <Box sx={{ color: sc.color, display: "flex" }}>{sc.icon}</Box>
                          <Typography sx={{ fontSize: "0.65rem", color: doc.status === "error" ? "#ef4444" : "rgba(255,255,255,0.2)" }}>
                            {doc.status === "error" ? "Failed — re-upload"
                              : doc.status === "processing" ? "Indexing..."
                              : `${fmt(doc.size)} · ${doc.chunk_count} chunks`}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <AnimatePresence>
                      {(isHov || isSel) && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
                        >
                          {deleting === doc.id ? (
                            <CircularProgress size={11} sx={{ color: ACCENT }} />
                          ) : (
                            <Tooltip title="Delete">
                              <Box
                                onClick={(e) => handleDelete(e, doc.id)}
                                sx={{
                                  color: "rgba(255,255,255,0.15)", cursor: "pointer",
                                  display: "flex",
                                  "&:hover": { color: "#ef4444" },
                                  transition: "color 0.15s",
                                }}
                              >
                                <DeleteOutlined sx={{ fontSize: 13 }} />
                              </Box>
                            </Tooltip>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      )}
    </Box>
  );
}
