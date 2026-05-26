

import React, { useState } from "react";
import { Box, Typography, Tooltip, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { PictureAsPdfOutlined, DeleteOutlined, CheckCircleOutlined, ErrorOutlined, HourglassEmptyOutlined } from "@mui/icons-material";
import { deleteDocument } from "../api/documents";
import { useAppTheme } from "../context/ThemeContext";

const STATUS = {
  ready:      { icon: <CheckCircleOutlined sx={{ fontSize: 11 }} />, color: "#22c55e" },
  processing: { icon: <HourglassEmptyOutlined sx={{ fontSize: 11 }} />, color: "#f59e0b" },
  error:      { icon: <ErrorOutlined sx={{ fontSize: 11 }} />, color: "#ef4444" },
};

function fmt(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentSidebar({ documents, selected, onSelect, onDeleted }) {
  const { mode } = useAppTheme();
  const isDark = mode === "dark";
  const [deleting, setDeleting] = useState(null);
  const [hovered, setHovered] = useState(null);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); setDeleting(id);
    try { await deleteDocument(id); onDeleted(id); }
    catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  return (
    <Box sx={{
      width: 256, flexShrink: 0,
      borderRight: "1px solid rgba(63,114,175,0.08)",
      display: "flex", flexDirection: "column",
      background: isDark ? "rgba(12,32,60,0.6)" : "rgba(249,247,247,0.92)", backdropFilter: "blur(20px)",
      height: "100%",
    }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: "1px solid rgba(63,114,175,0.07)" }}>
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(63,114,175,0.5)", textTransform: "uppercase" }}>
          Documents
        </Typography>
      </Box>

      {documents.length === 0 ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, textAlign: "center" }}>
          <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <PictureAsPdfOutlined sx={{ fontSize: 36, color: "rgba(63,114,175,0.15)", mb: 1.5 }} />
          </motion.div>
          <Typography sx={{ fontSize: "0.82rem", color: "rgba(90,120,160,0.35)", lineHeight: 1.5 }}>
            No documents yet.<br />Upload a PDF to begin.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
          <AnimatePresence>
            {documents.map((doc, i) => {
              const sc = STATUS[doc.status] || STATUS.processing;
              const isSelected = selected?.id === doc.id;
              const isHovered = hovered === doc.id;

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Box
                    onClick={() => onSelect(doc)}
                    onMouseEnter={() => setHovered(doc.id)}
                    onMouseLeave={() => setHovered(null)}
                    sx={{
                      mx: 1, mb: 0.5, px: 1.5, py: 1.25, borderRadius: "10px",
                      cursor: "pointer", position: "relative",
                      background: isSelected
                        ? "rgba(63,114,175,0.1)"
                        : isHovered ? "rgba(63,114,175,0.05)" : "transparent",
                      border: "1px solid",
                      borderColor: isSelected ? "rgba(63,114,175,0.28)" : "transparent",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <Box display="flex" alignItems="flex-start" gap={1.25} pr={2.5}>
                      <PictureAsPdfOutlined sx={{ fontSize: 17, color: isSelected ? "#3F72AF" : "rgba(63,114,175,0.3)", mt: 0.1, flexShrink: 0 }} />
                      <Box minWidth={0} flex={1}>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: isSelected ? (isDark ? "#f0f6ff" : "#112D4E") : (isDark ? "rgba(240,246,255,0.7)" : "rgba(17,45,78,0.7)"), lineHeight: 1.3 }} noWrap>
                          {doc.original_name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} mt={0.4}>
                          <Box sx={{ color: sc.color, display: "flex" }}>{sc.icon}</Box>
                          <Typography sx={{ fontSize: "0.68rem", color: doc.status === "error" ? "#ef4444" : (isDark ? "rgba(90,120,160,0.4)" : "rgba(17,45,78,0.45)") }}>
                            {doc.status === "error" ? "Failed  re-upload"
                              : doc.status === "processing" ? "Indexing..."
                              : `${fmt(doc.size)}  ${doc.chunk_count} chunks`}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Delete button */}
                    <AnimatePresence>
                      {(isHovered || isSelected) && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
                        >
                          {deleting === doc.id ? (
                            <CircularProgress size={12} sx={{ color: "#3F72AF" }} />
                          ) : (
                            <Tooltip title="Delete">
                              <Box
                                onClick={(e) => handleDelete(e, doc.id)}
                                sx={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(17,45,78,0.25)", cursor: "pointer", display: "flex", "&:hover": { color: "#ef4444" }, transition: "color 0.15s" }}
                              >
                                <DeleteOutlined sx={{ fontSize: 14 }} />
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


