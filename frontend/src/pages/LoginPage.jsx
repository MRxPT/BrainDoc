import React, { useState } from "react";
import { Box, TextField, Typography, Alert, InputAdornment, IconButton, Link } from "@mui/material";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff, ArrowForwardOutlined } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function SubmitButton({ loading, children }) {
  return (
    <motion.div
      whileHover={!loading ? { scale: 1.02 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      style={{ width: "100%", marginTop: 20 }}
    >
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%", padding: "13px 0", borderRadius: 10,
          border: "none",
          background: loading
            ? "rgba(63,114,175,0.25)"
            : "linear-gradient(135deg,#3F72AF,#2d5a8e)",
          color: loading ? "rgba(255,255,255,0.4)" : "#fff",
          fontWeight: 800, fontSize: "0.95rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "Inter,sans-serif",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: loading ? "none" : "0 0 22px rgba(63,114,175,0.3)",
          transition: "box-shadow 0.2s, background 0.3s, color 0.3s",
        }}
      >
        {children}
      </button>
    </motion.div>
  );
}

// Floating decorative particle
function FloatingParticle({ size, top, left, delay, duration, color }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute", top, left, width: size, height: size,
        borderRadius: "50%", background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      let msg = "Login failed. Please try again.";
      if (err.code === "auth/user-not-found") msg = "No user found with this email.";
      if (err.code === "auth/wrong-password") msg = "Incorrect password.";
      if (err.code === "auth/invalid-credential") msg = "Invalid email or password.";
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
      {/* Decorative floating particles */}
      <FloatingParticle size={6} top="15%" left="10%" delay={0} duration={4} color="rgba(63,114,175,0.4)" />
      <FloatingParticle size={4} top="70%" left="15%" delay={1.2} duration={5} color="rgba(63,114,175,0.3)" />
      <FloatingParticle size={5} top="25%" left="85%" delay={0.6} duration={4.5} color="rgba(63,114,175,0.35)" />
      <FloatingParticle size={3} top="80%" left="80%" delay={2} duration={3.5} color="rgba(63,114,175,0.25)" />
      <FloatingParticle size={4} top="45%" left="5%" delay={0.8} duration={6} color="rgba(90,143,196,0.3)" />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Box sx={{
          background: isDark ? "rgba(17,45,78,0.92)" : "rgba(249,247,247,0.97)",
          backdropFilter: "blur(32px)",
          border: `1px solid ${isDark ? "rgba(63,114,175,0.16)" : "rgba(63,114,175,0.2)"}`,
          borderRadius: "20px",
          p: { xs: 3.5, md: 5 },
          position: "relative",
          boxShadow: isDark
            ? "0 8px 40px rgba(0,0,0,0.3)"
            : "0 8px 40px rgba(63,114,175,0.12)",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
        }}>
          {/* Top edge shimmer */}
          <Box sx={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(63,114,175,0.45),transparent)",
            borderRadius: "1px", pointerEvents: "none",
          }} />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box display="flex" alignItems="center" gap={1.5} mb={4}>
              <Box sx={{
                width: 32, height: 32, borderRadius: "8px",
                background: "linear-gradient(135deg,#3F72AF,#112D4E)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 18px rgba(63,114,175,0.4)",
              }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#F9F7F7" }} />
              </Box>
              <Typography sx={{
                fontWeight: 900, fontSize: "1rem",
                background: isDark
                  ? "linear-gradient(90deg,#F9F7F7 40%,#3F72AF)"
                  : "linear-gradient(90deg,#112D4E 40%,#3F72AF)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                transition: "background 0.4s",
              }}>
                Brain<span style={{ WebkitTextFillColor: "#3F72AF" }}>Doc</span>
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography variant="h4" fontWeight={800} mb={0.5}
              sx={{ color: isDark ? "#F9F7F7" : "#112D4E", transition: "color 0.4s" }}
            >
              Welcome back
            </Typography>
            <Typography sx={{
              color: isDark ? "rgba(219,226,239,0.6)" : "rgba(17,45,78,0.6)",
              mb: 3.5, fontSize: "0.9rem", transition: "color 0.4s",
            }}>
              Sign in to your document intelligence workspace
            </Typography>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <TextField
                label="Email" name="email" type="email"
                value={form.email} onChange={handleChange}
                fullWidth required margin="normal" autoFocus
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <TextField
                label="Password" name="password"
                type={showPw ? "text" : "password"}
                value={form.password} onChange={handleChange}
                fullWidth required margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw((s) => !s)} edge="end" size="small"
                        sx={{ color: isDark ? "rgba(219,226,239,0.4)" : "rgba(17,45,78,0.35)" }}>
                        {showPw ? <VisibilityOff sx={{ fontSize: 17 }} /> : <Visibility sx={{ fontSize: 17 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <SubmitButton loading={loading}>
                {loading
                  ? "Signing in..."
                  : <><span>Sign In</span><ArrowForwardOutlined style={{ fontSize: 18 }} /></>}
              </SubmitButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              <Typography variant="body2" textAlign="center" mt={3}
                sx={{ color: isDark ? "rgba(219,226,239,0.5)" : "rgba(17,45,78,0.5)", transition: "color 0.4s" }}>
                No account?{" "}
                <Link component={RouterLink} to="/signup"
                  sx={{ color: "#3F72AF", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  Create Account 
                </Link>
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
