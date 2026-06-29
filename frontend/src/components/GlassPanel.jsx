import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function GlassPanel({ children, sx = {}, glow = false, animate = true, ...props }) {
  const base = {
    background: "rgba(255,255,255,0.025)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    position: "relative",
    overflow: "hidden",
    ...(glow && { boxShadow: "0 0 40px rgba(255,106,61,0.06), inset 0 1px 0 rgba(255,106,61,0.08)" }),
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
      <Box sx={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,106,61,0.2), transparent)",
        pointerEvents: "none",
      }} />
      {children}
    </motion.div>
  );
}
