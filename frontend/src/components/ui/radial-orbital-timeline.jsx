import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Layers,
  Binary,
  Database,
  Target,
  Search,
  Sparkles,
  Workflow,
  MessageCircle,
  Brain,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

export const AI_WORKFLOW_STAGES = [
  {
    id: "upload",
    title: "PDF Upload",
    description:
      "Secure ingestion gateway accepts digital and scanned PDFs. Files are validated, queued, and routed into the neural processing core.",
    metric: " 50 MB  instant queue",
    operations: ["Ingestion", "Validation", "Secure Storage"],
    icon: Upload,
    accent: "cyan",
  },
  {
    id: "extract",
    title: "Text Extraction",
    description:
      "PyMuPDF parses digital layers; Tesseract OCR activates for image-based pages at 300 DPI with contrast enhancement.",
    metric: "99.2% char accuracy",
    operations: ["PyMuPDF", "Tesseract OCR", "Page Map"],
    icon: FileText,
    accent: "blue",
  },
  {
    id: "chunk",
    title: "Semantic Chunking",
    description:
      "Sentence-aware segmentation preserves context boundaries. Overlapping windows maintain continuity across section breaks.",
    metric: "512-token windows",
    operations: ["Sentence Split", "Overlap Merge", "Metadata Tag"],
    icon: Layers,
    accent: "purple",
  },
  {
    id: "embed",
    title: "Vector Embeddings",
    description:
      "all-MiniLM-L6-v2 encodes each chunk into dense 384-dimensional semantic vectors capturing meaning, not keywords.",
    metric: "384-dim  MiniLM",
    operations: ["Encode", "Normalize", "Batch GPU"],
    icon: Binary,
    accent: "cyan",
  },
  {
    id: "faiss",
    title: "FAISS Indexing",
    description:
      "Vectors are indexed in-memory with FAISS for sub-millisecond approximate nearest-neighbor search at scale.",
    metric: "< 100ms retrieval",
    operations: ["Index Build", "IVF Flat", "RAM Cache"],
    icon: Database,
    accent: "emerald",
  },
  {
    id: "context",
    title: "Context Retrieval",
    description:
      "Top-k semantic matches are re-ranked and assembled into a focused context window for the language model.",
    metric: "Top-5  re-ranked",
    operations: ["Similarity", "Re-rank", "Context Pack"],
    icon: Target,
    accent: "blue",
  },
  {
    id: "search",
    title: "Neural Search",
    description:
      "Dense retrieval crosses the full document corpus - understanding intent and synonyms beyond exact keyword match.",
    metric: "Cosine  semantic",
    operations: ["ANN Search", "Score Fusion", "Filter"],
    icon: Search,
    accent: "purple",
  },
  {
    id: "generate",
    title: "AI Response Generation",
    description:
      "LLM synthesizes grounded answers from retrieved passages. Local flan-t5 or cloud Groq/Gemini/OpenAI modes.",
    metric: "Grounded  sourced",
    operations: ["Prompt Build", "LLM Infer", "Cite Sources"],
    icon: Sparkles,
    accent: "cyan",
  },
  {
    id: "rag",
    title: "RAG Pipeline",
    description:
      "Retrieval-Augmented Generation fuses search and generation - every answer anchored to your document, not the model's memory.",
    metric: "94%+ accuracy",
    operations: ["Retrieve", "Augment", "Generate"],
    icon: Workflow,
    accent: "purple",
  },
  {
    id: "chat",
    title: "Conversational Intelligence",
    description:
      "Multi-turn memory maintains dialogue context. Follow-up questions refine understanding without re-uploading.",
    metric: " turn memory",
    operations: ["Session State", "Follow-up", "Stream"],
    icon: MessageCircle,
    accent: "emerald",
  },
];

const ACCENT = {
  cyan: {
    ring: "ring-cyan-400/60",
    glow: "shadow-[0_0_24px_rgba(34,211,238,0.55)]",
    bg: "bg-cyan-500/15",
    border: "border-cyan-400/40",
    text: "text-cyan-300",
    line: "stroke-cyan-400",
  },
  blue: {
    ring: "ring-blue-400/60",
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.55)]",
    bg: "bg-blue-500/15",
    border: "border-blue-400/40",
    text: "text-blue-300",
    line: "stroke-blue-400",
  },
  purple: {
    ring: "ring-purple-400/60",
    glow: "shadow-[0_0_24px_rgba(168,85,247,0.55)]",
    bg: "bg-purple-500/15",
    border: "border-purple-400/40",
    text: "text-purple-300",
    line: "stroke-purple-400",
  },
  emerald: {
    ring: "ring-emerald-400/60",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.55)]",
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/40",
    text: "text-emerald-300",
    line: "stroke-emerald-400",
  },
};

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return mobile;
}

function NeuralCore() {
  return (
    <motion.div
      className="orbital-core relative z-20 flex h-24 w-24 items-center justify-center rounded-full md:h-28 md:w-28"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 via-purple-600/20 to-blue-600/30 blur-md"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border border-cyan-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-dashed border-purple-400/25"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/40 bg-[rgba(8,15,30,0.92)] backdrop-blur-xl md:h-16 md:w-16"
        style={{ boxShadow: "0 0 40px rgba(34,211,238,0.35), inset 0 1px 0 rgba(255,255,255,0.08)" }}
      >
        <Brain className="h-7 w-7 text-cyan-400 neural-icon-glow md:h-8 md:w-8" />
      </motion.div>
    </motion.div>
  );
}

function ConnectionLines({ activeIndex, count, radius }) {
  const cx = 50;
  const cy = 50;
  const lines = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const x2 = cx + (radius / 10) * Math.cos(rad) * 10;
    const y2 = cy + (radius / 10) * Math.sin(rad) * 10;
    return { x2, y2, active: i === activeIndex };
  });

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {lines.map((line, i) => (
        <motion.line
          key={i}
          x1={cx}
          y1={cy}
          x2={line.x2}
          y2={line.y2}
          strokeWidth={line.active ? 0.35 : 0.12}
          className={cn(
            "transition-all duration-500",
            line.active ? "connection-line-active stroke-cyan-400" : "stroke-cyan-500/15"
          )}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            opacity: line.active ? 0.9 : 0.25,
            pathLength: 1,
          }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </svg>
  );
}

function NodeCard({ stage, isActive, onClick, index, total }) {
  const Icon = stage.icon;
  const accent = ACCENT[stage.accent] || ACCENT.cyan;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "orbital-node group relative flex flex-col items-center gap-1.5 outline-none",
        isActive && "z-30"
      )}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label={stage.title}
      aria-pressed={isActive}
    >
      <motion.div
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300 md:h-12 md:w-12",
          accent.bg,
          accent.border,
          isActive ? cn(accent.ring, accent.glow, "ring-2") : "opacity-70 group-hover:opacity-100"
        )}
        animate={isActive ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
      >
        {isActive && (
          <span className="orbital-pulse-ring absolute inset-0 rounded-xl" />
        )}
        <Icon className={cn("h-5 w-5", accent.text)} />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0f1a] text-[0.55rem] font-bold text-cyan-400/80 border border-cyan-500/30">
          {index + 1}
        </span>
      </motion.div>
      <span
        className={cn(
          "max-w-[72px] text-center text-[0.6rem] font-bold leading-tight tracking-wide md:max-w-[88px] md:text-[0.65rem]",
          isActive ? accent.text : "text-slate-500 group-hover:text-slate-300"
        )}
      >
        {stage.title}
      </span>
    </motion.button>
  );
}

function DetailPanel({ stage, onNext, onPrev }) {
  const Icon = stage.icon;
  const accent = ACCENT[stage.accent] || ACCENT.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="orbital-glass-card overflow-hidden border-cyan-500/20 bg-[rgba(6,12,28,0.88)]">
        <motion.div
          className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          layoutId="card-shimmer"
        />
        <CardHeader className="pb-3">
          <motion.div
            className={cn(
              "mb-3 flex h-12 w-12 items-center justify-center rounded-xl border",
              accent.bg,
              accent.border
            )}
            initial={{ rotate: -8 }}
            animate={{ rotate: 0 }}
          >
            <Icon className={cn("h-6 w-6", accent.text)} />
          </motion.div>
          <CardTitle className="text-xl font-bold tracking-tight text-white">
            {stage.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-slate-400">
            {stage.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            className="flex items-center gap-2 rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-3 py-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-cyan-500/70">
              Intelligence Metric
            </span>
            <span className={cn("ml-auto text-sm font-semibold", accent.text)}>
              {stage.metric}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
              Connected Neural Operations
            </p>
            <motion.div className="flex flex-wrap gap-1.5">
              {stage.operations.map((op, i) => (
                <motion.span
                  key={op}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <Badge variant={i % 2 === 0 ? "default" : "neural"}>{op}</Badge>
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={onPrev} className="flex-1">
              Previous
            </Button>
            <Button variant="default" size="sm" onClick={onNext} className="flex-1">
              Next Stage <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function RadialOrbitalTimeline({
  stages = AI_WORKFLOW_STAGES,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [orbitRotation, setOrbitRotation] = useState(0);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const count = stages.length;

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!autoPlay || paused) return;
    const id = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, paused, goNext]);

  useEffect(() => {
    const id = setInterval(() => {
      setOrbitRotation((r) => (r + 0.15) % 360);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const radius = isMobile ? 130 : 200;
  const containerSize = isMobile ? 320 : 480;

  return (
    <section
      ref={containerRef}
      className={cn("orbital-timeline-section relative w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="AI neural processing pipeline"
    >
      {/* Ambient background */}
      <motion.div
        className="orbital-ambient-glow pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative mx-auto flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Orbital visualization */}
        <div
          className="relative flex-shrink-0"
          style={{ width: containerSize, height: containerSize }}
        >
          <ConnectionLines activeIndex={activeIndex} count={count} radius={radius} />

          {/* Rotating orbit rings */}
          <motion.div
            className="orbital-ring-outer pointer-events-none absolute inset-4 rounded-full border border-cyan-500/10"
            style={{ rotate: orbitRotation }}
          />
          <motion.div
            className="orbital-ring-inner pointer-events-none absolute inset-12 rounded-full border border-dashed border-purple-500/15"
            style={{ rotate: -orbitRotation * 1.4 }}
          />

          {/* Center core */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <NeuralCore />
          </motion.div>

          {/* Orbiting nodes */}
          <motion.div
            className="absolute inset-0"
            style={{ rotate: orbitRotation * 0.3 }}
          >
            {stages.map((stage, i) => {
              const angle = (360 / count) * i - 90;
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={stage.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    x: x - (isMobile ? 22 : 24),
                    y: y - (isMobile ? 28 : 30),
                    rotate: -orbitRotation * 0.3,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 260 }}
                >
                  <NodeCard
                    stage={stage}
                    index={i}
                    total={count}
                    isActive={isActive}
                    onClick={() => setActiveIndex(i)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Detail panel */}
        <div className="relative z-10 w-full max-w-md px-4 lg:px-0">
          <AnimatePresence mode="wait">
            <DetailPanel
              key={stages[activeIndex].id}
              stage={stages[activeIndex]}
              onNext={goNext}
              onPrev={goPrev}
            />
          </AnimatePresence>

          {/* Stage indicators */}
          <motion.div
            className="mt-4 flex justify-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {stages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "w-6 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                    : "w-1.5 bg-slate-600 hover:bg-slate-400"
                )}
                aria-label={`Stage ${i + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default RadialOrbitalTimeline;
