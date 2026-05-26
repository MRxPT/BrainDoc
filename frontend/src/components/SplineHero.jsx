import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";

const BLUE   = "#3F72AF";
const NAVY   = "#112D4E";
const WHITE  = "#F9F7F7";
const SILVER = "#DBE2EF";

//  Three.js Neural Brain 
function NeuralBrain({ isDark }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let THREE;
    let renderer, scene, camera;
    let cancelled = false;

    import("three").then((mod) => {
      if (cancelled) return;
      THREE = mod;

      const W = el.clientWidth  || 500;
      const H = el.clientHeight || 500;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      // Scene & Camera
      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.set(0, 0, 4.5);

      //  Neural nodes 
      const nodeCount = 120;
      const nodePositions = [];
      const nodeGroup = new THREE.Group();

      const nodeGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x3F72AF });
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x5a8fc4, transparent: true, opacity: 0.4 });

      for (let i = 0; i < nodeCount; i++) {
        // Distribute nodes in a sphere shape
        const phi   = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        const r     = 1.6 + (Math.random() - 0.5) * 0.8;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        nodePositions.push(new THREE.Vector3(x, y, z));

        const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
        mesh.position.set(x, y, z);
        nodeGroup.add(mesh);

        // Glow sphere
        const glowGeo = new THREE.SphereGeometry(0.055, 8, 8);
        const glow = new THREE.Mesh(glowGeo, glowMat.clone());
        glow.position.set(x, y, z);
        nodeGroup.add(glow);
      }

      //  Connections 
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x3F72AF, transparent: true, opacity: 0.18,
      });

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          if (dist < 0.85) {
            const geo = new THREE.BufferGeometry().setFromPoints([
              nodePositions[i], nodePositions[j],
            ]);
            const line = new THREE.Line(geo, lineMat.clone());
            nodeGroup.add(line);
          }
        }
      }

      //  Core sphere 
      const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x112D4E, transparent: true, opacity: 0.85,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      nodeGroup.add(core);

      // Core glow rings
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(0.42 + i * 0.18, 0.008, 8, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x3F72AF, transparent: true, opacity: 0.35 - i * 0.08,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2 + i * 0.4;
        ring.rotation.y = i * 0.6;
        nodeGroup.add(ring);
      }

      //  Outer wireframe sphere 
      const wireGeo = new THREE.SphereGeometry(2.0, 16, 16);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x3F72AF, wireframe: true, transparent: true, opacity: 0.06,
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      nodeGroup.add(wire);

      scene.add(nodeGroup);

      //  Ambient particles 
      const partCount = 200;
      const partPositions = new Float32Array(partCount * 3);
      for (let i = 0; i < partCount; i++) {
        partPositions[i * 3]     = (Math.random() - 0.5) * 8;
        partPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        partPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
      const partGeo = new THREE.BufferGeometry();
      partGeo.setAttribute("position", new THREE.BufferAttribute(partPositions, 3));
      const partMat = new THREE.PointsMaterial({
        color: 0xDBE2EF, size: 0.018, transparent: true, opacity: 0.35,
      });
      scene.add(new THREE.Points(partGeo, partMat));

      //  Resize handler 
      const onResize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      //  Mouse parallax 
      let mx = 0, my = 0;
      const onMouse = (e) => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse);

      //  Animation loop 
      let t = 0;
      const animate = () => {
        if (cancelled) return;
        frameRef.current = requestAnimationFrame(animate);
        t += 0.004;

        // Slow auto-rotation + mouse parallax
        nodeGroup.rotation.y = t * 0.18 + mx * 0.12;
        nodeGroup.rotation.x = Math.sin(t * 0.12) * 0.15 + my * 0.08;

        // Pulse the core rings
        nodeGroup.children.forEach((child, idx) => {
          if (child.geometry?.type === "TorusGeometry") {
            child.rotation.z = t * (0.3 + idx * 0.1);
          }
        });

        renderer.render(scene, camera);
      };
      animate();

      // Cleanup
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouse);
      };
    }).catch(() => {});

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <Box
      ref={mountRef}
      sx={{
        width: "100%", height: "100%",
        position: "relative",
        "& canvas": { display: "block" },
      }}
    />
  );
}

//  Floating chip 
function FloatChip({ label, delay = 0, sx = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Box sx={{
        display: "inline-flex", alignItems: "center", gap: 0.75,
        px: 1.5, py: 0.6, borderRadius: "8px",
        background: "rgba(17,45,78,0.82)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(63,114,175,0.3)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        ...sx,
      }}>
        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: BLUE, boxShadow: `0 0 5px ${BLUE}` }} />
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: SILVER, whiteSpace: "nowrap", letterSpacing: "0.05em" }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

//  Main hero 
export default function SplineHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const [tick, setTick] = useState(0);
  const headlines = [
    "Talk With Your Documents",
    "Semantic Neural Search",
    "Upload. Embed. Retrieve.",
    "Advanced RAG Intelligence",
  ];
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % headlines.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{
      position: "relative", width: "100%",
      minHeight: { xs: "100vh", md: "92vh" },
      overflow: "hidden", display: "flex", alignItems: "center",
      background: isDark
        ? `linear-gradient(160deg, ${NAVY} 0%, #0a1e35 55%, #061428 100%)`
        : `linear-gradient(160deg, #dce8f5 0%, #eef4fb 55%, ${WHITE} 100%)`,
    }}>

      {/* Ambient glows */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <Box sx={{ position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)", width: "80%", height: "70%", background: `radial-gradient(ellipse, rgba(63,114,175,${isDark ? 0.18 : 0.1}) 0%, transparent 70%)` }} />
        <Box sx={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "90%", height: "45%", background: `radial-gradient(ellipse at bottom, rgba(17,45,78,${isDark ? 0.55 : 0.06}) 0%, transparent 70%)` }} />
      </Box>

      {/* Scan line */}
      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, rgba(63,114,175,0.4), transparent)`, pointerEvents: "none", zIndex: 2 }}
      />

      {/* Corner brackets */}
      {[
        { top: 20, left: 20, borderTop: true, borderLeft: true },
        { top: 20, right: 20, borderTop: true, borderRight: true },
        { bottom: 20, left: 20, borderBottom: true, borderLeft: true },
        { bottom: 20, right: 20, borderBottom: true, borderRight: true },
      ].map((c, i) => (
        <Box key={i} sx={{
          position: "absolute", width: 22, height: 22, zIndex: 3,
          top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          borderTop:    c.borderTop    ? `2px solid rgba(63,114,175,0.45)` : "none",
          borderBottom: c.borderBottom ? `2px solid rgba(63,114,175,0.45)` : "none",
          borderLeft:   c.borderLeft   ? `2px solid rgba(63,114,175,0.45)` : "none",
          borderRight:  c.borderRight  ? `2px solid rgba(63,114,175,0.45)` : "none",
        }} />
      ))}

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 4, py: { xs: 8, md: 4 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">

          {/* Left - text */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>

              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Box display="inline-flex" alignItems="center" gap={1} sx={{
                  px: 2, py: 0.6, mb: 3, borderRadius: "100px",
                  background: "rgba(63,114,175,0.1)", border: "1px solid rgba(63,114,175,0.3)",
                }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: BLUE, boxShadow: `0 0 8px ${BLUE}`, animation: "shpulse 2s infinite", "@keyframes shpulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", color: BLUE, textTransform: "uppercase" }}>
                    Document Intelligence System
                  </Typography>
                </Box>
              </motion.div>

              {/* Cycling headline */}
              <Box sx={{ mb: 2.5, minHeight: { xs: "4rem", md: "5.5rem" } }}>
                <AnimatePresence mode="wait">
                  <motion.div key={tick}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Typography variant="h1" sx={{
                      fontSize: { xs: "2.4rem", md: "3.4rem", lg: "4rem" },
                      fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1,
                      color: isDark ? WHITE : NAVY,
                    }}>
                      {headlines[tick].split(" ").map((word, wi) => (
                        <Box key={wi} component="span" sx={wi === 1 || wi === 2 ? {
                          background: `linear-gradient(90deg, ${BLUE}, #5a8fc4)`,
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        } : {}}>
                          {word}{" "}
                        </Box>
                      ))}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Box>

              <Typography sx={{
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                color: isDark ? "rgba(219,226,239,0.7)" : "rgba(17,45,78,0.65)",
                mb: 4, maxWidth: 460, lineHeight: 1.75,
              }}>
                Upload any PDF. Ask questions in plain language. BrainDoc retrieves the exact answer using semantic search and retrieval-augmented generation.
              </Typography>

              {/* Chips */}
              <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
                {["Semantic Search", "RAG Pipeline", "Vector Index", "AI Reasoning"].map((c, i) => (
                  <FloatChip key={c} label={c} delay={0.4 + i * 0.1} />
                ))}
              </Box>

              {/* CTAs */}
              <Box display="flex" gap={2} flexWrap="wrap">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 0 36px rgba(63,114,175,0.5)` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(user ? "/chat" : "/signup")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 30px", borderRadius: 10, border: "none",
                    background: `linear-gradient(135deg, ${BLUE}, ${NAVY})`,
                    color: WHITE, fontWeight: 800, fontSize: "0.92rem",
                    cursor: "pointer", fontFamily: "Inter,sans-serif",
                    boxShadow: `0 0 24px rgba(63,114,175,0.35)`,
                  }}
                >
                  {user ? "Open BrainDoc ->" : "Start for Free ->"}
                </motion.button>
                {!user && (
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/login")}
                    style={{
                      padding: "13px 30px", borderRadius: 10,
                      border: `1px solid rgba(63,114,175,0.35)`,
                      background: "transparent",
                      color: isDark ? SILVER : NAVY,
                      fontWeight: 600, fontSize: "0.92rem",
                      cursor: "pointer", fontFamily: "Inter,sans-serif",
                    }}
                  >
                    Sign in
                  </motion.button>
                )}
              </Box>
            </motion.div>
          </Grid>

          {/* Right - Three.js Neural Brain */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ position: "relative" }}
            >
              {/* Glow behind the brain */}
              <Box sx={{
                position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
                background: `radial-gradient(ellipse at center, rgba(63,114,175,0.2) 0%, transparent 70%)`,
              }} />

              {/* Three.js canvas */}
              <Box sx={{ position: "relative", zIndex: 1, height: { xs: 320, md: 460 }, width: "100%" }}>
                <NeuralBrain isDark={isDark} />
              </Box>

              {/* Floating status badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", top: 20, right: 20, zIndex: 5 }}
              >
                <Box sx={{
                  px: 1.5, py: 0.75, borderRadius: "10px",
                  background: "rgba(17,45,78,0.9)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(63,114,175,0.35)",
                  display: "flex", alignItems: "center", gap: 1,
                }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "shpulse 2s infinite" }} />
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: SILVER, letterSpacing: "0.06em" }}>
                    NEURAL CORE ACTIVE
                  </Typography>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}
      >
        <Box sx={{ width: 1, height: 40, bgcolor: `rgba(63,114,175,0.35)`, mx: "auto" }} />
      </motion.div>
    </Box>
  );
}
