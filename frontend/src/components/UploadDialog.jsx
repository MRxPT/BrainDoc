import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle, Sparkles } from "lucide-react";
import { uploadDocument } from "../api/documents";

const P = "#2563eb";
const EASE = [0.22, 0.61, 0.36, 1];

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, zIndex: 10 }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)" }} />
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg,rgba(37,99,235,0.08),rgba(124,58,237,0.06))", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}>
            <Sparkles size={26} color={P} />
          </motion.div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <AnimatePresence mode="wait">
          <motion.p key={stageIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.25 }}
            style={{ fontSize: 14, fontWeight: 700, color: P, margin: "0 0 4px" }}>{STAGES[stageIdx]}</motion.p>
        </AnimatePresence>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Processing your document...</p>
      </div>

      <div style={{ width: "100%", maxWidth: 260 }}>
        <div style={{ height: 4, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${P},#7c3aed)` }} />
        </div>
        <p style={{ fontSize: 11, color: P, textAlign: "right", margin: "4px 0 0", fontFamily: "monospace", fontWeight: 600 }}>{progress}%</p>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {STAGES.map((_, i) => (
          <motion.div key={i} animate={{ scale: i === stageIdx ? 1.3 : 1, opacity: i <= stageIdx ? 1 : 0.25 }} transition={{ duration: 0.25 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: i <= stageIdx ? P : "#e2e8f0", boxShadow: i === stageIdx ? `0 0 8px rgba(37,99,235,0.5)` : "none" }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function UploadDialog({ open, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const openPicker = () => { if (inputRef.current) { inputRef.current.value = ""; inputRef.current.click(); } };

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Only PDF files are supported."); return; }
    if (f.size > 50 * 1024 * 1024) { setError("File must be under 50 MB."); return; }
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
        onChange={(e) => handleFile(e.target.files[0])} />

      <AnimatePresence>
        <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>

          <motion.div key="modal" initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.38, ease: EASE }}
            style={{ width: "100%", maxWidth: 500, background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 32, position: "relative", boxShadow: "0 20px 80px rgba(15,23,42,0.2)" }}>

            <AnimatePresence>
              {uploading && <ProcessingOverlay progress={progress} />}
            </AnimatePresence>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 3px", letterSpacing: "-0.02em" }}>Upload Document</h2>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>PDF · Max 50 MB · Digital or scanned</p>
              </div>
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                onClick={handleClose} disabled={uploading}
                style={{ width: 32, height: 32, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}>
                <X size={14} />
              </motion.button>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>{error}</div>}

            {/* Drop zone */}
            <div onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => { if (!file) openPicker(); }}
              style={{
                border: `2px dashed ${file ? "#10b981" : dragging ? P : "#e2e8f0"}`,
                borderRadius: 14, padding: "36px 24px", textAlign: "center",
                cursor: file ? "default" : "pointer",
                background: file ? "rgba(16,185,129,0.03)" : dragging ? "rgba(37,99,235,0.03)" : "#fafbfc",
                transition: "all 0.2s",
              }}>
              {file ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <FileText size={44} color="#10b981" />
                    <CheckCircle size={16} color="#10b981" style={{ position: "absolute", bottom: -2, right: -6, background: "#fff", borderRadius: "50%" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>{file.name}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                    Change file
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: dragging ? "rgba(37,99,235,0.08)" : "#f1f5f9", border: `1px solid ${dragging ? "rgba(37,99,235,0.2)" : "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "center", transform: dragging ? "translateY(-4px)" : "translateY(0)", transition: "all 0.2s" }}>
                    <Upload size={22} color={dragging ? P : "#94a3b8"} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Drag & drop your PDF</p>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                      or{" "}
                      <span onClick={(e) => { e.stopPropagation(); openPicker(); }}
                        style={{ color: P, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                        click to browse
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={handleClose} disabled={uploading}
                style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 14, cursor: uploading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = "#94a3b8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                Cancel
              </button>
              <motion.button whileHover={file && !uploading ? { scale: 1.01, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" } : {}} whileTap={file ? { scale: 0.99 } : {}}
                onClick={handleUpload} disabled={!file || uploading}
                style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: (!file || uploading) ? "#f1f5f9" : "linear-gradient(135deg,#2563eb,#7c3aed)", color: (!file || uploading) ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 14, cursor: (!file || uploading) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: (file && !uploading) ? "0 2px 8px rgba(37,99,235,0.25)" : "none", transition: "all 0.2s" }}>
                {uploading ? "Processing..." : "Upload & Index"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
