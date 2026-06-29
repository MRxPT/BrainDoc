import React, { useEffect, useRef } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UploadFileOutlined, SearchOutlined, AutoAwesomeOutlined,
  HubOutlined, BlurOnOutlined, MemoryOutlined,
  SecurityOutlined, SpeedOutlined, AutoFixHighOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import SplineHero from "../components/SplineHero";
import { HoverFooter } from "../components/ui/hover-footer";

const A = "#ff6a3d";
const AG = "rgba(255,106,61,0.35)";

/* ── Section label pill ──────────────────────────────────────────────── */
function Label({ children }) {
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center", gap: 1,
      px: 2, py: 0.65, mb: 3, borderRadius: "100px",
      background: "rgba(255,106,61,0.07)",
      border: "1px solid rgba(255,106,61,0.18)",
    }}>
      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>
        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: A, boxShadow: `0 0 8px ${A}` }} />
      </motion.div>
      <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", color: A, textTransform: "uppercase", fontFamily: "'DM Sans', Inter, sans-serif" }}>
        {children}
      </Typography>
    </Box>
  );
}

/* ── Glass card ──────────────────────────────────────────────────────── */
function GCard({ children, sx = {}, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      style={{
        background: "rgba(22,22,22,0.7)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s",
        ...sx,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,106,61,0.18)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      <Box sx={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,106,61,0.22), transparent)",
        pointerEvents: "none",
      }} />
      {children}
    </motion.div>
  );
}

/* ── How it works — 3-step flow ──────────────────────────────────────── */
const HOW_STEPS = [
  { n: "01", icon: <UploadFileOutlined sx={{ fontSize: 28 }} />, title: "Upload PDF",       desc: "Drop any digital or scanned PDF. Our extractor handles text-layer PDFs natively and runs Tesseract OCR at 300 DPI for image-based pages." },
  { n: "02", icon: <BlurOnOutlined     sx={{ fontSize: 28 }} />, title: "Embed & Index",    desc: "Each chunk is encoded into a 384-dimensional dense vector using ONNX fastembed. Vectors are stored in-memory — zero latency, total privacy." },
  { n: "03", icon: <AutoAwesomeOutlined sx={{ fontSize: 28 }} />, title: "Ask Anything",    desc: "Type a question in plain language. BrainDoc retrieves the top semantic matches and grounds the AI answer in your exact document." },
];

function HowItWorksSection() {
  return (
    <Box sx={{ position: "relative", py: { xs: 10, md: 18 }, overflow: "hidden" }}>
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.04)" }} />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.04)" }} />
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "50%", height: "100%", background: "radial-gradient(ellipse, rgba(255,106,61,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box textAlign="center" mb={9}>
          <Label>How it works</Label>
          <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.6rem" }, fontWeight: 900, letterSpacing: "-0.04em", color: "#f5f5f5", fontFamily: "'DM Sans', Inter, sans-serif" }}>
            Three steps to intelligence
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {HOW_STEPS.map((s, i) => (
            <Grid item xs={12} md={4} key={i}>
              <GCard delay={i * 0.1}>
                <Box sx={{ p: { xs: 3.5, md: 5 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3.5}>
                    <Box sx={{
                      width: 54, height: 54, borderRadius: "14px",
                      background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: A,
                    }}>
                      {s.icon}
                    </Box>
                    <Typography sx={{ fontSize: "3.5rem", fontWeight: 900, color: "rgba(255,255,255,0.035)", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                      {s.n}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontSize: "1.3rem", fontWeight: 700, color: "#f5f5f5", mb: 1.5, fontFamily: "'DM Sans', Inter, sans-serif" }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
                    {s.desc}
                  </Typography>
                </Box>
              </GCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

/* ── Pipeline (sticky scroll) ────────────────────────────────────────── */
const PIPELINE_STEPS = [
  { num: "01", icon: <UploadFileOutlined />, title: "Semantic Ingestion",  desc: "PDFs parsed instantly — digital text or Tesseract OCR for scanned pages at 300 DPI." },
  { num: "02", icon: <BlurOnOutlined />,     title: "Vector Embedding",    desc: "ONNX fastembed encodes each chunk into 384-dimensional dense vectors capturing deep meaning." },
  { num: "03", icon: <SearchOutlined />,     title: "Neural Retrieval",    desc: "Queries embedded in real-time, cosine similarity matches the exact semantic context needed." },
  { num: "04", icon: <HubOutlined />,        title: "Grounded Answer",     desc: "LLMs synthesize retrieved vectors into precise, hallucination-free responses with source citations." },
];

function PipelineSection() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 10, md: 18 } }}>
      <Grid container spacing={{ xs: 6, md: 10 }}>
        {/* Sticky left */}
        <Grid item xs={12} md={5}>
          <Box sx={{ position: { md: "sticky" }, top: "14vh" }}>
            <Label>Neural Pipeline</Label>
            <Typography variant="h2" sx={{
              fontSize: { xs: "2.4rem", md: "4rem" },
              fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#f5f5f5", mb: 2.5,
              fontFamily: "'DM Sans', Inter, sans-serif",
            }}>
              Upload.<br />Embed.<br />
              <Box component="span" sx={{ color: A, textShadow: `0 0 40px ${AG}` }}>Retrieve.</Box>
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: 360, mb: 5 }}>
              A continuous intelligence flow — from raw PDF to context-grounded AI answers in seconds.
            </Typography>

            {/* Flow diagram */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {["PDF Upload", "Chunking", "Embedding", "Retrieval", "LLM Answer"].map((step, i, arr) => (
                <Box key={step}>
                  <motion.div initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09, duration: 0.45 }}>
                    <Box sx={{
                      display: "flex", alignItems: "center", gap: 1.75,
                      px: 2, py: 1.35, borderRadius: "10px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.18s",
                      "&:hover": { background: "rgba(255,106,61,0.05)", borderColor: "rgba(255,106,61,0.14)" },
                    }}>
                      <Box sx={{
                        minWidth: 26, height: 26, borderRadius: "7px",
                        background: "rgba(255,106,61,0.1)", border: "1px solid rgba(255,106,61,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Typography sx={{ fontSize: "0.58rem", fontWeight: 900, color: A, fontFamily: "'JetBrains Mono', monospace" }}>
                          {String(i + 1).padStart(2, "0")}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#f5f5f5", flex: 1 }}>{step}</Typography>
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.28 }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: A, boxShadow: `0 0 5px ${A}` }} />
                      </motion.div>
                    </Box>
                  </motion.div>
                  {i < arr.length - 1 && (
                    <Box sx={{ pl: "20px", py: 0.35 }}>
                      {[0, 1, 2].map((d) => (
                        <motion.div key={d} animate={{ opacity: [0.12, 0.65, 0.12] }} transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 + i * 0.22 }}>
                          <Box sx={{ width: 1.5, height: 4, borderRadius: "1px", mb: "3px", background: A, opacity: 0.35 }} />
                        </motion.div>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Scrolling cards */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            {PIPELINE_STEPS.map((s, i) => (
              <GCard key={i} delay={i * 0.07}>
                <Box sx={{ p: { xs: 3.5, md: 4.5 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3.5}>
                    <Box sx={{ width: 50, height: 50, borderRadius: "13px", background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: A }}>
                      {React.cloneElement(s.icon, { sx: { fontSize: 22 } })}
                    </Box>
                    <Typography sx={{ fontSize: "2.8rem", fontWeight: 900, color: "rgba(255,255,255,0.035)", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                      {s.num}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontSize: "1.55rem", fontWeight: 700, color: "#f5f5f5", mb: 1.5, fontFamily: "'DM Sans', Inter, sans-serif" }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>
                    {s.desc}
                  </Typography>
                </Box>
              </GCard>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

/* ── Bento features grid ─────────────────────────────────────────────── */
function BentoSection() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 10, md: 18 } }}>
      <Box textAlign="center" mb={10}>
        <Label>Intelligence Layer</Label>
        <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.6rem" }, fontWeight: 900, letterSpacing: "-0.04em", color: "#f5f5f5", mb: 2, fontFamily: "'DM Sans', Inter, sans-serif" }}>
          Beyond keyword search
        </Typography>
        <Typography sx={{ fontSize: "0.975rem", color: "rgba(255,255,255,0.32)", maxWidth: 480, mx: "auto", lineHeight: 1.75 }}>
          True semantic understanding powered by dense vector embeddings and retrieval-augmented generation.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 2.5 }}>
        <GCard delay={0.0}>
          <Box sx={{ p: { xs: 3.5, md: 5 }, height: { md: 340 }, display: "flex", flexDirection: "column" }}>
            <Box sx={{ width: 46, height: 46, borderRadius: "12px", background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: A, mb: 3 }}>
              <MemoryOutlined sx={{ fontSize: 21 }} />
            </Box>
            <Typography variant="h4" sx={{ fontSize: "1.7rem", fontWeight: 700, color: "#f5f5f5", mb: 1.5, fontFamily: "'DM Sans', Inter, sans-serif" }}>Contextual Memory</Typography>
            <Typography sx={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: 460 }}>
              Maintains multi-turn conversation state. Follow up naturally without losing context — like talking to a human analyst who remembers everything.
            </Typography>
          </Box>
        </GCard>

        <GCard delay={0.06} sx={{ background: "rgba(255,106,61,0.03)" }}>
          <Box sx={{ p: { xs: 3.5, md: 5 }, height: { md: 340 }, display: "flex", flexDirection: "column" }}>
            <Box sx={{ width: 46, height: 46, borderRadius: "12px", background: "rgba(255,106,61,0.1)", border: "1px solid rgba(255,106,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: A, mb: 3 }}>
              <AutoFixHighOutlined sx={{ fontSize: 21 }} />
            </Box>
            <Typography variant="h4" sx={{ fontSize: "1.7rem", fontWeight: 700, color: "#f5f5f5", mb: 1.5, fontFamily: "'DM Sans', Inter, sans-serif" }}>Zero Hallucination</Typography>
            <Typography sx={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>
              Answers strictly grounded in your document. If it's not in the PDF, the AI won't guess.
            </Typography>
          </Box>
        </GCard>

        <GCard delay={0.1} sx={{ background: "rgba(255,106,61,0.025)", position: "relative" }}>
          <Box sx={{ position: "absolute", right: "-6%", top: "-12%", opacity: 0.035, pointerEvents: "none" }}>
            <SecurityOutlined sx={{ fontSize: 340, color: A }} />
          </Box>
          <Box sx={{ p: { xs: 3.5, md: 5 }, height: { md: 280 }, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
            <Box sx={{ width: 46, height: 46, borderRadius: "12px", background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: A, mb: 3 }}>
              <SecurityOutlined sx={{ fontSize: 21 }} />
            </Box>
            <Typography variant="h4" sx={{ fontSize: "1.7rem", fontWeight: 700, color: "#f5f5f5", mb: 1.5, fontFamily: "'DM Sans', Inter, sans-serif" }}>Ephemeral Privacy</Typography>
            <Typography sx={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: 480 }}>
              Pure in-memory RAG. PDFs processed in RAM — no vectors written to disk, nothing retained after your session ends.
            </Typography>
          </Box>
        </GCard>

        <GCard delay={0.16}>
          <Box sx={{ p: { xs: 3.5, md: 5 }, height: { md: 280 }, display: "flex", flexDirection: "column" }}>
            <Box sx={{ width: 46, height: 46, borderRadius: "12px", background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: A, mb: 3 }}>
              <SpeedOutlined sx={{ fontSize: 21 }} />
            </Box>
            <Typography variant="h4" sx={{ fontSize: "1.7rem", fontWeight: 700, color: "#f5f5f5", mb: 1.5, fontFamily: "'DM Sans', Inter, sans-serif" }}>Instant Indexing</Typography>
            <Typography sx={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>
              ONNX-powered embedding delivers answers in milliseconds regardless of document length.
            </Typography>
          </Box>
        </GCard>
      </Box>
    </Container>
  );
}

/* ── Use cases ────────────────────────────────────────────────────────── */
const USE_CASES = [
  { icon: "📄", title: "Research Papers",   desc: "Extract methodology, results and conclusions from academic papers instantly." },
  { icon: "⚖️", title: "Legal Documents",   desc: "Navigate contracts, identify key clauses and obligations in seconds." },
  { icon: "🔧", title: "Technical Manuals", desc: "Query product specifications, troubleshooting guides and API documentation." },
  { icon: "📊", title: "Business Reports",  desc: "Extract KPIs, forecasts and strategic insights from annual reports." },
  { icon: "🎓", title: "Education",          desc: "Chat with textbooks, study guides and research material conversationally." },
  { icon: "🏥", title: "Medical Literature", desc: "Review clinical studies, drug interactions and treatment protocols rapidly." },
];

function UseCasesSection() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 10, md: 16 } }}>
      <Box textAlign="center" mb={8}>
        <Label>Use Cases</Label>
        <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3.6rem" }, fontWeight: 900, letterSpacing: "-0.04em", color: "#f5f5f5", fontFamily: "'DM Sans', Inter, sans-serif" }}>
          Built for every domain
        </Typography>
      </Box>
      <Grid container spacing={2.5}>
        {USE_CASES.map((uc, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.055, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              style={{
                background: "rgba(22,22,22,0.7)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
                padding: "26px 26px", height: "100%",
                transition: "border-color 0.18s, background 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,106,61,0.18)"; e.currentTarget.style.background = "rgba(255,106,61,0.025)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(22,22,22,0.7)"; }}
            >
              <Typography sx={{ fontSize: "1.75rem", mb: 1.5 }}>{uc.icon}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: "0.975rem", color: "#f5f5f5", mb: 0.75, fontFamily: "'DM Sans', Inter, sans-serif" }}>{uc.title}</Typography>
              <Typography sx={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.33)", lineHeight: 1.65 }}>{uc.desc}</Typography>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

/* ── Social proof / stats bar ────────────────────────────────────────── */
function StatsBar() {
  const STATS = [
    { value: "384-dim", label: "Vector dimensions" },
    { value: "<100ms",  label: "Retrieval latency" },
    { value: "50 MB",   label: "Max PDF size" },
    { value: "RAG",     label: "Architecture" },
    { value: "0 disk",  label: "Storage footprint" },
  ];
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <Container maxWidth="xl">
        <Box sx={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: { xs: 4, md: 0 },
        }}>
          {STATS.map((s, i) => (
            <Box key={i} sx={{
              flex: "1 1 160px", textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              px: 3,
            }}>
              <Typography sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 900, color: A, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                {s.value}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", mt: 0.75, letterSpacing: "0.04em" }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────── */
function CinematicCTA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <Box sx={{ position: "relative", py: { xs: 14, md: 22 }, overflow: "hidden" }}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "60%", height: "100%", background: "radial-gradient(ellipse, rgba(255,106,61,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.05)" }} />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.05)" }} />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <Label>Get Started</Label>
          <Typography variant="h2" sx={{
            fontSize: { xs: "2.5rem", md: "4.2rem" },
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.06, color: "#f5f5f5", mb: 2.5,
            fontFamily: "'DM Sans', Inter, sans-serif",
          }}>
            Ready for<br />
            <Box component="span" sx={{ color: A, textShadow: `0 0 60px ${AG}` }}>
              semantic intelligence?
            </Box>
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.33)", mb: 5, lineHeight: 1.75, maxWidth: 480, mx: "auto" }}>
            Upload your first PDF and start asking questions in plain language. No API key needed to get started.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(255,106,61,0.48)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(user ? "/chat" : "/signup")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 38px", borderRadius: 10, border: "none",
                background: A, color: "#fff",
                fontWeight: 800, fontSize: "0.975rem",
                cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
                boxShadow: "0 0 28px rgba(255,106,61,0.28)",
                transition: "box-shadow 0.2s",
              }}
            >
              {user ? "Open Workspace" : "Start for Free"}
              <KeyboardArrowRightOutlined />
            </motion.button>
            {!user && (
              <motion.button
                whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.22)", color: "#f5f5f5" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{
                  padding: "14px 38px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 500, fontSize: "0.975rem",
                  cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
                  transition: "border-color 0.2s, color 0.2s",
                }}
              >
                See how it works
              </motion.button>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

/* ── MAIN ────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <Box sx={{ position: "relative", zIndex: 1, bgcolor: "#0a0a0a", minHeight: "100vh", overflowX: "hidden" }}>
      <motion.div style={{ opacity, position: "relative", zIndex: 10 }}>
        <SplineHero />
      </motion.div>

      <Box sx={{ position: "relative", zIndex: 20 }}>
        <HowItWorksSection />
        <StatsBar />
        <PipelineSection />
        <BentoSection />
        <UseCasesSection />
        <CinematicCTA />
      </Box>

      <Box sx={{ position: "relative", zIndex: 30, background: "#0a0a0a" }}>
        <HoverFooter />
      </Box>
    </Box>
  );
}
