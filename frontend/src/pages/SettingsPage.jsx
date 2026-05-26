import React, { useState, useEffect } from "react";
import {
  Box, TextField, Typography, Alert, CircularProgress,
  InputAdornment, IconButton, Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleOutlined, KeyOutlined, DeleteOutlined,
  Visibility, VisibilityOff, OpenInNewOutlined, ArrowBackOutlined,
} from "@mui/icons-material";
import { useAppTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { getAISettings, saveAISettings, deleteAISettings } from "../api/settings";

const PROVIDERS = [
  {
    id: "local", name: "Brain Core", badge: "NO KEY", color: "#22c55e",
    model: "keyword-extractive", placeholder: "",
    desc: "Fast offline semantic extraction engine. No model needed. Works offline. Best for simple questions on digital PDFs.",
    url: null,
  },
  {
    id: "huggingface", name: "Neuro Gen", badge: "NO KEY", color: "#22c55e",
    model: "google/flan-t5-base", placeholder: "",
    desc: "Advanced generative reasoning engine. Runs flan-t5-base locally. No API key. Better quality answers for complex questions.",
    url: null,
  },
  {
    id: "groq", name: "Groq", badge: "FREE", color: "#3F72AF",
    model: "llama-3.3-70b-versatile", placeholder: "gsk_...",
    desc: "Free tier. Best for scanned/handwritten PDFs. Highly recommended for best answer quality.",
    url: "https://console.groq.com/keys",
  },
  {
    id: "gemini", name: "Google Gemini", badge: "FREE", color: "#3F72AF",
    model: "gemini-1.5-flash", placeholder: "AIza...",
    desc: "Free tier. Great for complex documents and long-form answers.",
    url: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "openai", name: "OpenAI GPT-3.5", badge: "PAID", color: "#f59e0b",
    model: "gpt-3.5-turbo", placeholder: "sk-...",
    desc: "Requires a paid OpenAI account with credits.",
    url: "https://platform.openai.com/api-keys",
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";
  const [current, setCurrent]     = useState(null);   // what's saved in DB
  const [provider, setProvider]   = useState("groq"); // selected in UI
  const [apiKey, setApiKey]       = useState("");
  const [showKey, setShowKey]     = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");

  // Load current settings on mount
  useEffect(() => {
    getAISettings()
      .then(({ data }) => {
        setCurrent(data);
        if (data.is_configured && data.provider) {
          setProvider(data.provider);
        }
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, []);

  const sel = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];

  // When user picks a provider, clear the key field and errors
  const handleSelectProvider = (id) => {
    setProvider(id);
    setApiKey("");
    setError("");
    setSuccess("");
  };

  // Can save when:
  // - Local AI (no key needed)
  // - Typed a new key
  // - Already has a key saved (can switch provider or re-save same)
  const hasExistingKey = current?.is_configured === true;
  const noKeyProviders = ["local", "huggingface"];
  const needsNewKey    = !noKeyProviders.includes(provider) && !hasExistingKey && !apiKey.trim();
  const canSave        = !needsNewKey;

  const handleSave = async () => {
    if (needsNewKey) {
      setError(`Please enter your ${sel.name} API key to continue.`);
      return;
    }
    setSaving(true); setError(""); setSuccess("");
    try {
      // Send provider + key (or null to keep existing key)
      const payload = {
        provider,
        api_key: noKeyProviders.includes(provider) ? provider : (apiKey.trim() || null),
      };
      const { data } = await saveAISettings(payload);
      setCurrent(data);
      setApiKey("");
      setSuccess(`${sel.name} is now active`);
      // Don't auto-redirect  let user stay and change again if they want
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      await deleteAISettings();
      setCurrent({ is_configured: false, provider: "groq" });
      setApiKey("");
      setSuccess("API key removed.");
    } catch {
      setError("Failed to remove key.");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center"
        sx={{ height: "calc(100vh - 56px)", position: "relative", zIndex: 1 }}>
        <CircularProgress sx={{ color: "#3F72AF" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 56px)", py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 640, mx: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/*  Header  */}
          <Box display="flex" alignItems="center" gap={1.5} mb={0.75}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid rgba(63,114,175,0.18)",
                background: "transparent", color: "rgba(63,114,175,0.6)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ArrowBackOutlined style={{ fontSize: 15 }} />
            </button>
            <Typography variant="h4" fontWeight={800} sx={{ color: isDark ? "#F9F7F7" : "#112D4E" }}>AI Settings</Typography>
          </Box>
          <Typography sx={{ color: isDark ? "rgba(219,226,239,0.5)" : "rgba(17,45,78,0.5)", mb: 4, fontSize: "0.88rem", transition: "color 0.4s" }}>
            Choose your AI provider and manage your API key. You can change this anytime.
          </Typography>

          {/*  Active status banner  */}
          <AnimatePresence>
            {current?.is_configured && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                <Box sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  p: 2, mb: 3, borderRadius: "12px",
                  background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.22)",
                }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <CheckCircleOutlined sx={{ fontSize: 17, color: "#22c55e" }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#22c55e" }}>
                        {PROVIDERS.find((p) => p.id === current.provider)?.name || current.provider} is active
                      </Typography>
                      {current.api_key_preview && (
                        <Typography sx={{ fontSize: "0.7rem", color: "rgba(90,120,160,0.35)" }}>
                          {current.api_key_preview}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Tooltip title="Remove API key">
                    <Box
                      onClick={handleDelete}
                      sx={{ cursor: "pointer", color: "rgba(255,255,255,0.25)", "&:hover": { color: "#ef4444" }, display: "flex", transition: "color 0.15s" }}
                    >
                      <DeleteOutlined sx={{ fontSize: 16 }} />
                    </Box>
                  </Tooltip>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/*  Main card  NO overflow:hidden  */}
          <Box sx={{
            background: isDark ? "rgba(17,45,78,0.9)" : "rgba(249,247,247,0.97)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(63,114,175,0.14)",
            borderRadius: "20px",
            p: { xs: 3, md: 4 },
            position: "relative",
            // overflow is intentionally NOT hidden  it blocks click events
          }}>
            {/* Top shimmer */}
            <Box sx={{
              position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
              background: "linear-gradient(90deg,transparent,rgba(63,114,175,0.4),transparent)",
              pointerEvents: "none",
            }} />

            {/*  Step 1: Choose provider  */}
            <Typography sx={{
              fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em",
              color: "rgba(63,114,175,0.45)", textTransform: "uppercase", mb: 2,
            }}>
              Step 1  Choose Provider
            </Typography>

            <Box display="flex" flexDirection="column" gap={1.25} mb={3.5}>
              {PROVIDERS.map((p) => {
                const isSelected = provider === p.id;
                const isActive   = current?.is_configured && current?.provider === p.id;
                return (
                  // Plain <div>  no motion wrapper  so clicks always register
                  <div
                    key={p.id}
                    onClick={() => handleSelectProvider(p.id)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      cursor: "pointer",
                      border: `1px solid ${isSelected ? "rgba(63,114,175,0.4)" : "rgba(63,114,175,0.1)"}`,
                      background: isSelected ? "rgba(63,114,175,0.09)" : "rgba(63,114,175,0.02)",
                      transition: "border-color 0.18s, background 0.18s",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "rgba(63,114,175,0.25)";
                        e.currentTarget.style.background  = "rgba(63,114,175,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "rgba(63,114,175,0.1)";
                        e.currentTarget.style.background  = "rgba(63,114,175,0.02)";
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                      {/* Selection dot */}
                      <Box sx={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        bgcolor: isSelected ? "#3F72AF" : (isDark ? "rgba(255,255,255,0.18)" : "rgba(17,45,78,0.18)"),
                        boxShadow: isSelected ? "0 0 8px rgba(63,114,175,0.7)" : "none",
                        transition: "all 0.18s",
                      }} />
                      <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: isDark ? "#F9F7F7" : "#112D4E" }}>{p.name}</Typography>
                      {/* Badge */}
                      <Box sx={{
                        px: 1, py: 0.15, borderRadius: "100px",
                        background: `${p.color}16`, border: `1px solid ${p.color}30`,
                        fontSize: "0.62rem", fontWeight: 800, color: p.color, letterSpacing: "0.06em",
                      }}>
                        {p.badge}
                      </Box>
                      {/* Active indicator */}
                      {isActive && (
                        <Box sx={{
                          px: 1, py: 0.15, borderRadius: "100px",
                          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                          fontSize: "0.6rem", fontWeight: 800, color: "#22c55e", letterSpacing: "0.06em",
                          ml: 0.5,
                        }}>
                          ACTIVE
                        </Box>
                      )}
                      <Typography sx={{ fontSize: "0.68rem", color: isDark ? "rgba(90,120,160,0.35)" : "rgba(17,45,78,0.4)", ml: "auto" }}>
                        {p.model}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.78rem", color: isDark ? "rgba(219,226,239,0.5)" : "rgba(17,45,78,0.55)", ml: 3 }}>
                      {p.desc}
                    </Typography>
                  </div>
                );
              })}
            </Box>

            {/*  Step 2: API key  */}
            <Typography sx={{
              fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em",
              color: "rgba(63,114,175,0.45)", textTransform: "uppercase", mb: 2,
            }}>
              Step 2 {" "}
              {noKeyProviders.includes(provider)
                ? "No key needed"
                : hasExistingKey
                ? "Update key (optional)"
                : "Enter API key"}
            </Typography>

            <AnimatePresence mode="wait">
              {noKeyProviders.includes(provider) ? (
                <motion.div key="local" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Box sx={{
                    p: 2, borderRadius: "10px",
                    background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.22)",
                    display: "flex", alignItems: "center", gap: 1.5,
                  }}>
                    <CheckCircleOutlined sx={{ fontSize: 17, color: "#22c55e" }} />
                    <Typography sx={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: 600 }}>
                      Local AI needs no API key  just click Save
                    </Typography>
                  </Box>
                </motion.div>
              ) : (
                <motion.div key={provider} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Link to get key */}
                  {sel.url && (
                    <Box sx={{
                      p: 2, mb: 2, borderRadius: "10px",
                      background: "rgba(63,114,175,0.05)", border: "1px solid rgba(63,114,175,0.12)",
                    }}>
                      <Typography sx={{ fontSize: "0.78rem", color: isDark ? "rgba(219,226,239,0.55)" : "rgba(17,45,78,0.55)", mb: 0.75 }}>
                        Get your free {sel.name} API key:
                      </Typography>
                      <a
                        href={sel.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#3F72AF", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}
                      >
                        {sel.url} <OpenInNewOutlined style={{ fontSize: 13 }} />
                      </a>
                    </Box>
                  )}

                  {/* Key input */}
                  <TextField
                    fullWidth
                    label={`${sel.name} API Key`}
                    placeholder={hasExistingKey ? "Leave blank to keep existing key" : sel.placeholder}
                    value={apiKey}
                    onChange={(e) => { setApiKey(e.target.value); setError(""); }}
                    type={showKey ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyOutlined sx={{ fontSize: 16, color: "rgba(63,114,175,0.3)" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowKey((s) => !s)}
                            edge="end" size="small"
                            sx={{ color: "rgba(255,255,255,0.3)" }}
                          >
                            {showKey
                              ? <VisibilityOff sx={{ fontSize: 16 }} />
                              : <Visibility sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      hasExistingKey
                        ? "Leave blank to keep your existing key, or type a new one to replace it."
                        : "Your key is stored securely and never shared."
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/*  Save button  plain <button> so it always fires  */}
            <button
              onClick={handleSave}
              disabled={saving || !canSave}
              style={{
                marginTop: 24, width: "100%", padding: "13px 0",
                borderRadius: 10, border: "none",
                background: saving || !canSave
                  ? "rgba(63,114,175,0.15)"
                  : "linear-gradient(135deg,#3F72AF,#2d5a8e)",
                color: saving || !canSave ? (isDark ? "rgba(255,255,255,0.3)" : "rgba(17,45,78,0.3)") : "#fff",
                fontWeight: 800, fontSize: "0.95rem",
                cursor: saving || !canSave ? "not-allowed" : "pointer",
                fontFamily: "Inter,sans-serif",
                boxShadow: canSave && !saving ? "0 0 22px rgba(63,114,175,0.28)" : "none",
                transition: "all 0.2s",
              }}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            {/* Go to chat link */}
            {current?.is_configured && (
              <Box textAlign="center" mt={2}>
                <Typography
                  onClick={() => navigate("/chat")}
                  sx={{
                    fontSize: "0.82rem", color: "rgba(63,114,175,0.5)",
                    cursor: "pointer", "&:hover": { color: "#3F72AF" },
                    transition: "color 0.15s",
                  }}
                >
                   Back to Chat
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}






