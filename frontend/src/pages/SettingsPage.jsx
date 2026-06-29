import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Alert, CircularProgress, InputAdornment, IconButton, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleOutlined, KeyOutlined, DeleteOutlined,
  Visibility, VisibilityOff, OpenInNewOutlined,
  PersonOutlined, AutoAwesomeOutlined, SettingsOutlined, ChatOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { getAISettings, saveAISettings, deleteAISettings } from "../api/settings";
import { GlassCard, NeonBadge, SidebarNav, ToggleSwitch, SliderInput, AccentButton, AvatarCircle } from "../components/ui/design-system";
import { useAuth } from "../context/AuthContext";

const A = "#ff6a3d";

const NAV_ITEMS = [
  { id: "ai",          label: "AI Model",    icon: <AutoAwesomeOutlined sx={{ fontSize: 17 }} /> },
  { id: "retrieval",   label: "Retrieval",   icon: <SettingsOutlined sx={{ fontSize: 17 }} /> },
  { id: "workspace",   label: "Workspace",   icon: <ChatOutlined sx={{ fontSize: 17 }} /> },
  { id: "appearance",  label: "Appearance",  icon: <PersonOutlined sx={{ fontSize: 17 }} /> },
];

const PROVIDERS = [
  {
    id: "local", name: "Brain Core", badge: "NO KEY", badgeColor: "#22c55e",
    model: "fastembed-bge-small", placeholder: "",
    desc: "Fast offline semantic search. ONNX-powered, no API key needed.",
    url: null,
  },
  {
    id: "groq", name: "Groq", badge: "FREE", badgeColor: A,
    model: "llama-3.3-70b-versatile", placeholder: "gsk_...",
    desc: "Free tier. Best quality answers. Recommended for most users.",
    url: "https://console.groq.com/keys",
  },
  {
    id: "gemini", name: "Google Gemini", badge: "FREE", badgeColor: A,
    model: "gemini-1.5-flash", placeholder: "AIza...",
    desc: "Free tier. Great for complex documents and long answers.",
    url: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "openai", name: "OpenAI GPT-3.5", badge: "PAID", badgeColor: "#f59e0b",
    model: "gpt-3.5-turbo", placeholder: "sk-...",
    desc: "Requires a paid OpenAI account with credits.",
    url: "https://platform.openai.com/api-keys",
  },
];

function SectionLabel({ children }) {
  return (
    <Typography sx={{
      fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.14em",
      color: "rgba(255,106,61,0.45)", textTransform: "uppercase", mb: 2,
    }}>
      {children}
    </Typography>
  );
}

function AISection({ current, setCurrent }) {
  const [provider, setProvider] = useState(() => current?.is_configured ? current.provider : "groq");
  const [apiKey, setApiKey]     = useState("");
  const [showKey, setShowKey]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  const sel = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];
  const hasKey = current?.is_configured;
  const noKey  = provider === "local";
  const needsKey = !noKey && !hasKey && !apiKey.trim();
  const canSave  = !needsKey;

  const handleSave = async () => {
    if (needsKey) { setError(`Please enter your ${sel.name} API key.`); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const payload = { provider, api_key: noKey ? provider : (apiKey.trim() || null) };
      const { data } = await saveAISettings(payload);
      setCurrent(data); setApiKey("");
      setSuccess(`${sel.name} is now active`);
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
    } catch { setError("Failed to remove key."); }
    finally { setSaving(false); }
  };

  return (
    <Box>
      <SectionLabel>Step 1 — AI Provider</SectionLabel>

      {/* Active banner */}
      <AnimatePresence>
        {current?.is_configured && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Box sx={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              p: 2, mb: 2.5, borderRadius: "11px",
              background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.14)",
            }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#22c55e" }} />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#22c55e" }}>
                  {PROVIDERS.find((p) => p.id === current.provider)?.name} is active
                </Typography>
                {current.api_key_preview && (
                  <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {current.api_key_preview}
                  </Typography>
                )}
              </Box>
              <Tooltip title="Remove API key">
                <Box onClick={handleDelete} sx={{ cursor: "pointer", color: "rgba(255,255,255,0.15)", "&:hover": { color: "#ef4444" }, display: "flex", transition: "color 0.15s" }}>
                  <DeleteOutlined sx={{ fontSize: 14 }} />
                </Box>
              </Tooltip>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", "& .MuiAlert-icon": { color: "#ef4444" } }} onClose={() => setError("")}>{error}</Alert>}

      <Box display="flex" flexDirection="column" gap={1} mb={3.5}>
        {PROVIDERS.map((p) => {
          const isSel = provider === p.id;
          const isAct = current?.is_configured && current?.provider === p.id;
          return (
            <div
              key={p.id}
              onClick={() => { setProvider(p.id); setApiKey(""); setError(""); setSuccess(""); }}
              style={{
                padding: "13px 16px", borderRadius: 11, cursor: "pointer",
                border: `1px solid ${isSel ? "rgba(255,106,61,0.28)" : "rgba(255,255,255,0.05)"}`,
                background: isSel ? "rgba(255,106,61,0.05)" : "rgba(255,255,255,0.015)",
                transition: "all 0.15s", userSelect: "none",
              }}
              onMouseEnter={(e) => { if (!isSel) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
              onMouseLeave={(e) => { if (!isSel) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.015)"; } }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={0.3}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, bgcolor: isSel ? A : "rgba(255,255,255,0.12)", boxShadow: isSel ? `0 0 7px ${A}` : "none", transition: "all 0.15s" }} />
                <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", color: "#f5f5f5" }}>{p.name}</Typography>
                <NeonBadge color={p.badgeColor === A ? "orange" : p.badgeColor === "#22c55e" ? "green" : "amber"} size="xs">{p.badge}</NeonBadge>
                {isAct && <NeonBadge color="green" size="xs">ACTIVE</NeonBadge>}
                <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", ml: "auto", fontFamily: "'JetBrains Mono', monospace" }}>{p.model}</Typography>
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", ml: 3.5 }}>{p.desc}</Typography>
            </div>
          );
        })}
      </Box>

      <SectionLabel>
        Step 2 — {noKey ? "No key needed" : hasKey ? "Update key (optional)" : "Enter API key"}
      </SectionLabel>

      <AnimatePresence mode="wait">
        {noKey ? (
          <motion.div key="local" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Box sx={{ p: 2, borderRadius: "10px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.14)", display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <CheckCircleOutlined sx={{ fontSize: 14, color: "#22c55e" }} />
              <Typography sx={{ fontSize: "0.83rem", color: "#22c55e", fontWeight: 600 }}>Local AI — no API key required. Click Save.</Typography>
            </Box>
          </motion.div>
        ) : (
          <motion.div key={provider} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {sel.url && (
              <Box sx={{ p: 2, mb: 2, borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography sx={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.3)", mb: 0.75 }}>Get your free {sel.name} API key:</Typography>
                <a href={sel.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: A, fontSize: "0.76rem", fontWeight: 700, textDecoration: "none" }}>
                  {sel.url} <OpenInNewOutlined style={{ fontSize: 12 }} />
                </a>
              </Box>
            )}
            <TextField
              fullWidth
              label={`${sel.name} API Key`}
              placeholder={hasKey ? "Leave blank to keep existing key" : sel.placeholder}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(""); }}
              type={showKey ? "text" : "password"}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><KeyOutlined sx={{ fontSize: 14, color: "rgba(255,255,255,0.15)" }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowKey((s) => !s)} edge="end" size="small" sx={{ color: "rgba(255,255,255,0.2)" }}>
                      {showKey ? <VisibilityOff sx={{ fontSize: 14 }} /> : <Visibility sx={{ fontSize: 14 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={hasKey ? "Leave blank to keep your existing key, or type a new one to replace it." : "Stored securely and never shared."}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AccentButton onClick={handleSave} disabled={saving || !canSave} loading={saving} size="md" fullWidth>
        {saving ? "Saving..." : "Save AI Settings"}
      </AccentButton>
    </Box>
  );
}

function RetrievalSection() {
  const [chunkSize, setChunkSize] = useState(400);
  const [topK, setTopK] = useState(5);
  const [threshold, setThreshold] = useState(0.6);

  return (
    <Box>
      <SectionLabel>Retrieval Configuration</SectionLabel>
      <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", mb: 3.5, lineHeight: 1.6 }}>
        These settings control how BrainDoc splits and retrieves document content. Changes take effect on the next document upload.
      </Typography>
      <SliderInput value={chunkSize} onChange={setChunkSize} min={100} max={1000} step={50} label="Chunk Size (tokens)"
        hint={<Box display="flex" justifyContent="space-between" width="100%"><span>Precise (100)</span><span>Broad (1000)</span></Box>}
      />
      <SliderInput value={topK} onChange={setTopK} min={1} max={20} step={1} label="Top-K Results"
        hint={<Box display="flex" justifyContent="space-between" width="100%"><span>Focused (1)</span><span>Broad (20)</span></Box>}
      />
      <SliderInput value={threshold} onChange={setThreshold} min={0} max={1} step={0.05} label="Similarity Threshold"
        hint={<Box display="flex" justifyContent="space-between" width="100%"><span>Permissive (0.0)</span><span>Strict (1.0)</span></Box>}
      />
      <Box mt={3}>
        <AccentButton size="md">Apply Retrieval Settings</AccentButton>
      </Box>
    </Box>
  );
}

function WorkspaceSection() {
  const [autoEmbed, setAutoEmbed] = useState(true);
  const [sessionPersist, setSessionPersist] = useState(false);

  return (
    <Box>
      <SectionLabel>Workspace Settings</SectionLabel>
      <ToggleSwitch
        checked={autoEmbed}
        onChange={setAutoEmbed}
        label="Auto-embed on upload"
        description="Automatically start indexing PDFs as soon as they are uploaded"
      />
      <ToggleSwitch
        checked={sessionPersist}
        onChange={setSessionPersist}
        label="Persist chat sessions"
        description="Keep conversation history between sessions (requires storage)"
      />
      <Box sx={{ mt: 3, p: 2.5, borderRadius: "11px", background: "rgba(255,106,61,0.04)", border: "1px solid rgba(255,106,61,0.12)" }}>
        <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,106,61,0.7)", lineHeight: 1.6 }}>
          ⚠ BrainDoc uses ephemeral in-memory storage. Uploaded PDFs and embeddings are cleared when the session ends or the server restarts.
        </Typography>
      </Box>
    </Box>
  );
}

function AppearanceSection() {
  return (
    <Box>
      <SectionLabel>Appearance</SectionLabel>
      <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)", mb: 3, lineHeight: 1.6 }}>
        BrainDoc uses a fixed dark theme optimized for deep-focus document work.
      </Typography>
      <Box sx={{ p: 3, borderRadius: "12px", background: "rgba(22,22,22,0.7)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#f5f5f5" }}>Matte Black Theme</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", mt: 0.25 }}>BrainDoc default — optimized for readability</Typography>
        </Box>
        <NeonBadge color="green">Active</NeonBadge>
      </Box>
      <Box sx={{ p: 3, mt: 1.5, borderRadius: "12px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>Light Theme</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", mt: 0.25 }}>Coming soon</Typography>
        </Box>
        <NeonBadge color="muted">Soon</NeonBadge>
      </Box>
      <Box sx={{ mt: 3.5 }}>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", mb: 1.5 }}>Brand Accent</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ width: 36, height: 36, borderRadius: "9px", background: A, boxShadow: "0 0 18px rgba(255,106,61,0.4)" }} />
          <Box>
            <Typography sx={{ fontSize: "0.82rem", color: "#f5f5f5", fontFamily: "'JetBrains Mono', monospace" }}>#ff6a3d</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>BrainDoc orange — locked as brand color</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("ai");
  const [current, setCurrent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    getAISettings()
      .then(({ data }) => { setCurrent(data); })
      .catch(() => { setCurrent({ is_configured: false }); })
      .finally(() => setPageLoading(false));
  }, []);

  if (pageLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "calc(100vh - 56px)", zIndex: 1, position: "relative" }}>
        <CircularProgress sx={{ color: A }} />
      </Box>
    );
  }

  const SIDEBAR_PAGES = [
    { id: "/dashboard", label: "Profile",  icon: <PersonOutlined sx={{ fontSize: 17 }} /> },
    { id: "/chat",      label: "Chat",     icon: <ChatOutlined sx={{ fontSize: 17 }} /> },
    { id: "/settings",  label: "Settings", icon: <SettingsOutlined sx={{ fontSize: 17 }} />, badge: current?.is_configured ? "ON" : null, badgeColor: "green" },
  ];

  return (
    <Box sx={{
      display: "flex", minHeight: "calc(100vh - 56px)",
      position: "relative", zIndex: 1, background: "#0a0a0a",
    }}>
      {/* ── Left Sidebar ── */}
      <Box sx={{
        width: 240, flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(14,14,14,0.8)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 56, height: "calc(100vh - 56px)",
      }}>
        <Box sx={{ px: 3, pt: 4, pb: 3, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", mb: 2 }}>
            Navigation
          </Typography>
          <SidebarNav items={SIDEBAR_PAGES} active={location.pathname} onSelect={(id) => navigate(id)} />
        </Box>

        {/* Settings sub-nav */}
        <Box sx={{ px: 2, pt: 2.5, flex: 1 }}>
          <Typography sx={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", px: 1, mb: 1.5 }}>
            Settings
          </Typography>
          <SidebarNav items={NAV_ITEMS} active={activeSection} onSelect={setActiveSection} />
        </Box>

        <Box sx={{ px: 3, py: 3, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <AvatarCircle name={user?.username || "U"} size={30} showStatus />
            <Box minWidth={0}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#f5f5f5" }} noWrap>{user?.username || "User"}</Typography>
              <Typography sx={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.25)" }} noWrap>{user?.email}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box sx={{ flex: 1, overflow: "auto", p: { xs: 3, md: 5 }, maxWidth: 720 }}>
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <Box mb={5}>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,106,61,0.45)", textTransform: "uppercase", mb: 0.75 }}>
              Settings
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ color: "#f5f5f5", letterSpacing: "-0.03em", fontFamily: "'DM Sans', Inter, sans-serif" }}>
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label || "Settings"}
            </Typography>
          </Box>

          {/* Section content card */}
          <GlassCard hover={false}>
            <Box p={{ xs: 3, md: 4 }}>
              {activeSection === "ai"          && <AISection current={current} setCurrent={setCurrent} />}
              {activeSection === "retrieval"   && <RetrievalSection />}
              {activeSection === "workspace"   && <WorkspaceSection />}
              {activeSection === "appearance"  && <AppearanceSection />}
            </Box>
          </GlassCard>
        </motion.div>
      </Box>
    </Box>
  );
}
