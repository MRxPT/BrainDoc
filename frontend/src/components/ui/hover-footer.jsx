import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Terminal, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

function GithubIcon({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const ACCENT = "#ff6a3d";

const NAV_LINKS = [
  { name: "Upload PDFs",           href: "/chat" },
  { name: "Semantic Search",       href: "/chat" },
  { name: "AI Chat",               href: "/chat" },
  { name: "Neural Retrieval",      href: "#" },
  { name: "Document Intelligence", href: "#" },
  { name: "RAG Pipeline",          href: "#" },
  { name: "Vector Search",         href: "#" },
  { name: "AI Features",           href: "#" },
];

const SOCIAL_LINKS = [
  { name: "GitHub",   icon: GithubIcon,   href: "https://github.com" },
  { name: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com" },
];

export function HoverFooter({ className }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer
      className={cn("relative w-full overflow-hidden font-sans", className)}
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "#f5f5f5" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 left-1/4 h-96 w-96 rounded-full"
          style={{ background: "rgba(255,106,61,0.07)", filter: "blur(120px)" }}
          animate={{ scale: isHovered ? 1.2 : 1, opacity: isHovered ? 0.8 : 0.3 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute -bottom-1/2 right-1/4 h-96 w-96 rounded-full"
          style={{ background: "rgba(255,80,20,0.05)", filter: "blur(150px)" }}
          animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 0.5 : 0.2 }}
          transition={{ duration: 1.2 }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-40 pt-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Branding */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #cc4a1f)`, borderColor: "rgba(255,106,61,0.3)", boxShadow: "0 0 20px rgba(255,106,61,0.25)" }}>
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight" style={{ color: "#f5f5f5" }}>
                  Brain<span style={{ color: ACCENT }}>Doc</span>
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,106,61,0.6)" }}>
                  Neural PDF Intelligence
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
              BrainDoc transforms static PDFs into intelligent conversational knowledge systems using semantic AI and retrieval-augmented generation.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {["Semantic Search", "Conversational AI", "RAG Pipeline"].map((tag) => (
                <span key={tag} className="rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-wider"
                  style={{ background: "rgba(255,106,61,0.05)", borderColor: "rgba(255,106,61,0.12)", color: "rgba(255,106,61,0.5)" }}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-[0.62rem] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>Connect</span>
              {SOCIAL_LINKS.map(({ name, icon: Icon, href }) => (
                <a key={name} href={href} target="_blank" rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
                  style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,106,61,0.25)"; e.currentTarget.style.background = "rgba(255,106,61,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <Icon className="h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-4">
            <h4 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Terminal className="h-3.5 w-3.5" style={{ color: "rgba(255,106,61,0.5)" }} />
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="group flex items-center text-sm transition-colors"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = ACCENT}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
                  >
                    <ChevronRight className="mr-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: ACCENT }} />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Contact</h4>
            <div className="rounded-xl border p-3 font-mono text-xs"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
              <span style={{ color: "rgba(255,106,61,0.5)" }}>E-MAIL</span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>contact@braindoc.ai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Large hover text */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex w-full items-end justify-center overflow-hidden leading-none">
        <motion.h1
          className="relative text-[12vw] font-black uppercase tracking-tighter"
          style={{
            WebkitTextStroke: isHovered ? `2px rgba(255,106,61,0.5)` : `1px rgba(255,255,255,0.04)`,
            color: "transparent",
            textShadow: isHovered ? "0 0 60px rgba(255,106,61,0.15)" : "none",
          }}
          animate={{ y: isHovered ? "15%" : "30%", scale: isHovered ? 1.02 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          BrainDoc
        </motion.h1>
      </div>

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)", backgroundSize: "100% 4px" }}
      />
    </footer>
  );
}

export default HoverFooter;
