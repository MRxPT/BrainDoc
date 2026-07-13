import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Features",  href: "#features" },
  { label: "How it Works", href: "#how" },
  { label: "Use Cases", href: "#usecases" },
  { label: "Pricing",   href: "#pricing" },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (href) => {
    if (!isHome) { navigate("/"); setTimeout(() => scrollToId(href), 100); return; }
    scrollToId(href);
  };
  const scrollToId = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navBg = isHome
    ? scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)"
    : "rgba(255,255,255,0.95)";
  const navBorder = scrolled || !isHome ? "1px solid #e2e8f0" : "1px solid transparent";
  const textColor = isHome && !scrolled ? "#0f172a" : "#0f172a";

  return (
    <motion.nav
      initial={{ y: -88, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 1000, height: 88,
        background: navBg,
        borderBottom: navBorder,
        backdropFilter: scrolled || !isHome ? "blur(20px) saturate(180%)" : "none",
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
      }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", height: "100%", display: "flex", alignItems: "center", gap: 8 }}>

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginRight: 32, flexShrink: 0 }}
          onClick={() => navigate("/")}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.025em", color: textColor }}>
            Brain<span style={{ color: "#2563eb" }}>Doc</span>
          </span>
        </motion.div>

        {/* Center nav */}
        {isHome && (
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
            {NAV_LINKS.map((l) => (
              <motion.button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                whileHover={{ color: "#0f172a" }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 500,
                  color: "#64748b", padding: "8px 16px", borderRadius: 8,
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(15,23,42,0.05)"; e.currentTarget.style.color = "#0f172a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748b"; }}
              >
                {l.label}
              </motion.button>
            ))}
          </div>
        )}

        {!isHome && <div style={{ flex: 1 }} />}

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/chat")}
                style={{
                  padding: "10px 22px", borderRadius: 999, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#0f172a", fontWeight: 600, fontSize: "0.875rem",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Open App
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                onClick={() => { logoutUser(); navigate("/"); }}
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "1.5px solid #e2e8f0",
                  background: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#64748b", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
              >
                <LogOut size={15} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                onClick={() => navigate("/login")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 500,
                  color: "#64748b", padding: "8px 16px", borderRadius: 8,
                }}
                whileHover={{ color: "#0f172a" }}
              >
                Sign in
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(37,99,235,0.35)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/signup")}
                className="btn-primary"
                style={{ fontSize: "0.875rem", padding: "10px 22px" }}
              >
                Get started free
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
