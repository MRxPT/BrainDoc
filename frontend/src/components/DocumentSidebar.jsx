import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { deleteDocument } from "../api/documents";

const P = "#2563eb"; // primary blue

const STATUS_CONFIG = {
  ready:      { icon: <CheckCircle size={10} />, color: "#10b981" },
  processing: { icon: <Clock size={10} />,       color: "#f59e0b" },
  error:      { icon: <AlertCircle size={10} />, color: "#ef4444" },
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
    <div style={{
      width: 260, flexShrink: 0,
      borderRight: "1px solid #f1f5f9",
      display: "flex", flexDirection: "column",
      background: "#fafbfc", height: "100%",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>
          Documents
        </p>
      </div>

      {documents.length === 0 ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <FileText size={20} color="#94a3b8" />
            </div>
          </motion.div>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
            No documents yet.<br />Upload a PDF to begin.
          </p>
        </div>
      ) : (
        <div style={{ flex: 1, overflow: "auto", padding: "8px 8px" }}>
          <AnimatePresence>
            {documents.map((doc, i) => {
              const sc = STATUS_CONFIG[doc.status] || STATUS_CONFIG.processing;
              const isSel = selected?.id === doc.id;
              const isHov = hovered === doc.id;

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: i * 0.04, duration: 0.28 }}
                >
                  <div
                    onClick={() => onSelect(doc)}
                    onMouseEnter={() => setHovered(doc.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      position: "relative", marginBottom: 2,
                      background: isSel ? "rgba(37,99,235,0.06)" : isHov ? "#f8fafc" : "transparent",
                      border: `1px solid ${isSel ? "rgba(37,99,235,0.2)" : "transparent"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingRight: 24 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: isSel ? "rgba(37,99,235,0.1)" : "#f1f5f9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <FileText size={14} color={isSel ? P : "#64748b"} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{
                          fontSize: 13, fontWeight: 600, lineHeight: 1.3, margin: "0 0 3px",
                          color: isSel ? "#0f172a" : "#334155",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {doc.original_name}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ color: sc.color, display: "flex" }}>{sc.icon}</span>
                          <span style={{ fontSize: 11, color: doc.status === "error" ? "#ef4444" : "#94a3b8" }}>
                            {doc.status === "error" ? "Failed — re-upload"
                              : doc.status === "processing" ? "Indexing..."
                              : `${fmt(doc.size)} · ${doc.chunk_count} chunks`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {(isHov || isSel) && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}
                        >
                          {deleting === doc.id ? (
                            <div style={{ width: 14, height: 14, border: "2px solid #e2e8f0", borderTopColor: P, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                          ) : (
                            <button
                              onClick={(e) => handleDelete(e, doc.id)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", padding: 2, display: "flex", borderRadius: 4, transition: "color 0.15s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
