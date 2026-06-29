/**
 * BrainDoc Design System — Reusable Components
 * Matte-black luxury aesthetic, #ff6a3d accent
 */
import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const A = "#ff6a3d";

// ── GlassCard ─────────────────────────────────────────────────────────────
export function GlassCard({ children, sx = {}, hover = true, glow = false, className = "", onClick, ...props }) {
  const base = {
    background: "rgba(22,22,22,0.7)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    position: "relative",
    overflow: "hidden",
    ...(glow && { boxShadow: `0 0 32px rgba(255,106,61,0.08)` }),
    ...sx,
  };

  return hover ? (
    <motion.div
      whileHover={{ y: -2, borderColor: "rgba(255,106,61,0.2)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={base}
      className={className}
      onClick={onClick}
      {...props}
    >
      <ShimmerLine />
      {children}
    </motion.div>
  ) : (
    <Box sx={base} className={className} onClick={onClick} {...props}>
      <ShimmerLine />
      {children}
    </Box>
  );
}

function ShimmerLine() {
  return (
    <Box sx={{
      position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
      background: `linear-gradient(90deg, transparent, rgba(255,106,61,0.18), transparent)`,
      pointerEvents: "none",
    }} />
  );
}

// ── AccentButton ──────────────────────────────────────────────────────────
export function AccentButton({ children, onClick, disabled = false, loading = false, size = "md", fullWidth = false, style = {} }) {
  const sizes = {
    sm: { padding: "7px 16px", fontSize: "0.8rem" },
    md: { padding: "10px 22px", fontSize: "0.875rem" },
    lg: { padding: "13px 32px", fontSize: "0.95rem" },
  };
  return (
    <motion.button
      onClick={!disabled && !loading ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.02, boxShadow: "0 0 28px rgba(255,106,61,0.45)" } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        borderRadius: 9, border: "none",
        background: disabled ? "rgba(255,106,61,0.2)" : A,
        color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
        fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'DM Sans', Inter, sans-serif",
        boxShadow: disabled ? "none" : "0 0 20px rgba(255,106,61,0.22)",
        transition: "box-shadow 0.2s",
        width: fullWidth ? "100%" : "auto",
        ...sizes[size],
        ...style,
      }}
    >
      {loading ? "Loading..." : children}
    </motion.button>
  );
}

// ── GhostButton ───────────────────────────────────────────────────────────
export function GhostButton({ children, onClick, size = "md", style = {} }) {
  const sizes = {
    sm: { padding: "7px 16px", fontSize: "0.8rem" },
    md: { padding: "10px 22px", fontSize: "0.875rem" },
    lg: { padding: "13px 32px", fontSize: "0.95rem" },
  };
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ borderColor: "rgba(255,106,61,0.35)", color: "#f5f5f5" }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        borderRadius: 9,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.5)",
        fontWeight: 500, cursor: "pointer",
        fontFamily: "'DM Sans', Inter, sans-serif",
        transition: "border-color 0.2s, color 0.2s",
        ...sizes[size],
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

// ── NeonBadge ─────────────────────────────────────────────────────────────
export function NeonBadge({ children, color = "orange", size = "sm" }) {
  const colors = {
    orange: { bg: "rgba(255,106,61,0.1)", border: "rgba(255,106,61,0.25)", text: A },
    green:  { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)",   text: "#22c55e" },
    amber:  { bg: "rgba(245,158,11,0.08)",border: "rgba(245,158,11,0.2)",  text: "#f59e0b" },
    red:    { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",   text: "#ef4444" },
    muted:  { bg: "rgba(255,255,255,0.05)",border:"rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.4)" },
  };
  const c = colors[color] || colors.muted;
  const fontSize = size === "xs" ? "0.55rem" : "0.62rem";
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center", gap: 0.5,
      px: size === "xs" ? 0.75 : 1, py: 0.2, borderRadius: "100px",
      background: c.bg, border: `1px solid ${c.border}`,
      fontSize, fontWeight: 700, color: c.text,
      letterSpacing: "0.06em", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {children}
    </Box>
  );
}

// ── MetricCard ────────────────────────────────────────────────────────────
export function MetricCard({ icon, label, value, trend, trendUp, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box sx={{
        p: 3, borderRadius: "14px",
        background: "rgba(22,22,22,0.7)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        position: "relative", overflow: "hidden",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "rgba(255,106,61,0.18)" },
      }}>
        <ShimmerLine />
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "10px",
            background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: A, fontSize: 18,
          }}>
            {icon}
          </Box>
          {trend && (
            <NeonBadge color={trendUp ? "green" : "red"} size="xs">
              {trendUp ? "↑" : "↓"} {trend}
            </NeonBadge>
          )}
        </Box>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", mb: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "1.9rem", fontWeight: 800, color: "#f5f5f5", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
          {value}
        </Typography>
      </Box>
    </motion.div>
  );
}

// ── SidebarNav ────────────────────────────────────────────────────────────
export function SidebarNav({ items, active, onSelect }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <Box
            key={item.id}
            onClick={() => onSelect(item.id)}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: 2, py: 1.25, borderRadius: "10px", cursor: "pointer",
              borderLeft: isActive ? `2px solid ${A}` : "2px solid transparent",
              background: isActive ? "rgba(255,106,61,0.06)" : "transparent",
              color: isActive ? "#f5f5f5" : "rgba(255,255,255,0.4)",
              transition: "all 0.15s",
              "&:hover": {
                background: isActive ? "rgba(255,106,61,0.06)" : "rgba(255,255,255,0.03)",
                color: "#f5f5f5",
              },
            }}
          >
            {item.icon && <Box sx={{ display: "flex", fontSize: 16 }}>{item.icon}</Box>}
            <Typography sx={{ fontSize: "0.84rem", fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </Typography>
            {item.badge && (
              <Box sx={{ ml: "auto" }}>
                <NeonBadge color={item.badgeColor || "muted"} size="xs">{item.badge}</NeonBadge>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = A, height = 4, showLabel = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <Box>
      {showLabel && (
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>{value}</Typography>
          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>{pct}%</Typography>
        </Box>
      )}
      <Box sx={{ height, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%", borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </Box>
    </Box>
  );
}

// ── ToggleSwitch ──────────────────────────────────────────────────────────
export function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <Box>
        {label && <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#f5f5f5" }}>{label}</Typography>}
        {description && <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", mt: 0.25 }}>{description}</Typography>}
      </Box>
      <motion.div
        onClick={() => onChange?.(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 99, cursor: "pointer",
          background: checked ? A : "rgba(255,255,255,0.1)",
          position: "relative", flexShrink: 0,
          boxShadow: checked ? `0 0 12px rgba(255,106,61,0.35)` : "none",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff" }}
        />
      </motion.div>
    </Box>
  );
}

// ── SliderInput ───────────────────────────────────────────────────────────
export function SliderInput({ value, onChange, min = 0, max = 100, step = 1, label, hint }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <Box sx={{ py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      {label && (
        <Box display="flex" justifyContent="space-between" mb={1.5}>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#f5f5f5" }}>{label}</Typography>
          <Typography sx={{ fontSize: "0.8rem", color: A, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{value}</Typography>
        </Box>
      )}
      <Box sx={{ position: "relative", height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", cursor: "pointer" }}>
        <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 99, background: A, boxShadow: `0 0 8px rgba(255,106,61,0.4)` }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0, cursor: "pointer",
          }}
        />
      </Box>
      {hint && <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", mt: 1, display: "flex", justifyContent: "space-between" }}>{hint}</Typography>}
    </Box>
  );
}

// ── AvatarCircle ──────────────────────────────────────────────────────────
export function AvatarCircle({ name, size = 36, showStatus = false }) {
  const letter = name?.[0]?.toUpperCase() || "U";
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <Box sx={{
        width: size, height: size, borderRadius: "10px",
        background: `linear-gradient(135deg, ${A}, #cc4a1f)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, fontWeight: 800, color: "#fff",
        boxShadow: `0 0 20px rgba(255,106,61,0.25)`,
        flexShrink: 0,
      }}>
        {letter}
      </Box>
      {showStatus && (
        <Box sx={{
          position: "absolute", bottom: -2, right: -2,
          width: 10, height: 10, borderRadius: "50%",
          bgcolor: "#22c55e", border: "2px solid #0a0a0a",
          boxShadow: "0 0 6px #22c55e",
        }} />
      )}
    </Box>
  );
}

// ── DocumentCard ──────────────────────────────────────────────────────────
export function DocumentCard({ doc, onChat, onDelete, delay = 0 }) {
  const statusColors = { ready: "#22c55e", processing: "#f59e0b", error: "#ef4444" };
  const sc = statusColors[doc.status] || "#f59e0b";

  function fmt(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, borderColor: "rgba(255,106,61,0.2)" }}
      style={{
        background: "rgba(22,22,22,0.7)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14,
        padding: 20, position: "relative", overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <ShimmerLine />
      <Box display="flex" alignItems="flex-start" gap={1.5} mb={2}>
        <Box sx={{
          width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
          background: "rgba(255,106,61,0.08)", border: "1px solid rgba(255,106,61,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.6rem", fontWeight: 900, color: A, fontFamily: "monospace",
        }}>
          PDF
        </Box>
        <Box flex={1} minWidth={0}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#f5f5f5", lineHeight: 1.3 }} noWrap>
            {doc.original_name}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.75} mt={0.4}>
            <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: sc, boxShadow: `0 0 5px ${sc}` }} />
            <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
              {doc.status === "processing" ? "indexing..." : doc.status === "error" ? "error" : `${fmt(doc.size)} · ${doc.chunk_count} chunks`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" gap={1}>
        <Box
          onClick={() => doc.status === "ready" && onChat?.(doc)}
          sx={{
            flex: 1, py: 0.8, borderRadius: 8, textAlign: "center",
            background: doc.status === "ready" ? A : "rgba(255,255,255,0.04)",
            color: doc.status === "ready" ? "#fff" : "rgba(255,255,255,0.2)",
            fontSize: "0.72rem", fontWeight: 700, cursor: doc.status === "ready" ? "pointer" : "not-allowed",
            transition: "all 0.15s",
            "&:hover": doc.status === "ready" ? { boxShadow: "0 0 14px rgba(255,106,61,0.3)" } : {},
          }}
        >
          Chat
        </Box>
        <Box
          onClick={() => onDelete?.(doc.id)}
          sx={{
            px: 1.5, py: 0.8, borderRadius: 8,
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)",
            color: "rgba(239,68,68,0.5)", fontSize: "0.72rem", fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s",
            "&:hover": { background: "rgba(239,68,68,0.12)", color: "#ef4444" },
          }}
        >
          Del
        </Box>
      </Box>
    </motion.div>
  );
}
