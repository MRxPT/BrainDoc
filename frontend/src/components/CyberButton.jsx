import React from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";

export default function CyberButton({ children, onClick, variant = "primary", disabled = false, sx = {}, icon }) {
  const isPrimary = variant === "primary";
  const isGhost   = variant === "ghost";

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "10px 24px", borderRadius: "8px", cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem",
        letterSpacing: "0.04em", border: "none", outline: "none",
        transition: "box-shadow 0.2s",
        opacity: disabled ? 0.4 : 1,
        ...(isPrimary ? {
          background: "linear-gradient(135deg, #3F72AF, #2d5a8e)",
          color: "#000",
          boxShadow: "0 0 20px rgba(63,114,175,0.3), 0 4px 15px rgba(0,0,0,0.4)",
        } : isGhost ? {
          background: "rgba(63,114,175,0.06)",
          color: "#3F72AF",
          border: "1px solid rgba(63,114,175,0.25)",
          boxShadow: "none",
        } : {
          background: "rgba(0,153,204,0.12)",
          color: "#3F72AF",
          border: "1px solid rgba(0,153,204,0.3)",
        }),
        ...sx,
      }}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </motion.button>
  );
}

