import React, { useState, useEffect } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { LogoutOutlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AvatarCircle } from "./ui/design-system";

const A = "#ff6a3d";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "rgba(255,255,255,0.38)";
const TEXT = "#f5f5f5";

function NavLink({ label, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'DM Sans', Inter, sans-serif",
        fontSize: "0.855rem", fontWeight: 500,
        color: active ? TEXT : MUTED,
        padding: "6px 14px", borderRadius: 8,
        transition: "color 0.15s",
        position: "relative",
        letterSpacing: "0.01em",
      }}
      whileHover={{ color: TEXT }}
    >
      {label}
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="nav-active-indicator"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            style={{
              position: "absolute", bottom: 3, left: "22%", right: "22%",
              height: 1.5, borderRadius: 1,
              background: A,
              boxShadow: `0 0 8px ${A}80`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (p) => location.pathname === p;

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 28px",
        background: scrolled ? "rgba(10,10,10,0.97)" : "rgba(10,10,10,0.65)",
        backdropFilter: "blur(28px)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.06)" : "transparent"}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Accent top line */}
      <Box sx={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent 0%, rgba(255,106,61,0.25) 40%, rgba(255,106,61,0.4) 50%, rgba(255,106,61,0.25) 60%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      <Box sx={{ maxWidth: 1440, mx: "auto", height: 56, display: "flex", alignItems: "center", gap: 2 }}>

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
          onClick={() => navigate("/")}
        >
          <Box sx={{
            width: 29, height: 29, borderRadius: "7px",
            background: `linear-gradient(135deg, ${A} 0%, #cc4a1f 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 18px rgba(255,106,61,0.38)`,
          }}>
            <Box sx={{
              width: 11, height: 11, borderRadius: "2.5px",
              border: "1.5px solid rgba(255,255,255,0.92)",
              transform: "rotate(45deg)",
            }} />
          </Box>
          <Typography sx={{
            fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em",
            color: TEXT, fontFamily: "'DM Sans', Inter, sans-serif",
          }}>
            Brain<Box component="span" sx={{ color: A }}>Doc</Box>
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {/* Authenticated nav */}
        {user && (
          <Box display="flex" alignItems="center" gap={0.25}>
            <NavLink label="Chat"     active={isActive("/chat")}      onClick={() => navigate("/chat")} />
            <NavLink label="Settings" active={isActive("/settings")}  onClick={() => navigate("/settings")} />
            <NavLink label="Profile"  active={isActive("/dashboard")} onClick={() => navigate("/dashboard")} />
          </Box>
        )}

        {/* Right controls */}
        {user ? (
          <Box display="flex" alignItems="center" gap={1.5} ml={1.5}>
            <Box sx={{ width: 1, height: 18, bgcolor: BORDER }} />
            <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
              <AvatarCircle name={user.username || user.email} size={30} showStatus />
            </Box>
            <Tooltip title="Sign out">
              <motion.button
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                onClick={() => { logoutUser(); navigate("/login"); }}
                style={{
                  background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`,
                  borderRadius: 8, width: 32, height: 32, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: MUTED, transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
              >
                <LogoutOutlined sx={{ fontSize: 14 }} />
              </motion.button>
            </Tooltip>
          </Box>
        ) : (
          <Box display="flex" gap={1} alignItems="center">
            <motion.button
              whileHover={{ borderColor: "rgba(255,255,255,0.2)", color: TEXT }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              style={{
                background: "transparent", border: `1px solid ${BORDER}`,
                color: MUTED, padding: "7px 20px", borderRadius: 8,
                cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
                fontWeight: 500, fontSize: "0.85rem",
                transition: "border-color 0.2s, color 0.2s",
              }}
            >
              Sign in
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(255,106,61,0.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              style={{
                background: A, border: "none", color: "#fff",
                padding: "7px 20px", borderRadius: 8,
                cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
                fontWeight: 700, fontSize: "0.85rem",
                boxShadow: "0 0 18px rgba(255,106,61,0.28)",
                transition: "box-shadow 0.2s",
              }}
            >
              Get started
            </motion.button>
          </Box>
        )}
      </Box>
    </motion.nav>
  );
}
