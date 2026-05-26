import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Upload,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { GitHub, LinkedIn } from "@mui/icons-material";
import { cn } from "../../lib/utils";
import { useAppTheme } from "../../context/ThemeContext";
import { Button } from "./button";
import { Badge } from "./badge";

const TAGLINES = [
  "Neural PDF Intelligence",
  "Semantic Search Reimagined",
  "Conversational AI Retrieval",
  "Upload. Search. Understand.",
];

function useFooterTokens() {
  const { mode } = useAppTheme();
  const d = mode === "dark";
  return useMemo(
    () => ({
      d,
      text: d ? "#F9F7F7" : "#112D4E",
      muted: d ? "rgba(219,226,239,0.65)" : "rgba(17,45,78,0.6)",
      accent: "#3F72AF",
      accentBright: "#5a8fc4",
      cardBg: d ? "rgba(17,45,78,0.88)" : "rgba(249,247,247,0.97)",
      cardBdr: d ? "rgba(63,114,175,0.2)" : "rgba(63,114,175,0.28)",
      shimmer: d ? "rgba(90,143,196,0.4)" : "rgba(63,114,175,0.35)",
      inputBg: d ? "rgba(63,114,175,0.08)" : "rgba(63,114,175,0.06)",
      glow: "rgba(63,114,175,0.35)",
    }),
    [d]
  );
}

function FooterLabel({ children, T }) {
  return (
    <span
      className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.12em]"
      style={{
        background: "rgba(63,114,175,0.08)",
        border: "1px solid rgba(63,114,175,0.22)",
        color: T.accent,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: T.accent, boxShadow: `0 0 8px ${T.accent}` }}
      />
      {children}
    </span>
  );
}

function GlassPanel({ children, className, T, delay = 0 }) {
  return (
    <motion.div
      className={cn("footer-glass-panel relative overflow-hidden rounded-2xl p-6 md:p-8", className)}
      style={{
        background: T.cardBg,
        borderColor: T.cardBdr,
        backdropFilter: "blur(28px)",
        boxShadow: `0 8px 40px rgba(0,0,0,${T.d ? 0.25 : 0.08}), inset 0 1px 0 ${T.shimmer}`,
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <motion.div
        className="pointer-events-none absolute top-0 left-[8%] right-[8%] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${T.shimmer}, transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}

function NeuralOrbVisual({ T }) {
  return (
    <motion.div
      className="footer-neural-orb relative mx-auto flex h-40 w-40 items-center justify-center md:h-48 md:w-48"
      style={{ filter: `drop-shadow(0 0 28px ${T.glow})` }}
    >
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: `radial-gradient(circle, ${T.glow} 0%, rgba(63,114,175,0.08) 55%, transparent 70%)`,
        }}
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border"
        style={{ borderColor: `${T.accent}40` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-6 rounded-full border border-dashed"
        style={{ borderColor: `${T.accent}25` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      {[0, 120, 240].map((deg, i) => (
        <motion.div
          key={deg}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 14 + i * 3, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
            style={{
              background: T.accentBright,
              transform: `rotate(${deg}deg) translateX(70px) translateY(-50%)`,
              boxShadow: `0 0 10px ${T.glow}`,
            }}
          />
        </motion.div>
      ))}
      <motion.div
        className="relative flex h-18 w-18 items-center justify-center rounded-2xl border backdrop-blur-xl md:h-22 md:w-22"
        style={{
          width: 80,
          height: 80,
          background: T.cardBg,
          borderColor: `${T.accent}50`,
          boxShadow: `0 0 40px ${T.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Brain className="h-9 w-9 md:h-10 md:w-10" style={{ color: T.accentBright }} />
      </motion.div>
    </motion.div>
  );
}

function SocialLink({ href, icon: Icon, label, T }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="footer-social-btn flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-md transition-all"
      style={{
        border: `1px solid ${T.cardBdr}`,
        background: T.inputBg,
      }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <Icon sx={{ fontSize: 20, color: T.muted, transition: "color 0.2s" }} />
    </motion.a>
  );
}

export function PersonalLandingFooter({
  className,
  githubUrl = "https://github.com/MRxPT",
  linkedinUrl = "https://www.linkedin.com/in/prashant-tiwari-b7b23b305/",
  onUpload,
  onSearch,
  onExplore,
  brandName = "BrainDoc",
}) {
  const T = useFooterTokens();
  const [email, setEmail] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const handleConnect = (e) => {
    e.preventDefault();
    onExplore?.();
  };

  return (
    <footer
      className={cn("footer-neural-section relative overflow-hidden", className)}
      style={{
        borderTop: `1px solid ${T.cardBdr}`,
        color: T.text,
        ["--footer-card-bg"]: T.cardBg,
        ["--footer-card-bdr"]: T.cardBdr,
        ["--footer-accent"]: T.accent,
        ["--footer-muted"]: T.muted,
      }}
      aria-label="Site footer"
    >
      <motion.div
        className="footer-ambient-glow pointer-events-none absolute inset-0"
        style={{
          background: T.d
            ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(63,114,175,0.1) 0%, transparent 65%)"
            : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(63,114,175,0.08) 0%, transparent 65%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16 lg:py-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Intro */}
          <motion.div
            className="flex flex-col items-center text-center lg:col-span-5 lg:items-start lg:text-left"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FooterLabel T={T}>Neural Interface</FooterLabel>

            <h2
              className="mb-2 text-3xl font-black tracking-tight md:text-4xl lg:text-[2.2rem] lg:leading-tight"
              style={{ color: T.text }}
            >
              Advanced AI{" "}
              <span
                style={{
                  background: T.d
                    ? "linear-gradient(90deg, #F9F7F7 30%, #5a8fc4 70%, #DBE2EF)"
                    : "linear-gradient(90deg, #112D4E 30%, #3F72AF 70%, #112D4E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Document Intelligence
              </span>
            </h2>

            <motion.p
              key={taglineIndex}
              className="mb-4 max-w-sm text-sm font-semibold md:text-base"
              style={{ color: T.accentBright }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {TAGLINES[taglineIndex]}
            </motion.p>

            <p className="mb-6 max-w-md text-sm leading-relaxed" style={{ color: T.muted }}>
              A RAG-powered semantic engine. Upload PDFs, query in natural language, and
              retrieve context-grounded answers through vector intelligence.
            </p>

            <NeuralOrbVisual T={T} />

            <div className="mt-6 flex items-center gap-3">
              <span
                className="text-[0.65rem] font-bold uppercase tracking-widest"
                style={{ color: T.muted }}
              >
                Connect
              </span>
              <SocialLink href={githubUrl} icon={GitHub} label="GitHub" T={T} />
              <SocialLink href={linkedinUrl} icon={LinkedIn} label="LinkedIn" T={T} />
            </div>
          </motion.div>

          {/* About */}
          <GlassPanel className="lg:col-span-4" T={T} delay={0.08}>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: T.accentBright }} />
              <h3
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: T.accent }}
              >
                Platform Core
              </h3>
            </div>
            <h4 className="mb-3 text-xl font-bold" style={{ color: T.text }}>
              Semantic Intelligence System
            </h4>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: T.muted }}>
              {brandName} is a retrieval-augmented generation platform for conversational PDF
              understanding. Vector embeddings, FAISS indexing, and neural search deliver
              precise, sourced answers.
            </p>
            <ul className="mb-5 space-y-2.5">
              {[
                { icon: Search, text: "Semantic retrieval across document corpora" },
                { icon: Zap, text: "384-dim embeddings with sub-100ms FAISS lookup" },
                { icon: MessageSquare, text: "Multi-turn AI chat with source citations" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm" style={{ color: T.muted }}>
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: T.accent }} />
                  {text}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {["RAG Pipeline", "Vector Search", "FAISS", "OCR", "LLM"].map((tag) => (
                <Badge key={tag} variant="braindoc">
                  {tag}
                </Badge>
              ))}
            </div>
          </GlassPanel>

          {/* CTA */}
          <GlassPanel className="flex flex-col lg:col-span-3" T={T} delay={0.15}>
            <div className="mb-1 flex items-center gap-2">
              <Upload className="h-4 w-4" style={{ color: T.accent }} />
              <h3
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: T.accent }}
              >
                Initiate Retrieval
              </h3>
            </div>
            <h4 className="mb-2 text-xl font-bold" style={{ color: T.text }}>
              Talk With Your Documents
            </h4>
            <p className="mb-5 text-sm" style={{ color: T.muted }}>
              Drop a PDF into the neural core. Start semantic search in seconds.
            </p>

            <form onSubmit={handleConnect} className="mb-4 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="footer-input w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: T.inputBg,
                  borderColor: T.cardBdr,
                  color: T.text,
                }}
                aria-label="Email"
              />
              <Button type="submit" variant="braindoc" size="lg" className="w-full">
                Explore Semantic AI
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-auto flex flex-col gap-2">
              <Button variant="braindoc" size="default" className="w-full justify-center" onClick={onUpload} type="button">
                <Upload className="h-4 w-4" />
                Upload Intelligence
              </Button>
              <Button variant="braindocOutline" size="default" className="w-full justify-center" onClick={onSearch} type="button">
                <Search className="h-4 w-4" />
                Start Neural Search
              </Button>
            </div>
          </GlassPanel>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-10 flex flex-col items-center justify-between gap-4 pt-8 md:flex-row"
          style={{ borderTop: `1px solid ${T.cardBdr}` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div className="flex items-center gap-2">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{
                background: `linear-gradient(135deg, ${T.accent}, #112D4E)`,
                borderColor: `${T.accent}50`,
                boxShadow: `0 0 18px ${T.glow}`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="h-4 w-4" style={{ color: "#F9F7F7" }} />
            </motion.div>
            <span className="text-sm font-bold" style={{ color: T.text }}>
              {brandName}
            </span>
          </motion.div>
          <p className="text-center text-xs" style={{ color: T.muted }}>
             {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-center text-xs" style={{ color: T.muted, opacity: 0.7 }}>
            FastAPI  FAISS  sentence-transformers  React
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default PersonalLandingFooter;
