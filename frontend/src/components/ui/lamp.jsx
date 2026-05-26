import React from "react";
import { motion } from "framer-motion";

/* 
 * LampContainer
 * Full-area lamp effect. Children appear inside the lit cone -
 * the bright cyan glow from above illuminates the content below.
 * Uses absolute positioning (not flex-center) so content always
 * lands in the light pool regardless of container height.
 *  */
export function LampContainer({ children, className }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#020617",
      }}
      className={className}
    >
      {/*  Lamp filament bar  */}
      <motion.div
        initial={{ width: "10rem", opacity: 0 }}
        animate={{ width: "28rem", opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #22d3ee, transparent)",
          boxShadow: "0 0 20px 4px rgba(34,211,238,0.7), 0 0 60px 10px rgba(6,182,212,0.3)",
          borderRadius: "2px",
          zIndex: 2,
        }}
      />

      {/*  Left conic beam  */}
      <motion.div
        initial={{ opacity: 0, width: "8rem" }}
        animate={{ opacity: 1, width: "22rem" }}
        transition={{ delay: 0.25, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "18%",
          right: "50%",
          height: "42%",
          backgroundImage: "conic-gradient(from 70deg at center top, rgba(6,182,212,0.7), transparent, transparent)",
          zIndex: 1,
        }}
      >
        <div style={{ position:"absolute", width:"100%", bottom:0, height:"50%", background:"linear-gradient(to top, #020617, transparent)" }} />
        <div style={{ position:"absolute", left:0, width:"4rem", height:"100%", background:"linear-gradient(to right, #020617, transparent)" }} />
      </motion.div>

      {/*  Right conic beam  */}
      <motion.div
        initial={{ opacity: 0, width: "8rem" }}
        animate={{ opacity: 1, width: "22rem" }}
        transition={{ delay: 0.25, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          height: "42%",
          backgroundImage: "conic-gradient(from 290deg at center top, transparent, transparent, rgba(6,182,212,0.7))",
          zIndex: 1,
        }}
      >
        <div style={{ position:"absolute", width:"100%", bottom:0, height:"50%", background:"linear-gradient(to top, #020617, transparent)" }} />
        <div style={{ position:"absolute", right:0, width:"4rem", height:"100%", background:"linear-gradient(to left, #020617, transparent)" }} />
      </motion.div>

      {/*  Glow pool - the "desk surface" illumination  */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        style={{
          position: "absolute",
          top: "16%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "26rem",
          height: "8rem",
          borderRadius: "9999px",
          background: "#06b6d4",
          opacity: 0.45,
          filter: "blur(55px)",
          zIndex: 1,
        }}
      />
      <motion.div
        initial={{ width: "5rem", opacity: 0 }}
        animate={{ width: "12rem", opacity: 0.6 }}
        transition={{ delay: 0.4, duration: 0.9, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          height: "6rem",
          borderRadius: "9999px",
          background: "#22d3ee",
          filter: "blur(28px)",
          zIndex: 1,
        }}
      />

      {/*  Dark cover - hides the raw cone edges above the filament  */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"18%", background:"#020617", zIndex:3 }} />

      {/*  Bottom fade  */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"20%", background:"linear-gradient(to top, #020617 50%, transparent)", zIndex:3 }} />

      {/*  Content - sits below filament, inside the lit cone 
          Positioned at 28% from top so it appears within the light pool,
          not in the dark area below. */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export { LampContainer as default };
