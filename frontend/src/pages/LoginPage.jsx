import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Alert, InputAdornment, IconButton, Link } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ACCENT = "#ff6a3d";

// Pulse dot for "waking up" banner
function PulseDot({ color = ACCENT }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }}
    />
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Show "server is waking up" hint after 4 seconds of loading
  const [showWakeHint, setShowWakeHint] = useState(false);

  useEffect(() => {
    let t;
    if (loading) {
      t = setTimeout(() => setShowWakeHint(true), 4000);
    } else {
      setShowWakeHint(false);
    }
    return () => clearTimeout(t);
  }, [loading]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await loginUser(form.email, form.password);
      navigate("/");
    } catch (err) {
      // Handle timeout / network errors gracefully
      const msg =
        err.message?.includes("starting up") || err.message?.includes("timeout")
          ? "The server is warming up (free tier cold start). Please wait a moment and try again."
          : err.response?.data?.detail || "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "calc(100vh - 56px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      px: 2, position: "relative", zIndex: 1,
    }}>
      {/* Center radial glow */}
      <Box sx={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600,
        background: "radial-gradient(ellipse, rgba(255,106,61,0.06) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
      >
        <Box sx={{
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          p: { xs: 3.5, md: 5 },
          position: "relative",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Top accent shimmer */}
          <Box sx={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(255,106,61,0.4), transparent)`,
            pointerEvents: "none",
          }} />

          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1.5} mb={4}>
            <Box sx={{
              width: 30, height: 30, borderRadius: "8px",
              background: `linear-gradient(135deg, ${ACCENT}, #cc4a1f)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 16px rgba(255,106,61,0.4)`,
            }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "2px", border: "1.5px solid rgba(255,255,255,0.9)", transform: "rotate(45deg)" }} />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", color: "#f5f5f5" }}>
              Brain<Box component="span" sx={{ color: ACCENT }}>Doc</Box>
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={800} mb={0.75} sx={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.35)", mb: 3.5, fontSize: "0.88rem" }}>
            Sign in to your document intelligence workspace
          </Typography>

          {/* Error alert */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Alert
                  severity="error"
                  sx={{ mb: 2.5, borderRadius: 2, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", "& .MuiAlert-icon": { color: "#ef4444" } }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cold-start hint */}
          <AnimatePresence>
            {showWakeHint && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 1.25,
                  mb: 2.5, px: 2, py: 1.25, borderRadius: "10px",
                  background: "rgba(255,106,61,0.06)", border: "1px solid rgba(255,106,61,0.18)",
                }}>
                  <PulseDot />
                  <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,106,61,0.8)", lineHeight: 1.5 }}>
                    Server is waking up (free tier cold start). This takes up to 30 seconds on first request.
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              autoFocus
              disabled={loading}
            />
            <TextField
              label="Password"
              name="password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {showPw
                        ? <VisibilityOff sx={{ fontSize: 16 }} />
                        : <Visibility sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 32px rgba(255,106,61,0.45)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                width: "100%", marginTop: 20, padding: "13px 0",
                borderRadius: 10, border: "none",
                background: loading ? "rgba(255,106,61,0.25)" : ACCENT,
                color: loading ? "rgba(255,255,255,0.5)" : "#fff",
                fontWeight: 800, fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Inter, sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: loading ? "none" : "0 0 24px rgba(255,106,61,0.25)",
                transition: "box-shadow 0.2s",
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "rgba(255,255,255,0.8)", borderRadius: "50%" }}
                  />
                  Signing in...
                </>
              ) : "Sign In →"}
            </motion.button>

            <Typography variant="body2" textAlign="center" mt={3} sx={{ color: "rgba(255,255,255,0.25)" }}>
              No account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{ color: ACCENT, fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
