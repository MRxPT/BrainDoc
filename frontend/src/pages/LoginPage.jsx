import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EASE = [0.22, 0.61, 0.36, 1];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWake, setShowWake] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    // Force white background — overrides MUI dark theme CssBaseline
    document.body.style.background = "#ffffff";
    return () => {
      window.removeEventListener("resize", fn);
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    let t;
    if (loading) t = setTimeout(() => setShowWake(true), 4000);
    else setShowWake(false);
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
      const msg =
        err.message?.includes("starting up") || err.message?.includes("timeout")
          ? "Server is warming up (free tier cold start). Please wait ~30s and try again."
          : err.response?.data?.detail || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      background: "#ffffff",
      display: "flex", flexDirection: isMobile ? "column" : "row",
      overflow: "auto",
    }}>
      {/* ── Left — brand panel (hidden on mobile) ── */}
      {!isMobile && (
        <div style={{
          width: "45%", minHeight: "100vh", flexShrink: 0,
          background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 55%, #1e1b4b 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "80px 64px", position: "relative", overflow: "hidden",
        }}>
          {/* Glow orbs */}
          <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, right: -80, width: 350, height: 350, background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 72 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(37,99,235,0.4)" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.02em" }}>
                Brain<span style={{ color: "#60a5fa" }}>Doc</span>
              </span>
            </div>

            <h2 style={{ fontSize: "clamp(28px, 2.8vw, 44px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 18 }}>
              Your documents,<br />
              <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                infinite answers.
              </span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, maxWidth: 360, marginBottom: 52 }}>
              Upload any PDF and have an intelligent conversation with it. Powered by semantic search and retrieval-augmented generation.
            </p>

            {/* Feature list */}
            {[
              "Zero hallucinations — grounded in your document",
              "Sub-100ms semantic retrieval with ONNX FAISS",
              "Complete privacy — in-memory, nothing stored",
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.58)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Right — form panel ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "48px 24px" : "60px 72px",
        background: "#ffffff", minHeight: isMobile ? "100vh" : "auto",
      }}>
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 24 : 0, x: isMobile ? 0 : 24 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, cursor: "pointer" }} onClick={() => navigate("/")}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>Brain<span style={{ color: "#2563eb" }}>Doc</span></span>
            </div>
          )}

          <h1 style={{ fontSize: isMobile ? 28 : 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 8 }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", marginBottom: 36 }}>
            Sign in to your workspace
          </p>

          {/* Error */}
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
                Server warming up (free tier cold start). This takes up to 30s on first request…
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
                Email address
              </label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} required autoFocus
                placeholder="you@example.com"
                style={{
                  display: "block", width: "100%", padding: "13px 16px",
                  borderRadius: 12, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#0f172a",
                  fontSize: 15, fontFamily: "inherit", outline: "none",
                  WebkitAppearance: "none", appearance: "none",
                  boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  name="password" type={showPw ? "text" : "password"}
                  value={form.password} onChange={handleChange} required
                  placeholder="••••••••"
                  style={{
                    display: "block", width: "100%", padding: "13px 48px 13px 16px",
                    borderRadius: 12, border: "1.5px solid #e2e8f0",
                    background: "#fff", color: "#0f172a",
                    fontSize: 15, fontFamily: "inherit", outline: "none",
                    WebkitAppearance: "none", appearance: "none",
                    boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button" onClick={() => setShowPw(s => !s)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex", alignItems: "center" }}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
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
                transition: "box-shadow 0.25s, background 0.25s",
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                    style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                  />
                  Signing in…
                </>
              ) : "Sign in →"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
