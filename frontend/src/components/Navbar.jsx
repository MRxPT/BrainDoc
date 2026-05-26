import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Tooltip, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { ChatOutlined, SettingsOutlined, LogoutOutlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
import { CurtainThemeToggle } from "./CurtainThemeToggle";

// Palette tokens
const BLUE  = "#3F72AF";
const NAVY  = "#112D4E";
const WHITE = "#F9F7F7";
const SILVER = "#DBE2EF";

const NavItem = ({ icon, label, active, onClick, isDark }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Box onClick={onClick} sx={{
      display: "flex", alignItems: "center", gap: 1,
      px: 1.5, py: 0.75, borderRadius: "8px", cursor: "pointer",
      color: active
        ? (isDark ? WHITE : NAVY)
        : (isDark ? "rgba(219,226,239,0.55)" : "rgba(17,45,78,0.5)"),
      bgcolor: active
        ? (isDark ? "rgba(63,114,175,0.2)" : "rgba(63,114,175,0.12)")
        : "transparent",
      border: active
        ? `1px solid ${isDark ? "rgba(63,114,175,0.35)" : "rgba(63,114,175,0.25)"}`
        : "1px solid transparent",
      transition: "all 0.2s",
      "&:hover": {
        color: isDark ? WHITE : NAVY,
        bgcolor: isDark ? "rgba(63,114,175,0.12)" : "rgba(63,114,175,0.08)",
      },
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 16 } })}
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.02em" }}>{label}</Typography>
    </Box>
  </motion.div>
);

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { mode, toggleMode } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (p) => location.pathname === p;
  const isDark = mode === "dark";

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 24px",
        background: isDark
          ? scrolled ? "rgba(17,45,78,0.96)" : "rgba(17,45,78,0.78)"
          : scrolled ? "rgba(249,247,247,0.96)" : "rgba(249,247,247,0.82)",
        backdropFilter: "blur(28px)",
        borderBottom: `1px solid ${isDark
          ? scrolled ? "rgba(63,114,175,0.22)" : "rgba(63,114,175,0.1)"
          : scrolled ? "rgba(63,114,175,0.2)"  : "rgba(63,114,175,0.1)"}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Top shimmer */}
      <Box sx={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg,transparent,rgba(63,114,175,0.5),rgba(90,143,196,0.3),transparent)",
        pointerEvents: "none",
      }} />

      <Box sx={{ maxWidth: 1400, mx: "auto", height: 56, display: "flex", alignItems: "center", gap: 2 }}>
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.02 }} style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{
              width: 30, height: 30, borderRadius: "8px",
              background: `linear-gradient(135deg, ${BLUE}, ${NAVY})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(63,114,175,0.45)",
            }}>
              <Box sx={{ width: 12, height: 12, border: `2px solid ${WHITE}`, borderRadius: "3px", transform: "rotate(45deg)", opacity: 0.9 }} />
            </Box>
            <Typography sx={{
              fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.02em",
              color: isDark ? WHITE : NAVY,
              transition: "color 0.3s",
            }}>
              Brain<Box component="span" sx={{ color: BLUE }}>Doc</Box>
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <NavItem icon={<ChatOutlined />}     label="Chat"     active={isActive("/chat")}     onClick={() => navigate("/chat")} isDark={isDark} />
            <NavItem icon={<SettingsOutlined />} label="Settings" active={isActive("/settings")} onClick={() => navigate("/settings")} isDark={isDark} />
          </Box>
        )}

        {user ? (
          <Box display="flex" alignItems="center" gap={1.5} ml={1}>
            <Box sx={{ width: 1, height: 20, bgcolor: isDark ? "rgba(63,114,175,0.25)" : "rgba(63,114,175,0.2)" }} />
            <CurtainThemeToggle buttonSize={30} duration={500} onThemeChange={toggleMode} defaultTheme={mode} />
            <Box sx={{ width: 1, height: 20, bgcolor: isDark ? "rgba(63,114,175,0.25)" : "rgba(63,114,175,0.2)" }} />
            <Tooltip title="Profile">
              <motion.div whileHover={{ scale: 1.1 }} style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
                <Avatar sx={{
                  width: 30, height: 30, fontSize: "0.75rem", fontWeight: 800,
                  background: `linear-gradient(135deg,${BLUE},${NAVY})`,
                  color: WHITE, border: `1.5px solid rgba(63,114,175,0.5)`,
                  boxShadow: "0 0 12px rgba(63,114,175,0.35)",
                }}>
                  {user.username?.[0]?.toUpperCase()}
                </Avatar>
              </motion.div>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton size="small" onClick={() => { logoutUser(); navigate("/login"); }}
                sx={{ color: isDark ? "rgba(219,226,239,0.4)" : "rgba(17,45,78,0.4)", "&:hover": { color: "#ef4444" }, p: 0.5 }}>
                <LogoutOutlined sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box display="flex" gap={1} alignItems="center">
            <CurtainThemeToggle buttonSize={30} duration={500} onThemeChange={toggleMode} defaultTheme={mode} />
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                border: `1px solid rgba(63,114,175,0.35)`,
                color: isDark ? SILVER : NAVY,
                padding: "6px 18px", borderRadius: "8px",
                cursor: "pointer", fontFamily: "Inter,sans-serif",
                fontWeight: 600, fontSize: "0.82rem",
                transition: "color 0.3s, border-color 0.3s",
              }}>
              Sign in
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 26px rgba(63,114,175,0.5)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/signup")}
              style={{
                background: `linear-gradient(135deg,${BLUE},${NAVY})`,
                border: "none", color: WHITE,
                padding: "6px 18px", borderRadius: "8px",
                cursor: "pointer", fontFamily: "Inter,sans-serif",
                fontWeight: 700, fontSize: "0.82rem",
                boxShadow: "0 0 16px rgba(63,114,175,0.3)",
              }}>
              Get started
            </motion.button>
          </Box>
        )}
      </Box>
    </motion.nav>
  );
}
