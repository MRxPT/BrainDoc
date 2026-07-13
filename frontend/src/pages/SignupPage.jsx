import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EASE = [0.22, 0.61, 0.36, 1];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signupUser } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [showWake, setShowWake] = useState(false);

  useEffect(() => {
    let t;
    if (loading) t = setTimeout(() => setShowWake(true), 4000);
    else setShowWake(false);
    return () => clearTimeout(t);
  }, [loading]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", fn);
    // Force white background — overrides MUI dark theme CssBaseline
    document.body.style.background = "#ffffff";
    return () => {
      window.removeEventListener("resize", fn);
      document.body.style.background = "";
    };
  }, []);

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
      // Surface the actual backend error message, with fallbacks
      const msg =
        err.message?.includes("starting up") || err.message?.includes("timeout")
          ? "Server is warming up (free tier cold start). Please wait ~30s and try again."
          : err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Shared input style — pure CSS, no MUI interference
  const inputStyle = (hasErr) => ({
    display: "block", width: "100%", padding: "13px 16px",
    borderRadius: 12, border: `1.5px solid ${hasErr ? "#ef4444" : "#e2e8f0"}`,
    background: "#ffffff", color: "#0f172a",
    fontSize: 15, fontFamily: "inherit", outline: "none",
    WebkitAppearance: "none", appearance: "none",
    boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const FEATURES = [
    "Zero hallucinations — answers grounded in your PDF",
    "Sub-100ms semantic retrieval with ONNX FAISS",
    "Complete privacy — in-memory, nothing stored",
    "Multi-provider: Groq, Gemini, OpenAI, or local",
  ];

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      background: "#ffffff",
      display: "flex", flexDirection: isMobile ? "column" : "row",
      overflow: "auto",
    }}>

      {/* ── Left — form panel ── */}
      <div style={{
        width: isMobile ? "100%" : "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "48px 24px" : "60px 72px",
        background: "#ffffff",
        minHeight: isMobile ? "auto" : "100vh",
        overflowY: "auto",
      }}>
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", letterSpacing: "-0.02em" }}>
              Brain<span style={{ color: "#2563eb" }}>Doc</span>
            </span>
          </div>

          <h1 style={{ fontSize: isMobile ? 26 : 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", marginBottom: 28 }}>
            Free forever — no credit card required
          </p>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#dc2626" }}
              >
                {error}
              </motion.div>
            )}
            {showWake && (
              <motion.div
                key="wake"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "#fffbeb", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#b45309", display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", flexShrink: 0, display: "inline-block", marginTop: 3 }} />
                Server warming up (free tier cold start). Takes up to 30s on first request…
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column" }}>

            {/* Username */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Username</label>
              <input
                name="username" type="text" value={form.username}
                onChange={handleChange} required autoFocus placeholder="johndoe"
                style={inputStyle(!!fieldErrors.username)}
                onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = fieldErrors.username ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
              {fieldErrors.username && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{fieldErrors.username}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Email address</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} required placeholder="you@example.com"
                style={inputStyle(!!fieldErrors.email)}
                onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = fieldErrors.email ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
              {fieldErrors.email && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  name="password" type={showPw ? "text" : "password"}
                  value={form.password} onChange={handleChange} required placeholder="Min. 6 characters"
                  style={{ ...inputStyle(!!fieldErrors.password), paddingRight: 48 }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = fieldErrors.password ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", alignItems: "center" }}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{fieldErrors.password}</p>}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Confirm password</label>
              <input
                name="confirmPassword" type={showPw ? "text" : "password"}
                value={form.confirmPassword} onChange={handleChange} required placeholder="Re-enter password"
                style={inputStyle(!!fieldErrors.confirmPassword)}
                onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = fieldErrors.confirmPassword ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
              {fieldErrors.confirmPassword && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{fieldErrors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.015, boxShadow: "0 8px 28px rgba(37,99,235,0.4)" } : {}}
              whileTap={!loading ? { scale: 0.985 } : {}}
              style={{
                width: "100%", padding: "15px 0", borderRadius: 12, border: "none",
                background: loading
                  ? "linear-gradient(135deg, rgba(37,99,235,0.5), rgba(124,58,237,0.5))"
                  : "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#fff", fontWeight: 700, fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: loading ? "none" : "0 4px 20px rgba(37,99,235,0.35)",
                transition: "box-shadow 0.25s",
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                  />
                  Creating account…
                </>
              ) : "Create Account →"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right — decorative panel (desktop only) ── */}
      {!isMobile && (
        <div style={{
          flex: 1, background: "linear-gradient(145deg, #f0f7ff 0%, #eff6ff 40%, #f5f3ff 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "80px 72px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontSize: "clamp(24px,2.5vw,34px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.025em", marginBottom: 12, lineHeight: 1.2 }}>
              Everything you need<br />to unlock your PDFs
            </h3>
            <p style={{ fontSize: 16, color: "#64748b", marginBottom: 40, lineHeight: 1.75, maxWidth: 380 }}>
              Upload any PDF and get AI-powered answers instantly. Free to use — bring your own API key for premium models.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.5, ease: EASE }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color="#2563eb" />
                  </div>
                  <span style={{ fontSize: 15, color: "#334155", lineHeight: 1.65 }}>{f}</span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
