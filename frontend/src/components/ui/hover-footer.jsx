import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Brain, Terminal, ChevronRight } from "lucide-react";
import { GitHub, LinkedIn } from "@mui/icons-material";
import { cn } from "../../lib/utils";
import { useAppTheme } from "../../context/ThemeContext";

const NAV_LINKS = [
  { name: "Upload PDFs", href: "/upload" },
  { name: "Semantic Search", href: "/search" },
  { name: "AI Chat", href: "/chat" },
  { name: "Neural Retrieval", href: "#" },
  { name: "Document Intelligence", href: "#" },
  { name: "RAG Pipeline", href: "#" },
  { name: "Vector Search", href: "#" },
  { name: "AI Features", href: "#" },
];

const SOCIAL_LINKS = [
  { name: "GitHub", icon: GitHub, href: "https://github.com/MRxPT" },
  { name: "LinkedIn", icon: LinkedIn, href: "https://www.linkedin.com/in/prashant-tiwari-b7b23b305/" },
];

const CONTACT_INFO = [
  { icon: Mail, label: "E-MAIL", value: "prashant1979t@gmail..com" },
];

function useFooterTokens() {
  const { mode } = useAppTheme();
  const d = mode === "dark";
  return useMemo(
    () => ({
      d,
      text: d ? "#F9F7F7" : "#112D4E",
      textSub: d ? "#DBE2EF" : "#3F72AF",
      muted: d ? "rgba(219,226,239,0.65)" : "rgba(17,45,78,0.6)",
      accent: "#3F72AF",
      accentBright: "#5a8fc4",
      cardBg: d ? "rgba(17,45,78,0.5)" : "rgba(249,247,247,0.7)",
      cardBgHover: d ? "rgba(63,114,175,0.15)" : "rgba(63,114,175,0.1)",
      cardBdr: d ? "rgba(63,114,175,0.2)" : "rgba(63,114,175,0.28)",
      bgGradient: d
        ? "linear-gradient(180deg, transparent 0%, rgba(10,24,48,0.85) 100%)"
        : "linear-gradient(180deg, transparent 0%, rgba(219,226,239,0.5) 100%)",
      glow: "rgba(63,114,175,0.35)",
    }),
    [d]
  );
}

export function HoverFooter() {
  const [isHovered, setIsHovered] = useState(false);
  const T = useFooterTokens();

  return (
    <footer 
      className="relative w-full overflow-hidden font-sans"
      style={{
        background: T.bgGradient,
        borderTop: `1px solid ${T.cardBdr}`,
        color: T.text,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Neural Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-[50%] left-[20%] h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: T.d ? "rgba(63,114,175,0.15)" : "rgba(63,114,175,0.1)" }}
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute -bottom-[50%] right-[10%] h-[600px] w-[600px] rounded-full blur-[150px]"
          style={{ background: T.d ? "rgba(147,51,234,0.12)" : "rgba(63,114,175,0.1)" }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-40 pt-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* 1. Branding Section */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div 
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur-md"
                style={{ 
                  background: T.cardBg, 
                  borderColor: T.cardBdr,
                  boxShadow: `0 0 15px ${T.glow}`
                }}
              >
                <Brain className="h-6 w-6" style={{ color: T.accentBright }} />
              </div>
              <div>
                <h3 
                  className="text-2xl font-bold tracking-tight text-transparent bg-clip-text"
                  style={{
                    backgroundImage: T.d 
                      ? "linear-gradient(90deg, #F9F7F7 30%, #5a8fc4 70%, #DBE2EF)"
                      : "linear-gradient(90deg, #112D4E 30%, #3F72AF 70%, #112D4E)"
                  }}
                >
                  Brain Doc
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.accentBright }}>
                  Neural PDF Intelligence
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed" style={{ color: T.muted }}>
              Brain Doc transforms static PDFs into intelligent conversational knowledge systems using advanced semantic AI and retrieval-augmented generation.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Semantic Search Reimagined", "Conversational Document AI", "AI-Powered Retrieval System"].map((tag, i) => (
                <span 
                  key={i} 
                  className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider backdrop-blur-sm"
                  style={{ 
                    background: T.cardBgHover,
                    borderColor: T.cardBdr,
                    color: T.accentBright 
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Footer Links */}
          <div className="lg:col-span-4">
            <h4 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest" style={{ color: T.text }}>
              <Terminal className="h-4 w-4" style={{ color: T.accentBright }} />
              Navigation.SYS
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="group flex items-center text-sm transition-colors"
                    style={{ color: T.muted }}
                  >
                    <ChevronRight 
                      className="mr-1 h-3 w-3 opacity-0 transition-all group-hover:opacity-100" 
                      style={{ color: T.accentBright }} 
                    />
                    <span className="relative" style={{ color: T.muted }} onMouseEnter={(e) => e.currentTarget.style.color = T.accentBright} onMouseLeave={(e) => e.currentTarget.style.color = T.muted}>
                      {link.name}
                      <span 
                        className="absolute -bottom-0.5 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                        style={{ background: T.accentBright }}
                      ></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 & 4. Social & Contact Section */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-widest" style={{ color: T.text }}>
                Network Links
              </h4>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
                    style={{ 
                      background: T.cardBg, 
                      borderColor: T.cardBdr 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = T.cardBgHover;
                      e.currentTarget.style.boxShadow = `0 0 15px ${T.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = T.cardBg;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <social.icon 
                      className="h-4 w-4 transition-colors" 
                      style={{ color: T.muted }}
                    />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-widest" style={{ color: T.text }}>
                Terminal Comm
              </h4>
              <div className="flex flex-col gap-3 font-mono text-xs">
                {CONTACT_INFO.map((info) => (
                  <div 
                    key={info.label} 
                    className="group flex items-center gap-3 rounded-md border p-2 backdrop-blur-md transition-colors"
                    style={{ 
                      background: T.cardBg, 
                      borderColor: T.cardBdr 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = T.cardBgHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = T.cardBg;
                    }}
                  >
                    <info.icon className="h-3.5 w-3.5" style={{ color: T.accentBright }} />
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest" style={{ color: T.muted, opacity: 0.8 }}>{info.label}</span>
                      <span style={{ color: T.textSub }}>{info.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. Text Hover Effect */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex w-full items-end justify-center overflow-hidden leading-none">
        <motion.h1 
          className="relative text-[12vw] font-black uppercase tracking-tighter"
          style={{
            WebkitTextStroke: isHovered 
              ? `2px ${T.d ? "rgba(90, 143, 196, 0.8)" : "rgba(63, 114, 175, 0.8)"}` 
              : `1px ${T.d ? "rgba(63, 114, 175, 0.3)" : "rgba(17, 45, 78, 0.2)"}`,
            color: "transparent",
            textShadow: isHovered 
              ? `0 0 40px ${T.glow}, 0 0 100px ${T.d ? "rgba(147, 51, 234, 0.2)" : "rgba(63, 114, 175, 0.1)"}` 
              : "none"
          }}
          animate={{
            y: isHovered ? "15%" : "30%",
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // easeOutExpo
          }}
        >
          <span className="relative z-10">Brain Doc</span>
          
          {/* Holographic duplicate for cinematic effect */}
          <motion.span 
            className="absolute left-0 top-0 z-0"
            style={{ 
              WebkitTextStroke: `1px ${T.d ? "rgba(147, 51, 234, 0.5)" : "rgba(63, 114, 175, 0.4)"}`, 
              color: "transparent",
              filter: "blur(4px)"
            }}
            animate={{
              opacity: isHovered ? 0.8 : 0,
              x: isHovered ? "-4px" : "0px",
              y: isHovered ? "4px" : "0px",
            }}
            transition={{ duration: 0.4 }}
          >
            Brain Doc
          </motion.span>
          <motion.span 
            className="absolute left-0 top-0 z-0"
            style={{ 
              WebkitTextStroke: `1px ${T.d ? "rgba(90, 143, 196, 0.5)" : "rgba(63, 114, 175, 0.4)"}`, 
              color: "transparent",
              filter: "blur(4px)"
            }}
            animate={{
              opacity: isHovered ? 0.8 : 0,
              x: isHovered ? "4px" : "0px",
              y: isHovered ? "-4px" : "0px",
            }}
            transition={{ duration: 0.4 }}
          >
            Brain Doc
          </motion.span>
        </motion.h1>
      </div>
      
      {/* Scanline overlay for cinematic effect */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[length:100%_4px] opacity-10" 
        style={{ backgroundImage: `linear-gradient(transparent 50%, ${T.d ? "rgba(0,0,0,0.25)" : "rgba(63,114,175,0.15)"} 50%)` }}
      />
    </footer>
  );
}
