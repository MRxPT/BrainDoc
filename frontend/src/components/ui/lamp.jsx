import React from "react";
import { motion } from "framer-motion";

export function LampContainer({ children, className }) {
  return (
    <div
      style={{
        position: "relative", width: "100%", height: "100%",
        overflow: "hidden", background: "#0a0a0a",
      }}
      className={className}
    >
      {/* Lamp filament */}
      <motion.div
        initial={{ width: "10rem", opacity: 0 }}
        animate={{ width: "28rem", opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "18%", left: "50%",
          transform: "translateX(-50%)", height: "2px",
          background: "linear-gradient(90deg, transparent, #ff6a3d, transparent)",
          boxShadow: "0 0 20px 4px rgba(255,106,61,0.6), 0 0 60px 10px rgba(255,80,20,0.25)",
          borderRadius: "2px", zIndex: 2,
        }}
      />

      {/* Left conic beam */}
      <motion.div
        initial={{ opacity: 0, width: "8rem" }}
        animate={{ opacity: 1, width: "22rem" }}
        transition={{ delay: 0.25, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "18%", right: "50%", height: "42%",
          backgroundImage: "conic-gradient(from 70deg at center top, rgba(255,106,61,0.5), transparent, transparent)",
          zIndex: 1,
        }}
      >
        <div style={{ position: "absolute", width: "100%", bottom: 0, height: "50%", background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
        <div style={{ position: "absolute", left: 0, width: "4rem", height: "100%", background: "linear-gradient(to right, #0a0a0a, transparent)" }} />
      </motion.div>

      {/* Right conic beam */}
      <motion.div
        initial={{ opacity: 0, width: "8rem" }}
        animate={{ opacity: 1, width: "22rem" }}
        transition={{ delay: 0.25, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "18%", left: "50%", height: "42%",
          backgroundImage: "conic-gradient(from 290deg at center top, transparent, transparent, rgba(255,106,61,0.5))",
          zIndex: 1,
        }}
      >
        <div style={{ position: "absolute", width: "100%", bottom: 0, height: "50%", background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
        <div style={{ position: "absolute", right: 0, width: "4rem", height: "100%", background: "linear-gradient(to left, #0a0a0a, transparent)" }} />
      </motion.div>

      {/* Glow pool */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        style={{
          position: "absolute", top: "16%", left: "50%", transform: "translateX(-50%)",
          width: "26rem", height: "8rem", borderRadius: "9999px",
          background: "#ff6a3d", opacity: 0.25, filter: "blur(55px)", zIndex: 1,
        }}
      />
      <motion.div
        initial={{ width: "5rem", opacity: 0 }}
        animate={{ width: "12rem", opacity: 0.5 }}
        transition={{ delay: 0.4, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
          height: "6rem", borderRadius: "9999px",
          background: "#ff8a65", filter: "blur(28px)", zIndex: 1,
        }}
      />

      {/* Dark covers */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "18%", background: "#0a0a0a", zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to top, #0a0a0a 50%, transparent)", zIndex: 3 }} />

      {/* Content */}
      <div style={{
        position: "absolute", top: "28%", left: 0, right: 0, zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px",
      }}>
        {children}
      </div>
    </div>
  );
}

export default LampContainer;
