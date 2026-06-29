import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, LinearProgress, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUploadOutlined, PictureAsPdfOutlined, CloseOutlined, CheckCircleOutlined, AutoAwesomeOutlined } from "@mui/icons-material";
import { uploadDocument } from "../api/documents";

const ACCENT = "#ff6a3d";
const STAGES = [
  "Extracting Document Intelligence",
  "Generating Vector Embeddings",
  "Building Retrieval Index",
  "Preparing Neural Search",
];

function ProcessingOverlay({ progress }) {
  const [stageIdx, setStageIdx] = useState(0);
  useEffect(() => {
    setStageIdx(0);
    let i = 0;
    const next = () => { i++; if (i < STAGES.length) { setStageIdx(i); setTimeout(next, 1100); } };
    const t = setTimeout(next, 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "absolute", inset: 0, borderRadius: 20,
        background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 24, padding: 32, zIndex: 10,
      }}
    >
      <Box sx={{ position: "relative", width: 72, height: 72 }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute", inset: -12, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,106,61,0.2) 0%, transparent 70%)`,
          }}
        />
        <Box sx={{
          width: 72, height: 72, borderRadius: "18px",
          background: "rgba(255,106,61,0.08)",
          border: "1px solid rgba(255,106,61,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 30px rgba(255,106,61,0.15)",
        }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
            <AutoAwesomeOutlined sx={{ fontSize: 30, color: ACCENT }} />
          </motion.div>
        </Box>
      </Box>

      <Box textAlign="center">
        <AnimatePresence mode="wait">
          <motion.div key={stageIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: ACCENT, mb: 0.5 }}>{STAGES[stageIdx]}</Typography>
          </motion.div>
        </AnimatePresence>
        <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>Processing your document...</Typography>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 280 }}>
        <LinearProgress variant="determinate" value={progress} sx={{
          borderRadius: 2, height: 2,
          bgcolor: "rgba(255,255,255,0.05)",
          "& .MuiLinearProgress-bar": { background: ACCENT, borderRadius: 2 },
        }} />
        <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,106,61,0.4)", mt: 0.75, textAlign: "right" }}>{progress}%</Typography>
      </Box>

      <Box display="flex" gap={1}>
        {STAGES.map((_, i) => (
          <motion.div key={i} animate={{ scale: i === stageIdx ? 1.3 : 1, opacity: i <= stageIdx ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: i <= stageIdx ? ACCENT : "rgba(255,255,255,0.1)", boxShadow: i === stageIdx ? `0 0 8px ${ACCENT}` : "none" }} />
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
}

export default function UploadDialog({ open, onClose, onUploaded }) {
  const [file, setFile]           = useState(null);
  const [progress, setProgress]   = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [dragging, setDragging]   = useState(false);
  const inputRef = useRef(null);

  const openPicker = () => { if (inputRef.current) { inputRef.current.value = ""; inputRef.current.click(); } };
  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Only PDF files are supported."); return; }
    if (f.size > 50 * 1024 * 1024)   { setError("File must be under 50 MB."); return; }
    setError(""); setFile(f);
  };
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const { data } = await uploadDocument(fd, setProgress);
      setTimeout(() => { onUploaded(data); handleClose(); }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
      setUploading(false); setProgress(0);
    }
  };
  const handleClose = () => {
    if (uploading) return;
    setFile(null); setError(""); setProgress(0); onClose();
  };

  if (!open) return null;

  return (
    <>
      <input ref={inputRef} type="file" accept="application/pdf"
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0, pointerEvents: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <AnimatePresence>
        <motion.div
          key="bd"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
          }}
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%", maxWidth: 500,
              background: "rgba(16,16,16,0.97)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: 32, position: "relative",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Top accent */}
            <Box sx={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: `linear-gradient(90deg,transparent,rgba(255,106,61,0.4),transparent)`, pointerEvents: "none" }} />

            <AnimatePresence>
              {uploading && <ProcessingOverlay progress={progress} />}
            </AnimatePresence>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box>
                <Typography variant="h5" fontWeight={800} mb={0.25} sx={{ color: "#f5f5f5" }}>Upload Document</Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>PDF · Max 50 MB · Digital or scanned</Typography>
              </Box>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={handleClose} disabled={uploading}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 8, width: 30, height: 30, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.3)",
                }}>
                <CloseOutlined style={{ fontSize: 15 }} />
              </motion.button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", "& .MuiAlert-icon": { color: "#ef4444" } }}>
                {error}
              </Alert>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => { if (!file) openPicker(); }}
              style={{
                border: `1.5px dashed ${file ? "#22c55e" : dragging ? ACCENT : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14, padding: "38px 24px", textAlign: "center",
                cursor: file ? "default" : "pointer",
                background: file ? "rgba(34,197,94,0.03)" : dragging ? "rgba(255,106,61,0.05)" : "rgba(255,255,255,0.015)",
                transition: "all 0.2s",
              }}
            >
              {file ? (
                <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <PictureAsPdfOutlined sx={{ fontSize: 48, color: "#22c55e" }} />
                    <CheckCircleOutlined sx={{ fontSize: 18, color: "#22c55e", position: "absolute", bottom: -2, right: -6, background: "#0a0a0a", borderRadius: "50%" }} />
                  </Box>
                  <Typography fontWeight={700} sx={{ color: "#f5f5f5", fontSize: "0.9rem" }}>{file.name}</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</Typography>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", padding: "4px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.73rem", fontFamily: "Inter,sans-serif" }}>
                    Change file
                  </button>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: "14px",
                    background: "rgba(255,106,61,0.07)", border: "1px solid rgba(255,106,61,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transform: dragging ? "translateY(-5px)" : "translateY(0)", transition: "transform 0.2s",
                  }}>
                    <CloudUploadOutlined sx={{ fontSize: 26, color: ACCENT }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700} mb={0.5} sx={{ color: "#f5f5f5", fontSize: "0.9rem" }}>Drag & drop your PDF</Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
                      or{" "}
                      <span onClick={(e) => { e.stopPropagation(); openPicker(); }}
                        style={{ color: ACCENT, fontWeight: 700, cursor: "pointer" }}>
                        click to browse
                      </span>
                    </Typography>
                  </Box>
                </Box>
              )}
            </div>

            <Box display="flex" gap={1.5} mt={3}>
              <button onClick={handleClose} disabled={uploading}
                style={{ flex: 1, padding: "11px 0", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.3)", fontWeight: 600, fontSize: "0.85rem", cursor: uploading ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleUpload} disabled={!file || uploading}
                style={{
                  flex: 2, padding: "11px 0", borderRadius: 9, border: "none",
                  background: !file || uploading ? "rgba(255,106,61,0.15)" : ACCENT,
                  color: !file || uploading ? "rgba(255,255,255,0.2)" : "#fff",
                  fontWeight: 800, fontSize: "0.85rem",
                  cursor: !file || uploading ? "not-allowed" : "pointer",
                  fontFamily: "Inter,sans-serif",
                  boxShadow: file && !uploading ? `0 0 20px rgba(255,106,61,0.25)` : "none",
                  transition: "all 0.2s",
                }}>
                {uploading ? "Processing..." : "Upload & Index"}
              </button>
            </Box>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
