import React, { useEffect, useRef } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
import {
  UploadFileOutlined, SearchOutlined, AutoAwesomeOutlined,
  HubOutlined, BlurOnOutlined, MemoryOutlined,
  SecurityOutlined, KeyboardArrowRightOutlined,
  AutoFixHighOutlined, SpeedOutlined
} from "@mui/icons-material";
import SplineHero from "../components/SplineHero";
import { HoverFooter } from "../components/ui/hover-footer";
import { LampContainer } from "../components/ui/lamp";

gsap.registerPlugin(ScrollTrigger);

// Custom tokens for the cinematic aesthetic
function useTokens() {
  const { mode } = useAppTheme();
  const d = mode === "dark";
  return {
    d,
    bg: d ? "#030712" : "#f8fafc",
    surface: d ? "rgba(17, 24, 39, 0.4)" : "rgba(255, 255, 255, 0.6)",
    border: d ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    text: d ? "#f9fafb" : "#0f172a",
    muted: d ? "#9ca3af" : "#64748b",
    accent: "#06b6d4",
    accentGlow: "rgba(6, 182, 212, 0.15)",
  };
}

// Minimal futuristic badge
function SectionBadge({ children }) {
  const T = useTokens();
  return (
    <Box display="inline-flex" alignItems="center" gap={1.5} sx={{
      px: 2, py: 0.75, mb: 3, borderRadius: "100px",
      background: T.surface, border: `1px solid ${T.border}`,
      backdropFilter: "blur(12px)",
    }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: T.accent, boxShadow: `0 0 10px ${T.accent}` }} />
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", color: T.text, textTransform: "uppercase" }}>
        {children}
      </Typography>
    </Box>
  );
}

// Cinematic Card with hover glow
function CinematicCard({ children, style = {} }) {
  const T = useTokens();
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        background: T.surface,
        backdropFilter: "blur(20px)",
        border: `1px solid ${T.border}`,
        borderRadius: "24px",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${T.accentGlow}, transparent 40%)`, opacity: 0, transition: "opacity 0.3s", pointerEvents: "none", className: "glow-effect" }} />
      {children}
    </motion.div>
  );
}

// Sticky Scrolling Section (Webflow Style)
function StickyScrollSection() {
  const T = useTokens();
  
  const steps = [
    { num: "01", title: "Semantic Ingestion", desc: "PDFs are parsed and cleaned instantly. Unstructured text is transformed into machine-readable neural chunks in memory.", icon: <UploadFileOutlined fontSize="large" /> },
    { num: "02", title: "Vector Embedding", desc: "High-dimensional sentence transformers map your chunks into a FAISS index, capturing deep contextual relationships.", icon: <BlurOnOutlined fontSize="large" /> },
    { num: "03", title: "Neural Retrieval", desc: "Your queries are instantly embedded and matched against thousands of vectors, pulling the exact semantic context needed.", icon: <SearchOutlined fontSize="large" /> },
    { num: "04", title: "Generative Reasoning", desc: "LLMs synthesize the retrieved vectors into precise, grounded answers with zero hallucination.", icon: <HubOutlined fontSize="large" /> },
  ];

  return (
    <Container maxWidth="xl" sx={{ position: "relative", py: { xs: 10, md: 20 } }}>
       <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
             <Box sx={{ position: "sticky", top: "12vh", mb: { xs: 8, md: 0 } }}>
                <SectionBadge>NEURAL PIPELINE</SectionBadge>
                <Typography variant="h2" sx={{ fontSize: {xs: "2.5rem", md: "4.5rem"}, fontWeight: 700, letterSpacing: "-0.04em", mb: 3, lineHeight: 1.1, color: T.text }}>
                  Upload.<br/>Embed.<br/>
                  <Box component="span" sx={{ background: `linear-gradient(135deg, ${T.accent}, #3b82f6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Retrieve.
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: "1rem", color: T.muted, lineHeight: 1.6, maxWidth: 380, mb: 5 }}>
                  A continuous flow of intelligence. We extract meaning from your documents, chunk them via semantic boundaries, and vectorise them for sub-millisecond retrieval.
                </Typography>

                {/* Animated Pipeline Flowchart */}
                <PipelineFlowchart T={T} />
             </Box>
          </Grid>
          <Grid item xs={12} md={7}>
             <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 8 } }}>
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                  >
                    <CinematicCard style={{ padding: "40px" }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                        <Box sx={{ width: 60, height: 60, borderRadius: "16px", background: `linear-gradient(135deg, ${T.surface}, transparent)`, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent }}>
                          {step.icon}
                        </Box>
                        <Typography sx={{ fontSize: "3rem", fontWeight: 800, color: T.border, lineHeight: 1 }}>
                          {step.num}
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontSize: "1.8rem", fontWeight: 700, mb: 2, color: T.text }}>
                        {step.title}
                      </Typography>
                      <Typography sx={{ fontSize: "1rem", color: T.muted, lineHeight: 1.7 }}>
                        {step.desc}
                      </Typography>
                    </CinematicCard>
                  </motion.div>
                ))}
             </Box>
          </Grid>
       </Grid>
    </Container>
  );
}

// Animated Pipeline Flowchart component
function PipelineFlowchart({ T }) {
  const pipelineNodes = [
    { label: "PDF Upload", sublabel: "raw document ingestion", color: "#06b6d4" },
    { label: "Chunking", sublabel: "semantic segmentation", color: "#3b82f6" },
    { label: "Embedding", sublabel: "FAISS vector index", color: "#8b5cf6" },
    { label: "Retrieval", sublabel: "top-k similarity search", color: "#06b6d4" },
    { label: "LLM Answer", sublabel: "grounded AI response", color: "#10b981" },
  ];

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 340 }}>
      {pipelineNodes.map((node, i) => (
        <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* Node row */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ width: "100%" }}
          >
            <Box sx={{
              display: "flex", alignItems: "center", gap: 2,
              px: 2.5, py: 1.8,
              borderRadius: "14px",
              background: T.d ? `rgba(255,255,255,0.04)` : `rgba(0,0,0,0.03)`,
              border: `1px solid ${T.d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              backdropFilter: "blur(12px)",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
              transition: "all 0.3s ease",
              "&:hover": {
                background: T.d ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.06)",
                border: `1px solid ${node.color}55`,
                transform: "translateX(4px)",
              }
            }}>
              {/* Left accent bar */}
              <Box sx={{
                position: "absolute", left: 0, top: "20%", bottom: "20%",
                width: 3, borderRadius: "2px",
                background: node.color,
                boxShadow: `0 0 8px ${node.color}88`,
              }} />

              {/* Step number badge */}
              <Box sx={{
                minWidth: 34, height: 34, borderRadius: "9px",
                background: `${node.color}18`,
                border: `1px solid ${node.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                ml: 0.5, flexShrink: 0,
              }}>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 900, color: node.color, letterSpacing: "0.05em" }}>
                  {String(i + 1).padStart(2, "0")}
                </Typography>
              </Box>

              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.83rem", fontWeight: 700, color: T.text, lineHeight: 1.2 }}>
                  {node.label}
                </Typography>
                <Typography sx={{ fontSize: "0.68rem", color: T.muted, mt: 0.2, lineHeight: 1.2 }}>
                  {node.sublabel}
                </Typography>
              </Box>

              {/* Pulsing status dot */}
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
              </motion.div>
            </Box>
          </motion.div>

          {/* Animated connector between nodes */}
          {i < pipelineNodes.length - 1 && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 + 0.3 }}
              style={{ transformOrigin: "top", marginLeft: "30px" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 0.3 }}>
                {[0, 1, 2].map(dot => (
                  <motion.div key={dot} animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: dot * 0.25 + i * 0.3 }}>
                    <Box sx={{
                      width: 2, height: 5, borderRadius: "1px", mb: "3px",
                      background: `linear-gradient(to bottom, ${pipelineNodes[i].color}, ${pipelineNodes[i + 1].color})`,
                    }} />
                  </motion.div>
                ))}
                {/* Arrow tip */}
                <Box sx={{
                  width: 0, height: 0,
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderTop: `6px solid ${pipelineNodes[i + 1].color}99`,
                  mt: 0.2,
                }} />
              </Box>
            </motion.div>
          )}
        </Box>
      ))}

      {/* Output confirmation badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Box sx={{
          mt: 2.5, px: 2.5, py: 1.3,
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))",
          border: "1px solid rgba(16,185,129,0.25)",
          display: "flex", alignItems: "center", gap: 1.5,
        }}>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 12px #10b981" }} />
          </motion.div>
          <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#10b981", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Contextual Answer Generated
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}

// Bento Grid Section (Perplexity-style clean UI)
function BentoFeatures() {
  const T = useTokens();
  
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 10, md: 20 } }}>
       <Box textAlign="center" mb={10}>
          <SectionBadge>INTELLIGENCE LAYER</SectionBadge>
          <Typography variant="h2" sx={{ fontSize: {xs: "2.5rem", md: "4rem"}, fontWeight: 700, mb: 2, color: T.text, letterSpacing: "-0.03em" }}>
            Beyond keyword search
          </Typography>
       </Box>
       
       <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
               <CinematicCard style={{ height: "400px", display: "flex", flexDirection: "column", padding: "40px" }}>
                 <Box sx={{ flexGrow: 1 }}>
                   <MemoryOutlined sx={{ fontSize: 40, color: T.accent, mb: 3 }} />
                   <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: 700, color: T.text, mb: 2 }}>Contextual Memory</Typography>
                   <Typography sx={{ fontSize: "1.1rem", color: T.muted, maxWidth: 500, lineHeight: 1.6 }}>
                     Maintains conversation state across multi-turn interactions. Follow up naturally without losing context, just like talking to a human analyst.
                   </Typography>
                 </Box>
               </CinematicCard>
             </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
               <CinematicCard style={{ height: "400px", display: "flex", flexDirection: "column", padding: "40px", background: `linear-gradient(135deg, ${T.surface}, rgba(6, 182, 212, 0.05))` }}>
                 <Box sx={{ flexGrow: 1 }}>
                   <AutoFixHighOutlined sx={{ fontSize: 40, color: T.accent, mb: 3 }} />
                   <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: 700, color: T.text, mb: 2 }}>Zero Hallucination</Typography>
                   <Typography sx={{ fontSize: "1.1rem", color: T.muted, lineHeight: 1.6 }}>
                     Answers are strictly grounded in your provided documents. If it's not in the PDF, the AI won't guess.
                   </Typography>
                 </Box>
               </CinematicCard>
             </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
               <CinematicCard style={{ height: "350px", display: "flex", flexDirection: "column", padding: "40px" }}>
                 <Box sx={{ flexGrow: 1 }}>
                   <SpeedOutlined sx={{ fontSize: 40, color: T.accent, mb: 3 }} />
                   <Typography variant="h4" sx={{ fontSize: "1.8rem", fontWeight: 700, color: T.text, mb: 2 }}>Instant Indexing</Typography>
                   <Typography sx={{ fontSize: "1rem", color: T.muted, lineHeight: 1.6 }}>
                     FAISS-powered vector search gives you answers in milliseconds, regardless of document length.
                   </Typography>
                 </Box>
               </CinematicCard>
             </motion.div>
          </Grid>
          <Grid item xs={12} md={8}>
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
               <CinematicCard style={{ height: "350px", display: "flex", flexDirection: "column", padding: "40px", position: "relative", overflow: "hidden" }}>
                 <Box sx={{ position: "absolute", right: "-10%", top: "-20%", opacity: 0.1 }}>
                   <SecurityOutlined sx={{ fontSize: 400, color: T.accent }} />
                 </Box>
                 <Box sx={{ flexGrow: 1, position: "relative", zIndex: 2 }}>
                   <SecurityOutlined sx={{ fontSize: 40, color: T.accent, mb: 3 }} />
                   <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: 700, color: T.text, mb: 2 }}>Ephemeral RAG Architecture</Typography>
                   <Typography sx={{ fontSize: "1.1rem", color: T.muted, maxWidth: 500, lineHeight: 1.6 }}>
                     Absolute privacy by design. Your PDFs are processed purely in-memory. No vectors are saved to disk, and no documents are retained after your session ends.
                   </Typography>
                 </Box>
               </CinematicCard>
             </motion.div>
          </Grid>
       </Grid>
    </Container>
  );
}

// Lamp UI Call to Action
function CinematicCTA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <Box sx={{ position: "relative", height: "80vh", width: "100%", mt: 10, display: "flex", alignItems: "center" }}>
       <LampContainer>
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(to bottom, #ffffff, #9ca3af)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              marginBottom: "2rem",
              lineHeight: 1.1
            }}
          >
            Ready for semantic<br/>intelligence?
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(user ? "/chat" : "/signup")}
            style={{
              padding: "16px 40px",
              borderRadius: "50px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: 600,
              cursor: "pointer",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 0 40px rgba(6, 182, 212, 0.2)"
            }}
          >
            Deploy Brain Doc <KeyboardArrowRightOutlined />
          </motion.button>
       </LampContainer>
    </Box>
  );
}

// 
// MAIN PAGE EXPORT
// 
export default function HomePage() {
  const T = useTokens();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Mouse glow effect handler for cinematic cards
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.querySelectorAll('.glow-effect').forEach((el) => {
        const rect = el.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
        el.style.opacity = "1";
      });
    };
    
    const handleMouseLeave = () => {
      document.querySelectorAll('.glow-effect').forEach((el) => {
        el.style.opacity = "0";
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Box sx={{ position: "relative", zIndex: 1, bgcolor: T.bg, minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* 3D Spline Centerpiece with Fade on Scroll */}
      <motion.div style={{ opacity, position: "relative", zIndex: 10 }}>
        <SplineHero />
      </motion.div>

      {/* Main Content Layers */}
      <Box sx={{ position: "relative", zIndex: 20 }}>
        <StickyScrollSection />
        <BentoFeatures />
        <CinematicCTA />
      </Box>

      {/* Footer */}
      <Box sx={{ position: "relative", zIndex: 30, background: T.bg }}>
        <HoverFooter />
      </Box>

    </Box>
  );
}
