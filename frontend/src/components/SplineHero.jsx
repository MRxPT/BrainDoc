import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ACCENT = "#ff6a3d";
const ACCENT_GLOW = "rgba(255,106,61,0.35)";

// Floating stat chip
function StatChip({ label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box sx={{
        px: 2, py: 1.2, borderRadius: "12px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        display: "flex", flexDirection: "column", alignItems: "center",
        minWidth: 90,
      }}>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: ACCENT, lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", mt: 0.3, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</Typography>
      </Box>
    </motion.div>
  );
}

// Three.js neural brain — orange palette
function NeuralBrain() {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let cancelled = false;
    let renderer, scene, camera;

    import("three").then((THREE) => {
      if (cancelled) return;
      const W = el.clientWidth || 520, H = el.clientHeight || 520;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
      camera.position.set(0, 0, 5);

      const group = new THREE.Group();
      const nodeCount = 110;
      const positions = [];

      // Nodes
      for (let i = 0; i < nodeCount; i++) {
        const phi   = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        const r     = 1.8 + (Math.random() - 0.5) * 0.7;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        positions.push(new THREE.Vector3(x, y, z));

        const geo = new THREE.SphereGeometry(0.022, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0xff6a3d });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        group.add(mesh);

        // Glow
        const glowGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xff8a65, transparent: true, opacity: 0.3 });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(x, y, z);
        group.add(glow);
      }

      // Connections
      const lineMat = new THREE.LineBasicMaterial({ color: 0xff6a3d, transparent: true, opacity: 0.12 });
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (positions[i].distanceTo(positions[j]) < 0.9) {
            const geo = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
            group.add(new THREE.Line(geo, lineMat.clone()));
          }
        }
      }

      // Core
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x0d0d0d, transparent: true, opacity: 0.9 });
      group.add(new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), coreMat));

      // Rings
      for (let i = 0; i < 3; i++) {
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xff6a3d, transparent: true, opacity: 0.22 - i * 0.05 });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.2, 0.007, 8, 64), ringMat);
        ring.rotation.x = Math.PI / 2 + i * 0.5;
        ring.rotation.y = i * 0.7;
        group.add(ring);
      }

      // Outer wireframe
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xff6a3d, wireframe: true, transparent: true, opacity: 0.04 });
      group.add(new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16), wireMat));

      scene.add(group);

      // Particles
      const pCount = 160;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 9;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 9;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: 0xff6a3d, size: 0.014, transparent: true, opacity: 0.25 });
      scene.add(new THREE.Points(pGeo, pMat));

      const onResize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      let mx = 0, my = 0;
      const onMouse = (e) => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse);

      let t = 0;
      const animate = () => {
        if (cancelled) return;
        frameRef.current = requestAnimationFrame(animate);
        t += 0.004;
        group.rotation.y = t * 0.15 + mx * 0.1;
        group.rotation.x = Math.sin(t * 0.1) * 0.12 + my * 0.07;
        group.children.forEach((c, i) => {
          if (c.geometry?.type === "TorusGeometry") c.rotation.z = t * (0.25 + i * 0.08);
        });
        renderer.render(scene, camera);
      };
      animate();

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
        if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <Box ref={mountRef} sx={{ width: "100%", height: "100%", "& canvas": { display: "block" } }} />;
}

const HEADLINES = [
  ["Document", "Intelligence", "Redefined"],
  ["Upload.", "Embed.", "Retrieve."],
  ["Semantic", "Neural", "Search"],
  ["Talk With", "Your", "Documents"],
];

export default function SplineHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % HEADLINES.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{
      position: "relative", width: "100%",
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex", alignItems: "center",
      background: "#0a0a0a",
    }}>
      {/* Radial glow top-center */}
      <Box sx={{
        position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "70%", height: "60%",
        background: "radial-gradient(ellipse, rgba(255,106,61,0.08) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Bottom vignette */}
      <Box sx={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Corner brackets */}
      {[
        { top: 24, left: 24, bt: true, bl: true },
        { top: 24, right: 24, bt: true, br: true },
        { bottom: 24, left: 24, bb: true, bl: true },
        { bottom: 24, right: 24, bb: true, br: true },
      ].map((c, i) => (
        <Box key={i} sx={{
          position: "absolute", width: 20, height: 20, zIndex: 3,
          top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          borderTop:    c.bt ? `1px solid rgba(255,106,61,0.3)` : "none",
          borderBottom: c.bb ? `1px solid rgba(255,106,61,0.3)` : "none",
          borderLeft:   c.bl ? `1px solid rgba(255,106,61,0.3)` : "none",
          borderRight:  c.br ? `1px solid rgba(255,106,61,0.3)` : "none",
        }} />
      ))}

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 4, py: { xs: 10, md: 6 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 6, md: 8 }, alignItems: "center" }}>

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Box sx={{
                display: "inline-flex", alignItems: "center", gap: 1,
                px: 2, py: 0.6, mb: 3.5, borderRadius: "100px",
                background: "rgba(255,106,61,0.08)",
                border: "1px solid rgba(255,106,61,0.22)",
              }}>
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                </motion.div>
                <Typography sx={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.14em", color: ACCENT, textTransform: "uppercase" }}>
                  AI PDF Intelligence Platform
                </Typography>
              </Box>
            </motion.div>

            {/* Cycling headline */}
            <Box sx={{ mb: 3, minHeight: { xs: "5.5rem", md: "7rem" } }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tick}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Typography sx={{
                    fontSize: { xs: "2.6rem", md: "3.5rem", lg: "4.2rem" },
                    fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05,
                    color: "#f5f5f5",
                  }}>
                    {HEADLINES[tick].map((word, wi) => (
                      <Box
                        key={wi}
                        component="span"
                        sx={wi === 1 ? {
                          color: ACCENT,
                          textShadow: `0 0 40px rgba(255,106,61,0.4)`,
                        } : {}}
                      >
                        {word}{wi < 2 ? " " : ""}
                      </Box>
                    ))}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            <Typography sx={{
              fontSize: "1rem", lineHeight: 1.7,
              color: "rgba(255,255,255,0.45)",
              mb: 4, maxWidth: 460,
            }}>
              Upload any PDF. Ask questions in plain language. BrainDoc retrieves exact answers using semantic embeddings and retrieval-augmented generation.
            </Typography>

            {/* Stats row */}
            <Box display="flex" gap={1.5} flexWrap="wrap" mb={4}>
              <StatChip value="384-dim" label="Vectors" delay={0.5} />
              <StatChip value="<100ms"  label="Retrieval" delay={0.6} />
              <StatChip value="RAG"     label="Pipeline" delay={0.7} />
              <StatChip value="Zero"    label="Hallucination" delay={0.8} />
            </Box>

            {/* CTAs */}
            <Box display="flex" gap={2} flexWrap="wrap">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255,106,61,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(user ? "/chat" : "/signup")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 28px", borderRadius: 9, border: "none",
                  background: ACCENT, color: "#fff",
                  fontWeight: 800, fontSize: "0.9rem",
                  cursor: "pointer", fontFamily: "Inter, sans-serif",
                  boxShadow: "0 0 24px rgba(255,106,61,0.3)",
                  transition: "box-shadow 0.2s",
                }}
              >
                {user ? "Open Workspace →" : "Start Analyzing →"}
              </motion.button>
              {!user && (
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "13px 28px", borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 500, fontSize: "0.9rem",
                    cursor: "pointer", fontFamily: "Inter, sans-serif",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#f5f5f5"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                >
                  View Workspace
                </motion.button>
              )}
            </Box>
          </motion.div>

          {/* Right — Three.js brain */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ position: "relative" }}
          >
            {/* Glow behind */}
            <Box sx={{
              position: "absolute", inset: "-20%", zIndex: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at center, rgba(255,106,61,0.12) 0%, transparent 65%)",
            }} />

            <Box sx={{ position: "relative", zIndex: 1, height: { xs: 320, md: 500 }, width: "100%" }}>
              <NeuralBrain />
            </Box>

            {/* Floating status chip */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", top: 24, right: 24, zIndex: 5 }}
            >
              <Box sx={{
                px: 1.5, py: 0.8, borderRadius: "9px",
                background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,106,61,0.2)",
                display: "flex", alignItems: "center", gap: 1,
              }}>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                </motion.div>
                <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
                  NEURAL CORE ACTIVE
                </Typography>
              </Box>
            </motion.div>

            {/* Floating processing chip */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ position: "absolute", bottom: 40, left: 20, zIndex: 5 }}
            >
              <Box sx={{
                px: 1.5, py: 0.8, borderRadius: "9px",
                background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", gap: 1,
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
                  VECTOR EMBEDDINGS READY
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        </Box>
      </Container>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}
      >
        <Box sx={{ width: 1, height: 36, bgcolor: "rgba(255,106,61,0.25)", mx: "auto" }} />
      </motion.div>
    </Box>
  );
}
