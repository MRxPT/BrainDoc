import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Trash2, ExternalLink, Eye, EyeOff, Key, Zap } from "lucide-react";
import { getAISettings, saveAISettings, deleteAISettings } from "../api/settings";

const P = "#2563eb";
const EASE = [0.22, 0.61, 0.36, 1];

const PROVIDERS = [
  {
    id: "local", name: "Brain Core", badge: "NO KEY", badgeCol: "#10b981",
    model: "fastembed-bge-small", placeholder: "", url: null,
    desc: "Fast offline semantic search. ONNX-powered, no API key needed.",
  },
  {
    id: "groq", name: "Groq", badge: "FREE", badgeCol: P,
    model: "llama-3.3-70b-versatile", placeholder: "gsk_...",
    url: "https://console.groq.com/keys",
    desc: "Free tier. Best quality answers. Recommended for most users.",
  },
  {
    id: "gemini", name: "Google Gemini", badge: "FREE", badgeCol: P,
    model: "gemini-1.5-flash", placeholder: "AIza...",
    url: "https://aistudio.google.com/app/apikey",
    desc: "Free tier. Great for complex documents and long-form answers.",
  },
  {
    id: "openai", name: "OpenAI GPT-3.5", badge: "PAID", badgeCol: "#f59e0b",
    model: "gpt-3.5-turbo", placeholder: "sk-...",
    url: "https://platform.openai.com/api-keys",
    desc: "Requires a paid OpenAI account with credits.",
  },
];

export default function AISettingsDrawer({ open, onClose, onSaved }) {
  const [current, setCurrent]   = useState(null);
  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey]     = useState("");
  const [showKey, setShowKey]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getAISettings()
      .then(({ data }) => {
        setCurrent(data);
        if (data.is_configured && data.provider) setProvider(data.provider);
      })
      .catch(() => setCurrent({ is_configured: false }))
      .finally(() => setLoading(false));
  }, [open]);

  const sel = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];
  const hasKey = current?.is_configured;
  const noKey  = provider === "local";
  const canSave = noKey || hasKey || apiKey.trim();

  const handleSave = async () => {
    if (!canSave) { setError(`Enter your ${sel.name} API key.`); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const { data } = await saveAISettings({ provider, api_key: noKey ? provider : (apiKey.trim() || null) });
      setCurrent(data); setApiKey("");
      setSuccess(`${sel.name} is now active`);
      onSaved?.({ provider, label: sel.name });
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteAISettings();
      setCurrent({ is_configured: false, provider: "groq" });
      setSuccess("API key removed.");
      onSaved?.(null);
      setTimeout(() => setSuccess(""), 2500);
    } catch { setError("Failed to remove."); }
    finally { setSaving(false); }
  };

  const badgeStyle = (col) => ({
    padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
    background: col === "#10b981" ? "rgba(16,185,129,0.1)" : col === "#f59e0b" ? "rgba(245,158,11,0.1)" : "rgba(37,99,235,0.1)",
    border: `1px solid ${col === "#10b981" ? "rgba(16,185,129,0.25)" : col === "#f59e0b" ? "rgba(245,158,11,0.25)" : "rgba(37,99,235,0.25)"}`,
    color: col,
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.35)", backdropFilter: "blur(4px)", zIndex: 3000 }}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 3001,
              width: "100%", maxWidth: 440,
              background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: P, margin: "0 0 4px" }}>Settings</p>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.025em" }}>AI Model</h2>
              </div>
              <motion.button whileHover={{ scale: 1.08, rotate: 90 }} whileTap={{ scale: 0.94 }}
                onClick={onClose}
                style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
                  <div style={{ width: 24, height: 24, border: `2px solid rgba(37,99,235,0.2)`, borderTopColor: P, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                </div>
              ) : (
                <>
                  {/* Active banner */}
                  <AnimatePresence>
                    {current?.is_configured && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", marginBottom: 16, borderRadius: 10, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Check size={13} color="#10b981" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>
                              {PROVIDERS.find((p) => p.id === current.provider)?.name} is active
                            </span>
                            {current.api_key_preview && (
                              <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{current.api_key_preview}</span>
                            )}
                          </div>
                          <button onClick={handleDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", display: "flex", padding: 3, borderRadius: 5, transition: "color 0.15s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Alerts */}
                  {success && <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 9, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#10b981" }}>{success}</div>}
                  {error   && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#dc2626" }}>{error}</div>}

                  {/* Step 1 */}
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: P, margin: "0 0 12px" }}>Step 1 — AI Provider</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {PROVIDERS.map((p) => {
                      const isSel = provider === p.id;
                      const isAct = current?.is_configured && current?.provider === p.id;
                      return (
                        <div key={p.id} onClick={() => { setProvider(p.id); setApiKey(""); setError(""); setSuccess(""); }}
                          style={{ padding: "13px 15px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${isSel ? "rgba(37,99,235,0.3)" : "#f1f5f9"}`, background: isSel ? "rgba(37,99,235,0.04)" : "#fafbfc", transition: "all 0.15s", userSelect: "none" }}
                          onMouseEnter={(e) => { if (!isSel) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}}
                          onMouseLeave={(e) => { if (!isSel) { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.background = "#fafbfc"; }}}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isSel ? P : "#e2e8f0", boxShadow: isSel ? `0 0 8px rgba(37,99,235,0.5)` : "none", flexShrink: 0, transition: "all 0.15s" }} />
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</span>
                            <span style={badgeStyle(p.badgeCol)}>{p.badge}</span>
                            {isAct && <span style={{ padding: "2px 7px", borderRadius: 999, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 10, fontWeight: 700, color: "#10b981" }}>ACTIVE</span>}
                            <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto", fontFamily: "monospace" }}>{p.model}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "#64748b", margin: 0, paddingLeft: 16 }}>{p.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 2 */}
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: P, margin: "0 0 12px" }}>
                    Step 2 — {noKey ? "No key needed" : hasKey ? "Update key (optional)" : "Enter API key"}
                  </p>

                  <AnimatePresence mode="wait">
                    {noKey ? (
                      <motion.div key="local" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 10, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)", marginBottom: 20 }}>
                          <Check size={13} color="#10b981" />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>Local AI — no API key required. Click Save.</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key={provider} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {sel.url && (
                          <div style={{ padding: "11px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", marginBottom: 12 }}>
                            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 5px" }}>Get your free {sel.name} API key:</p>
                            <a href={sel.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: P, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                              {sel.url} <ExternalLink size={11} />
                            </a>
                          </div>
                        )}
                        <div style={{ position: "relative", marginBottom: 20 }}>
                          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Key size={14} /></div>
                          <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => { setApiKey(e.target.value); setError(""); }}
                            placeholder={hasKey ? "Leave blank to keep existing key" : sel.placeholder}
                            style={{ display: "block", width: "100%", padding: "12px 44px 12px 36px", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#fff", color: "#0f172a", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                            onFocus={(e) => { e.target.style.borderColor = P; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                          />
                          <button type="button" onClick={() => setShowKey((s) => !s)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" }}>
                            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer — Save button */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", flexShrink: 0 }}>
              <motion.button
                whileHover={canSave && !saving ? { scale: 1.01, boxShadow: "0 4px 16px rgba(37,99,235,0.3)" } : {}}
                whileTap={canSave ? { scale: 0.99 } : {}}
                onClick={handleSave} disabled={saving || !canSave}
                style={{ width: "100%", padding: "13px 0", borderRadius: 11, border: "none", background: (!canSave || saving) ? "#f1f5f9" : "linear-gradient(135deg,#2563eb,#7c3aed)", color: (!canSave || saving) ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 15, cursor: (!canSave || saving) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: (canSave && !saving) ? "0 2px 8px rgba(37,99,235,0.25)" : "none", transition: "all 0.2s" }}
              >
                {saving ? "Saving…" : "Save AI Settings"}
              </motion.button>
            </div>
          </motion.div>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
}
