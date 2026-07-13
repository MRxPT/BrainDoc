import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Zap, Shield, Search, Brain, FileText, BarChart3,
  ChevronRight, Check, Star, Plus, Minus, ArrowRight,
  Upload, MessageSquare, Cpu, Lock, Globe, TrendingUp, Key,
} from "lucide-react";

const EASE = [0.22, 0.61, 0.36, 1];

/* ── Animated counter ─────────────────────────────────────────────── */
function Counter({ to, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const dur = 1800, steps = 60, step = dur / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur++;
      setVal(Math.round((cur / steps) * to));
      if (cur >= steps) clearInterval(id);
    }, step);
    return () => clearInterval(id);
  }, [started, to]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Section badge ────────────────────────────────────────────────── */
function Badge({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 14px", borderRadius: 999,
        background: "rgba(37,99,235,0.07)",
        border: "1px solid rgba(37,99,235,0.15)",
        fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "#2563eb",
        marginBottom: 20,
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb" }} />
      {children}
    </motion.div>
  );
}

/* ── Hero dashboard mockup ────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      style={{ position: "relative" }}
    >
      {/* Floating glow blobs */}
      <div style={{ position: "absolute", top: -60, left: -60, width: 300, height: 300, background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 250, height: 250, background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 24,
          boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 20px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5)",
          padding: 24,
          width: "100%",
          maxWidth: 520,
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          {["#ef4444","#f59e0b","#22c55e"].map((c,i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 6, height: 28, display: "flex", alignItems: "center", paddingLeft: 10 }}>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>braindoc.ai/workspace</span>
          </div>
        </div>

        {/* Query bar */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Search size={14} color="#94a3b8" />
          <span style={{ fontSize: 13, color: "#64748b" }}>What are the key findings in Q3 report?</span>
          <div style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={13} color="white" />
          </div>
        </div>

        {/* AI response */}
        <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.04))", border: "1px solid rgba(37,99,235,0.1)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={11} color="white" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.04em", textTransform: "uppercase" }}>BrainDoc AI</span>
          </div>
          {["Revenue grew 34% YoY, reaching $12.4M", "Customer retention rate improved to 94.2%", "3 new enterprise contracts signed in Q3"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: "rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                <Check size={8} color="#2563eb" />
              </div>
              <span style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Mini chart */}
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>Revenue Trend</span>
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>+34% ↑</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48 }}>
            {[35,48,42,58,52,70,65,84,78,92,88,100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.5, ease: EASE }}
                style={{
                  flex: 1, borderRadius: "3px 3px 0 0",
                  background: i === 11
                    ? "linear-gradient(180deg,#2563eb,#7c3aed)"
                    : `rgba(37,99,235,${0.12 + (i / 11) * 0.2})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Documents", val: "2,847", icon: <FileText size={12} /> },
            { label: "Queries", val: "18,294", icon: <MessageSquare size={12} /> },
            { label: "Accuracy", val: "99.2%", icon: <TrendingUp size={12} /> },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 10, padding: 12, textAlign: "center" }}>
              <div style={{ color: "#2563eb", display: "flex", justifyContent: "center", marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating chips */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: -20, right: -32,
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 12, padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={12} color="#10b981" />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>Indexed in 1.2s</div>
          <div style={{ fontSize: 9, color: "#94a3b8" }}>PDF processed</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{
          position: "absolute", bottom: 20, left: -40,
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 12, padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={12} color="#2563eb" />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>Zero data retention</div>
          <div style={{ fontSize: 9, color: "#94a3b8" }}>In-memory only</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Hero Section ─────────────────────────────────────────────────── */
function HeroSection({ navigate, user }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "#fff", paddingTop: 88 }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: -200, left: -200, width: 700, height: 700, background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 100, right: -150, width: 500, height: 500, background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: "40%", width: 400, height: 400, background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div className="container-xl" style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", padding: "80px 80px" }}>
        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.15)", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", letterSpacing: "0.04em" }}>Now with RAG · Zero-hallucination AI</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="hero-text"
            style={{ marginBottom: 24 }}
          >
            Your Documents.<br />
            <span className="gradient-text">Infinite Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{ fontSize: 20, color: "#64748b", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}
          >
            Upload any PDF and have an intelligent conversation with it. BrainDoc uses semantic search and retrieval-augmented generation to give you precise, grounded answers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}
          >
            <button className="btn-primary" onClick={() => navigate(user ? "/chat" : "/signup")} style={{ fontSize: "0.95rem", padding: "16px 32px" }}>
              {user ? "Open Workspace" : "Start for free"}
              <ChevronRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => document.querySelector("#how")?.scrollIntoView({ behavior: "smooth" })} style={{ fontSize: "0.95rem" }}>
              See how it works
            </button>
          </motion.div>

        </div>

        {/* Right */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

/* ── Tech Stack Section ───────────────────────────────────────────── */
function TechStackSection() {
  const tech = [
    { name: "FastAPI", desc: "High-performance Python backend API" },
    { name: "FAISS", desc: "Facebook AI Similarity Search for semantic vector retrieval" },
    { name: "ONNX Runtime", desc: "Ultra-fast local embeddings and ONNX-powered fastembed" },
    { name: "React", desc: "Interactive, fluid, responsive user interface" },
    { name: "Tesseract OCR", desc: "Accurate optical character recognition for scanned PDFs" }
  ];
  return (
    <section style={{ padding: "60px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
      <div className="container-xl">
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 36 }}>
          Powered by Open Source & Modern Tech Stack
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "24px 48px" }}>
          {tech.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ scale: 1.05 }}
              style={{ cursor: "default", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: "#475569", letterSpacing: "-0.02em" }}>{t.name}</span>
              <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{t.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Free Benefits Section ────────────────────────────────────────── */
function FreeBenefitsSection() {
  const benefits = [
    { icon: <Zap size={28} color="#2563eb" />, title: "100% Free", desc: "No subscriptions, paywalls, or hidden charges. Completely free AI." },
    { icon: <Lock size={28} color="#2563eb" />, title: "Privacy First", desc: "In-memory processing. Your documents are never stored to disk." },
    { icon: <Cpu size={28} color="#2563eb" />, title: "Sub-100ms Search", desc: "Optimized with FAISS local semantic indexes for instant retrieval." },
    { icon: <Key size={28} color="#2563eb" />, title: "Flexible Models", desc: "Bring your own keys to run Groq, Gemini, OpenAI, or local ONNX engines." }
  ];
  return (
    <section style={{ padding: "100px 0", background: "#fff" }}>
      <div className="container-xl">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              style={{
                textAlign: "center", padding: "40px 24px",
                border: "1px solid #f1f5f9", borderRadius: 24,
                background: "#fafbfc",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                display: "flex", flexDirection: "column", alignItems: "center"
              }}
              whileHover={{ y: -6, borderColor: "#cbd5e1", boxShadow: "0 12px 30px rgba(0,0,0,0.04)" }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(37,99,235,0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                {b.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{b.title}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ─────────────────────────────────────────────────── */
function HowSection() {
  const steps = [
    { n: "01", icon: <Upload size={24} />, title: "Upload your PDF", desc: "Drag and drop any PDF — digital or scanned. Up to 50 MB. Our pipeline handles OCR, chunking, and indexing automatically in seconds." },
    { n: "02", icon: <Cpu size={24} />, title: "Instant AI indexing", desc: "Each page is split into semantic chunks, embedded into 384-dimensional vectors using ONNX fastembed, and stored in-memory for sub-100ms retrieval." },
    { n: "03", icon: <MessageSquare size={24} />, title: "Chat with your document", desc: "Ask anything in plain language. BrainDoc retrieves the most relevant context and generates a precise, grounded answer with source citations." },
  ];
  return (
    <section id="how" style={{ padding: "160px 0", background: "#fafbfc" }}>
      <div className="container-xl">
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <Badge>How it works</Badge>
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: 16 }}>
            Three steps to document intelligence
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6, ease: EASE }} style={{ fontSize: 20, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
            From upload to insight in under 5 seconds.
          </motion.p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
              whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.1)", borderColor: "#cbd5e1" }}
              style={{ background: "#fff", borderRadius: 28, border: "1px solid #e2e8f0", padding: 40, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.3s" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,rgba(37,99,235,0.08),rgba(124,58,237,0.08))", border: "1px solid rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 48, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 12, letterSpacing: "-0.025em" }}>{s.title}</h3>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features Grid ────────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    { icon: <Search size={22}/>, title: "Semantic Search", desc: "Goes beyond keywords — understands meaning, synonyms, and context across your entire document." },
    { icon: <Brain size={22}/>, title: "RAG Pipeline", desc: "Retrieval-Augmented Generation grounds every answer in your document. No hallucinations, ever." },
    { icon: <Zap size={22}/>, title: "Sub-100ms Retrieval", desc: "ONNX-powered FAISS indexing returns relevant chunks in milliseconds, regardless of document size." },
    { icon: <Shield size={22}/>, title: "Ephemeral Privacy", desc: "Everything runs in-memory. No vectors saved to disk. Your data is gone the moment your session ends." },
    { icon: <MessageSquare size={22}/>, title: "Multi-turn Chat", desc: "Ask follow-up questions naturally. BrainDoc maintains full conversation context across turns." },
    { icon: <Globe size={22}/>, title: "Multi-Provider AI", desc: "Switch between Groq, Gemini, OpenAI, or our local ONNX engine — your choice, your keys." },
  ];
  return (
    <section id="features" style={{ padding: "160px 0", background: "#fff" }}>
      <div className="container-xl">
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <Badge>Features</Badge>
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: 16 }}>
            Everything you need to<br /><span className="gradient-text">unlock your documents</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }} style={{ fontSize: 20, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>
            Purpose-built for intelligence. Every feature designed to get you the right answer, faster.
          </motion.p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
              style={{ background: "#fff", borderRadius: 28, border: "1px solid #e2e8f0", padding: 40, cursor: "default", transition: "all 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              whileHover={{ y: -6, borderColor: "#93c5fd", boxShadow: "0 12px 40px rgba(37,99,235,0.1)" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,rgba(37,99,235,0.08),rgba(124,58,237,0.06))", border: "1px solid rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", marginBottom: 24 }}
              >
                {f.icon}
              </motion.div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>{f.title}</h3>
                <motion.div whileHover={{ x: 3 }} style={{ color: "#2563eb", display: "flex" }}><ChevronRight size={16} /></motion.div>
              </div>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Use Cases ────────────────────────────────────────────────────── */
function UseCasesSection() {
  const cases = [
    { icon: "📄", title: "Research Papers", desc: "Extract methodology, key findings and conclusions from academic papers in seconds." },
    { icon: "⚖️", title: "Legal Documents", desc: "Identify clauses, obligations and risks in contracts with precision." },
    { icon: "🔧", title: "Technical Docs",  desc: "Query API documentation, manuals and specifications conversationally." },
    { icon: "📊", title: "Business Reports",desc: "Pull KPIs, forecasts and strategic insights from dense reports instantly." },
    { icon: "🎓", title: "Education",       desc: "Chat with textbooks and study guides to accelerate learning." },
    { icon: "🏥", title: "Medical Lit",    desc: "Review clinical studies and drug interactions rapidly and safely." },
  ];
  return (
    <section id="usecases" style={{ padding: "160px 0", background: "#fafbfc" }}>
      <div className="container-xl">
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <Badge>Use Cases</Badge>
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}>
            Built for every domain
          </motion.h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
              whileHover={{ y: -5, borderColor: "#93c5fd", boxShadow: "0 12px 40px rgba(37,99,235,0.08)" }}
              style={{ background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0", padding: 32, cursor: "default", transition: "all 0.28s" }}
            >
              <span style={{ fontSize: 28, display: "block", marginBottom: 14 }}>{c.icon}</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.02em" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────── */
function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Is my data secure?", a: "Completely. BrainDoc uses ephemeral in-memory processing — your PDFs and embeddings are never written to disk. Everything is cleared when your session ends. We never store your document content." },
    { q: "Which AI models are supported?", a: "BrainDoc supports Groq (Llama 3.3 70B), Google Gemini 1.5 Flash, OpenAI GPT-3.5, and our built-in local Brain Core engine powered by ONNX fastembed — no API key required for the local engine." },
    { q: "What types of PDFs does it support?", a: "Both digital PDFs (with text layers) and scanned/image PDFs. Scanned documents are processed with Tesseract OCR at 300 DPI with contrast enhancement for maximum accuracy." },
    { q: "How fast is the retrieval?", a: "Sub-100ms for semantic search. The ONNX-powered FAISS index operates entirely in-memory, so there's no disk I/O. Documents up to 50 MB are indexed in under 3 seconds." },
    { q: "Can I chat with multiple documents?", a: "Each chat session is tied to one document for focused, precise answers. You can switch between documents at any time — each has its own independent conversation history." },
    { q: "What happens if the AI can't find the answer?", a: "BrainDoc is designed to say 'The document doesn't contain enough information to answer this' rather than guess. You'll never get hallucinated responses that aren't grounded in your PDF." },
  ];
  return (
    <section style={{ padding: "160px 0", background: "#fff" }}>
      <div className="container-xl">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80 }}>
          <div>
            <Badge>FAQ</Badge>
            <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: 16 }}>
              Frequently asked questions
            </motion.h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7 }}>
              Everything you need to know about BrainDoc.
            </p>
          </div>
          <div>
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "24px 0", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.01em", paddingRight: 24 }}>{f.q}</span>
                  <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ flexShrink: 0, color: "#2563eb" }}>
                    <Plus size={20} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.75, paddingBottom: 24 }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ───────────────────────────────────────────────────── */
function CTABanner({ navigate, user }) {
  return (
    <section style={{ padding: "160px 0", background: "#fafbfc", position: "relative", overflow: "hidden" }}>
      {/* Blobs */}
      <div style={{ position: "absolute", top: -120, left: "15%", width: 400, height: 400, background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, right: "10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div className="container-xl" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background: "#0f172a",
            borderRadius: 40,
            padding: "80px 80px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Inner gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(124,58,237,0.15) 100%)", pointerEvents: "none" }} />
          {/* Glowing orbs inside */}
          <div style={{ position: "absolute", top: -80, left: "30%", width: 300, height: 300, background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, right: "25%", width: 280, height: 280, background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", marginBottom: 32 }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>No credit card required · Free forever</span>
            </motion.div>

            <h2 style={{ fontSize: "clamp(36px,4.5vw,64px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
              Ready to unlock your<br />
              <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                document intelligence?
              </span>
            </h2>

            <p style={{ fontSize: 20, color: "rgba(255,255,255,0.55)", marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>
              Join thousands of researchers, analysts, and professionals who use BrainDoc to work smarter.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(37,99,235,0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(user ? "/chat" : "/signup")}
                style={{ padding: "16px 36px", borderRadius: 999, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 32px rgba(37,99,235,0.4)", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 8 }}
              >
                {user ? "Open Workspace" : "Start analyzing for free"}
                <ChevronRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.querySelector("#how")?.scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "16px 36px", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 16, cursor: "pointer", fontFamily: "inherit", transition: "all 0.25s" }}
              >
                See how it works
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────── */
function Footer({ navigate }) {
  const cols = [
    { heading: "Product",  links: ["Features","How it works","Changelog","Roadmap"] },
    { heading: "Use Cases",links: ["Research","Legal","Enterprise","Education","Healthcare"] },
    { heading: "Company",  links: ["About","Blog","Careers","Press","Contact"] },
    { heading: "Legal",    links: ["Privacy","Terms","Security","Cookies"] },
  ];
  return (
    <footer style={{ background: "#0f172a", color: "rgba(255,255,255,0.55)", padding: "80px 0 40px" }}>
      <div className="container-xl">
        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", letterSpacing: "-0.025em" }}>Brain<span style={{ color: "#60a5fa" }}>Doc</span></span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 260, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>
              AI-powered document intelligence. Upload any PDF and chat with it using semantic search and RAG.
            </p>
            {/* Newsletter */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
              />
              <button style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>{col.heading}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} BrainDoc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Twitter","GitHub","LinkedIn","Discord"].map((s) => (
              <a key={s} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >{s}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            FastAPI · FAISS · ONNX · React
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Main export ──────────────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ background: "#fff", overflowX: "hidden" }}>
      <HeroSection navigate={navigate} user={user} />
      <TechStackSection />
      <FreeBenefitsSection />
      <HowSection />
      <FeaturesSection />
      <UseCasesSection />
      <FAQSection />
      <CTABanner navigate={navigate} user={user} />
      <Footer navigate={navigate} />
    </div>
  );
}
