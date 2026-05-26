import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function GlassPanel({ children, sx = {}, glow = false, animate = true, ...props }) {
  const base = {
    background: "rgba(6,11,20,0.7)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(63,114,175,0.12)",
    borderRadius: "16px",
    position: "relative",
    overflow: "hidden",
    ...(glow && {
      boxShadow: "0 0 40px rgba(63,114,175,0.08), inset 0 1px 0 rgba(63,114,175,0.1)",
    }),
    ...sx,
  };

  if (!animate) return <Box sx={base} {...props}>{children}</Box>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...base }}
      {...props}
    >
      {/* Top edge glow */}
      <Box sx={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(63,114,175,0.4), transparent)",
        pointerEvents: "none",
      }} />
      {children}
    </motion.div>
  );
}

