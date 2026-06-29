import React, { useState } from "react";
import { Box, TextField, Typography, Alert, InputAdornment, IconButton, Link } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const A = "#ff6a3d";

const FEATURES = [
  { icon: "⚡", title: "Instant embedding", desc: "PDFs vectorized in seconds using ONNX fastembed" },
  { icon: "🔍", title: "Semantic search", desc: "Cosine similarity retrieval across all your documents" },
  { icon: "🔒", title: "Ephemeral privacy", desc: "In-memory only — nothing written to disk" },
];

function FeaturePanel() {
  return (
    <Box sx={{
      flex: 1, minHeight: "100%", position: "relative",
      background: "rgba(255,106,61,0.03)",
      borderLeft: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", justifyContent: "center",
      px: { xs: 4, md: 7 }, py: 6,
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <Box sx={{
        position: "absolute", top: "30%", right: "-10%",
        width: 400, height: 400,
        background: "radial-gradient(ellipse, rgba(255,106,61,0.08) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <Box display="flex" alignItems="center" gap={1.5} mb={8}>
        <Box sx={{
          width: 32, height: 32, borderRadius: "8px",
          background: `linear-gradient(135deg, ${A}, #cc4a1f)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 18px rgba(255,106,61,0.4)`, flexShrink: 0,
        }}>
          <Box sx={{ width: 11, height: 11, borderRadius: "2.5px", border: "1.5px solid rgba(255,255,255,0.92)", transform: "rotate(45deg)" }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#f5f5f5", fontFamily: "'DM Sans', Inter, sans-serif" }}>
          Brain<Box component="span" sx={{ color: A }}>Doc</Box>
        </Typography>
      </Box>

      {/* Headline */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <Typography sx={{
          fontSize: { xs: "2rem", md: "2.8rem" },
          fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.08,
          color: "#f5f5f5", mb: 1.5,
          fontFamily: "'DM Sans', Inter, sans-serif",
        }}>
          Your documents,<br />
          <Box component="span" sx={{ color: A, textShadow: "0 0 40px rgba(255,106,61,0.4)" }}>
            infinite answers.
          </Box>
        </Typography>
        <Typography sx={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, mb: 6, maxWidth: 380 }}>
          Upload any PDF and ask questions in plain language. BrainDoc retrieves exact answers using retrieval-augmented generation.
        </Typography>
      </motion.div>

      {/* Feature list */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Box display="flex" alignItems="flex-start" gap={2}>
              <Box sx={{
                width: 40, height: 40, borderRadius: "11px", flexShrink: 0,
                background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
              }}>
                {f.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#f5f5f5", mb: 0.25 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{f.desc}</Typography>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Floating testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        style={{ marginTop: 48 }}
      >
        <Box sx={{
          p: 2.5, borderRadius: "14px",
          background: "rgba(22,22,22,0.7)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
          maxWidth: 360,
        }}>
          <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontStyle: "italic", mb: 1.5 }}>
            "BrainDoc cut my research time in half. I just upload papers and ask it anything."
          </Typography>
          <Box display="flex" alignItems="center" gap={1.25}>
            <Box sx={{ width: 28, height: 28, borderRadius: "7px", background: `linear-gradient(135deg, ${A}, #cc4a1f)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: "#fff" }}>R</Box>
            <Box>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#f5f5f5" }}>Research Analyst</Typography>
              <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>Financial Services</Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signupUser } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
    setFieldErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.username.length < 3) e.username = "At least 3 characters";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true);
    try {
      await signupUser(form.username, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "calc(100vh - 56px)",
      display: "flex", position: "relative", zIndex: 1,
    }}>
      {/* Left — form */}
      <Box sx={{
        width: { xs: "100%", md: "50%", lg: "45%" },
        display: "flex", alignItems: "center", justifyContent: "center",
        px: { xs: 3, md: 6, lg: 8 }, py: 6,
      }}>
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight={800} mb={0.75}
              sx={{ color: "#f5f5f5", letterSpacing: "-0.03em", fontFamily: "'DM Sans', Inter, sans-serif" }}>
              Create your account
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" }}>
              Free forever — no credit card required
            </Typography>
          </Box>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", "& .MuiAlert-icon": { color: "#ef4444" } }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {[
              { name: "username", label: "Username", type: "text", autoFocus: true },
              { name: "email",    label: "Email address", type: "email" },
            ].map((f) => (
              <TextField
                key={f.name}
                label={f.label} name={f.name} type={f.type}
                value={form[f.name]} onChange={handleChange}
                fullWidth required margin="normal"
                autoFocus={f.autoFocus}
                error={!!fieldErrors[f.name]} helperText={fieldErrors[f.name]}
              />
            ))}

            <TextField
              label="Password" name="password"
              type={showPw ? "text" : "password"}
              value={form.password} onChange={handleChange}
              fullWidth required margin="normal"
              error={!!fieldErrors.password} helperText={fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((s) => !s)} edge="end" size="small" sx={{ color: "rgba(255,255,255,0.25)" }}>
                      {showPw ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm password" name="confirmPassword"
              type={showPw ? "text" : "password"}
              value={form.confirmPassword} onChange={handleChange}
              fullWidth required margin="normal"
              error={!!fieldErrors.confirmPassword} helperText={fieldErrors.confirmPassword}
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 32px rgba(255,106,61,0.45)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              style={{
                width: "100%", marginTop: 12, padding: "14px 0",
                borderRadius: 10, border: "none",
                background: loading ? "rgba(255,106,61,0.25)" : A,
                color: loading ? "rgba(255,255,255,0.4)" : "#fff",
                fontWeight: 800, fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', Inter, sans-serif",
                boxShadow: loading ? "none" : "0 0 24px rgba(255,106,61,0.25)",
                transition: "box-shadow 0.2s",
              }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </motion.button>

            <Typography variant="body2" textAlign="center" mt={2.5} sx={{ color: "rgba(255,255,255,0.28)" }}>
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" sx={{ color: A, fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Right — feature panel (hidden on mobile) */}
      <Box sx={{ display: { xs: "none", md: "flex" }, flex: 1 }}>
        <FeaturePanel />
      </Box>
    </Box>
  );
}
