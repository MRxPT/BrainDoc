import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Settings, MessageSquare, User, LayoutDashboard,
  Check, Trash2, ExternalLink, Eye, EyeOff, Key, ChevronRight } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getAISettings, saveAISettings, deleteAISettings } from "../api/settings";
import { useAuth } from "../context/AuthContext";

const P = "#2563eb";
const EASE = [0.22, 0.61, 0.36, 1];

const PROVIDERS = [
  { id: "local",  name: "Brain Core",     badge: "NO KEY", badgeCol: "#10b981",
    model: "fastembed-bge-small", placeholder: "", url: null,
    desc: "Fast offline semantic search. ONNX-powered, no API key needed." },
  { id: "groq",   name: "Groq",           badge: "FREE",   badgeCol: P,
    model: "llama-3.3-70b-versatile", placeholder: "gsk_...",
    url: "https://console.groq.com/keys",
    desc: "Free tier. Best quality answers. Recommended for most users." },
  { id: "gemini", name: "Google Gemini",  badge: "FREE",   badgeCol: P,
    model: "gemini-1.5-flash", placeholder: "AIza...",
    url: "https://aistudio.google.com/app/apikey",
    desc: "Free tier. Great for complex documents and long-form answers." },
  { id: "openai", name: "OpenAI GPT-3.5", badge: "PAID",   badgeCol: "#f59e0b",
    model: "gpt-3.5-turbo", placeholder: "sk-...",
    url: "https://platform.openai.com/api-keys",
    desc: "Requires a paid OpenAI account with credits." },
];

const NAV_SECTIONS = [
  { id: "ai",         icon: <Sparkles size={15}/>,  label: "AI Model" },
  { id: "retrieval",  icon: <Settings size={15}/>,  label: "Retrieval" },
  { id: "workspace",  icon: <MessageSquare size={15}/>, label: "Workspace" },
  { id: "appearance", icon: <User size={15}/>,       label: "Appearance" },
];

function Sidebar({ user, active, onSelect }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pages = [
    { id: "/dashboard", icon: <LayoutDashboard size={15}/>, label: "Profile" },
    { id: "/chat",      icon: <MessageSquare size={15}/>,   label: "Chat" },
    { id: "/settings",  icon: <Settings size={15}/>,        label: "Settings" },
  ];
  return (
    <div style={{ width: 240, flexShrink: 0, borderRight: "1px solid #f1f5f9", background: "#fafbfc", display: "flex", flexDirection: "column", position: "sticky", top: 64, height: "calc(100vh - 64px)" }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 10px" }}>Navigation</p>
        {pages.map((n) => {
          const isA = location.pathname === n.id;
          return (
            <button key={n.id} onClick={() => navigate(n.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, marginBottom: 2, background: isA ? "rgba(37,99,235,0.06)" : "transparent", border: `1.5px solid ${isA ? "rgba(37,99,235,0.15)" : "transparent"}`, borderLeft: `2px solid ${isA ? P : "transparent"}`, color: isA ? "#0f172a" : "#64748b", fontWeight: isA ? 600 : 400, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (!isA) { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}}
              onMouseLeave={(e) => { if (!isA) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}}
            >
              {n.icon}{n.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "16px 12px", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 8px", padding: "0 8px" }}>Settings</p>
        {NAV_SECTIONS.map((n) => {
          const isA = active === n.id;
          return (
            <button key={n.id} onClick={() => onSelect(n.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 9, marginBottom: 2, background: isA ? "rgba(37,99,235,0.06)" : "transparent", border: `1.5px solid ${isA ? "rgba(37,99,235,0.15)" : "transparent"}`, borderLeft: `2px solid ${isA ? P : "transparent"}`, color: isA ? "#0f172a" : "#64748b", fontWeight: isA ? 600 : 400, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (!isA) { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}}
              onMouseLeave={(e) => { if (!isA) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}}
            >
              {n.icon}{n.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{user?.username?.[0]?.toUpperCase() || "U"}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.username || "User"}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", ...style }}>{children}</div>;
}

function SectionTitle({ children }) {
  return <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 16px" }}>{children}</p>;
}

function AISection({ current, setCurrent }) {
  const [provider, setProvider] = useState(() => current?.is_configured ? current.provider : "groq");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const sel = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];
  const hasKey = current?.is_configured;
  const noKey = provider === "local";
  const canSave = noKey || hasKey || apiKey.trim();

  const handleSave = async () => {
    if (!canSave) { setError(`Enter your ${sel.name} API key.`); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const { data } = await saveAISettings({ provider, api_key: noKey ? provider : (apiKey.trim() || null) });
      setCurrent(data); setApiKey("");
      setSuccess(`${sel.name} is now active`);
    } catch (err) { setError(err.response?.data?.detail || "Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await deleteAISettings(); setCurrent({ is_configured: false, provider: "groq" }); setSuccess("API key removed."); }
    catch { setError("Failed to remove key."); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <SectionTitle>Step 1 — Choose AI Provider</SectionTitle>
      <AnimatePresence>
        {current?.is_configured && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", marginBottom: 16, borderRadius: 12, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Check size={14} color="#10b981" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{PROVIDERS.find((p) => p.id === current.provider)?.name} is active</span>
                {current.api_key_preview && <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{current.api_key_preview}</span>}
              </div>
              <button onClick={handleDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", display: "flex", padding: 4, borderRadius: 6, transition: "color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}>
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {success && <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#10b981" }}>{success}</div>}
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#dc2626" }}>{error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {PROVIDERS.map((p) => {
          const isSel = provider === p.id;
          const isAct = current?.is_configured && current?.provider === p.id;
          return (
            <div key={p.id} onClick={() => { setProvider(p.id); setApiKey(""); setError(""); setSuccess(""); }}
              style={{ padding: "14px 16px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${isSel ? "rgba(37,99,235,0.3)" : "#f1f5f9"}`, background: isSel ? "rgba(37,99,235,0.04)" : "#fafbfc", transition: "all 0.15s", userSelect: "none" }}
              onMouseEnter={(e) => { if (!isSel) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}}
              onMouseLeave={(e) => { if (!isSel) { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.background = "#fafbfc"; }}}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: isSel ? P : "#e2e8f0", boxShadow: isSel ? `0 0 8px rgba(37,99,235,0.5)` : "none", flexShrink: 0, transition: "all 0.15s" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{p.name}</span>
                <span style={{ padding: "1px 7px", borderRadius: 999, background: p.badgeCol === "#10b981" ? "rgba(16,185,129,0.08)" : p.badgeCol === "#f59e0b" ? "rgba(245,158,11,0.08)" : "rgba(37,99,235,0.08)", border: `1px solid ${p.badgeCol === "#10b981" ? "rgba(16,185,129,0.2)" : p.badgeCol === "#f59e0b" ? "rgba(245,158,11,0.2)" : "rgba(37,99,235,0.2)"}`, fontSize: 10, fontWeight: 700, color: p.badgeCol }}>{p.badge}</span>
                {isAct && <span style={{ padding: "1px 7px", borderRadius: 999, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 10, fontWeight: 700, color: "#10b981" }}>ACTIVE</span>}
                <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto", fontFamily: "monospace" }}>{p.model}</span>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0, paddingLeft: 18 }}>{p.desc}</p>
            </div>
          );
        })}
      </div>

      <SectionTitle>Step 2 — {noKey ? "No key needed" : hasKey ? "Update key (optional)" : "Enter API key"}</SectionTitle>
      <AnimatePresence mode="wait">
        {noKey ? (
          <motion.div key="local" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)", marginBottom: 20 }}>
              <Check size={14} color="#10b981" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>Local AI — no API key required. Click Save.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key={provider} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {sel.url && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px" }}>Get your free {sel.name} API key:</p>
                <a href={sel.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: P, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  {sel.url} <ExternalLink size={11} />
                </a>
              </div>
            )}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}><Key size={14} /></div>
              <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => { setApiKey(e.target.value); setError(""); }}
                placeholder={hasKey ? "Leave blank to keep existing key" : sel.placeholder}
                style={{ display: "block", width: "100%", padding: "12px 44px 12px 38px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#0f172a", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onFocus={(e) => { e.target.style.borderColor = P; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowKey((s) => !s)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 4 }}>
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={canSave && !saving ? { scale: 1.01, boxShadow: "0 4px 16px rgba(37,99,235,0.3)" } : {}} whileTap={canSave ? { scale: 0.99 } : {}}
        onClick={handleSave} disabled={saving || !canSave}
        style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: (!canSave || saving) ? "#f1f5f9" : "linear-gradient(135deg,#2563eb,#7c3aed)", color: (!canSave || saving) ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 15, cursor: (!canSave || saving) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: (canSave && !saving) ? "0 2px 8px rgba(37,99,235,0.25)" : "none", transition: "all 0.2s" }}>
        {saving ? "Saving..." : "Save AI Settings"}
      </motion.button>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{desc}</p>}
      </div>
      <div onClick={() => onChange(!checked)}
        style={{ width: 42, height: 23, borderRadius: 99, background: checked ? P : "#e2e8f0", position: "relative", cursor: "pointer", flexShrink: 0, boxShadow: checked ? "0 0 10px rgba(37,99,235,0.3)" : "none", transition: "background 0.2s, box-shadow 0.2s" }}>
        <motion.div animate={{ x: checked ? 21 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ position: "absolute", top: 2, width: 19, height: 19, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}

function SliderRow({ label, value, onChange, min, max, step }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>{label}</p>
        <span style={{ fontSize: 13, fontWeight: 700, color: P, fontFamily: "monospace" }}>{value}</span>
      </div>
      <div style={{ position: "relative", height: 5, borderRadius: 99, background: "#f1f5f9" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 99, background: `linear-gradient(90deg,${P},#7c3aed)`, boxShadow: "0 0 6px rgba(37,99,235,0.3)" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
      </div>
    </div>
  );
}

function RetrievalSection() {
  const [chunkSize, setChunkSize] = useState(400);
  const [topK, setTopK] = useState(5);
  const [threshold, setThreshold] = useState(0.6);
  return (
    <div>
      <SectionTitle>Retrieval Configuration</SectionTitle>
      <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.65 }}>
        Controls how BrainDoc splits and retrieves document content. Changes take effect on the next upload.
      </p>
      <SliderRow label="Chunk Size (tokens)" value={chunkSize} onChange={setChunkSize} min={100} max={1000} step={50} />
      <SliderRow label="Top-K Results" value={topK} onChange={setTopK} min={1} max={20} step={1} />
      <SliderRow label="Similarity Threshold" value={threshold} onChange={setThreshold} min={0} max={1} step={0.05} />
      <div style={{ marginTop: 20 }}>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}>
          Apply Settings
        </motion.button>
      </div>
    </div>
  );
}

function WorkspaceSection() {
  const [autoEmbed, setAutoEmbed] = useState(true);
  const [persist, setPersist] = useState(false);
  return (
    <div>
      <SectionTitle>Workspace Settings</SectionTitle>
      <ToggleRow label="Auto-embed on upload" desc="Automatically index PDFs as soon as they are uploaded" checked={autoEmbed} onChange={setAutoEmbed} />
      <ToggleRow label="Persist chat sessions" desc="Keep conversation history between sessions" checked={persist} onChange={setPersist} />
      <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fed7aa" }}>
        <p style={{ fontSize: 13, color: "#b45309", margin: 0, lineHeight: 1.6 }}>
          ⚠ BrainDoc uses ephemeral in-memory storage. Uploaded PDFs and embeddings are cleared when the session ends.
        </p>
      </div>
    </div>
  );
}

function AppearanceSection() {
  return (
    <div>
      <SectionTitle>Appearance</SectionTitle>
      <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.65 }}>BrainDoc uses a clean white theme with blue accents — optimized for focused document work.</p>
      <div style={{ padding: "16px", borderRadius: 12, background: "#f0f7ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" }}>Light Theme</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>BrainDoc default — clean, premium, accessible</p>
        </div>
        <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 11, fontWeight: 700, color: "#10b981" }}>Active</span>
      </div>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px", fontFamily: "monospace" }}>#2563eb → #7c3aed</p>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Brand gradient — locked</p>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [section, setSection] = useState("ai");
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAISettings()
      .then(({ data }) => setCurrent(data))
      .catch(() => setCurrent({ is_configured: false }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 64px)", background: "#f8fafc" }}>
        <CircularProgress size={24} style={{ color: P }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", background: "#f8fafc" }}>
      <Sidebar user={user} active={section} onSelect={setSection} />
      <div style={{ flex: 1, overflow: "auto", padding: "40px 48px", maxWidth: 760 }}>
        <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P, margin: "0 0 6px" }}>Settings</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.025em" }}>
              {NAV_SECTIONS.find((n) => n.id === section)?.label}
            </h1>
          </div>
          <Card style={{ padding: "28px 32px" }}>
            {section === "ai"         && <AISection current={current} setCurrent={setCurrent} />}
            {section === "retrieval"  && <RetrievalSection />}
            {section === "workspace"  && <WorkspaceSection />}
            {section === "appearance" && <AppearanceSection />}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
