import React, { useEffect, useRef } from "react";

// Palette: #F9F7F7 / #DBE2EF / #3F72AF / #112D4E
export default function NeuralBackground({ mode = "dark" }) {
  const canvasRef = useRef(null);
  const modeRef   = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.0 + 0.2,
      a: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0003 + 0.0001,
    }));

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      r: Math.random() * 1.3 + 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const dark = modeRef.current === "dark";
      ctx.clearRect(0, 0, W, H);
      t += 0.003;

      //  Base background 
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.55, W * 0.9);
      if (dark) {
        // Deep navy gradient
        bg.addColorStop(0, "rgba(17,45,78,1)");
        bg.addColorStop(0.6, "rgba(12,30,55,1)");
        bg.addColorStop(1, "rgba(8,20,38,1)");
      } else {
        // Off-white / silver gradient
        bg.addColorStop(0, "rgba(249,247,247,1)");
        bg.addColorStop(0.6, "rgba(240,244,252,1)");
        bg.addColorStop(1, "rgba(219,226,239,1)");
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      //  Aurora 1 - top-left blue bloom 
      const a1 = ctx.createRadialGradient(W * 0.1, H * 0.02, 0, W * 0.18, H * 0.2, W * 0.5);
      a1.addColorStop(0, `rgba(63,114,175,${dark ? 0.1 + Math.sin(t * 0.5) * 0.03 : 0.14 + Math.sin(t * 0.5) * 0.04})`);
      a1.addColorStop(0.5, `rgba(45,90,142,${dark ? 0.04 : 0.06})`);
      a1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = a1;
      ctx.fillRect(0, 0, W, H);

      //  Aurora 2 - top-right silver-blue 
      const a2 = ctx.createRadialGradient(W * 0.88, H * -0.04, 0, W * 0.84, H * 0.18, W * 0.42);
      a2.addColorStop(0, `rgba(90,143,196,${dark ? 0.07 + Math.sin(t * 0.35 + 1) * 0.02 : 0.1 + Math.sin(t * 0.35 + 1) * 0.025})`);
      a2.addColorStop(0.5, `rgba(63,114,175,${dark ? 0.03 : 0.05})`);
      a2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = a2;
      ctx.fillRect(0, 0, W, H);

      //  Aurora 3 - bottom center deep navy glow 
      const a3 = ctx.createRadialGradient(W * 0.5, H * 1.05, 0, W * 0.5, H * 0.9, W * 0.4);
      a3.addColorStop(0, `rgba(17,45,78,${dark ? 0.0 : 0.08 + Math.sin(t * 0.22 + 2) * 0.02})`);
      a3.addColorStop(0.5, `rgba(63,114,175,${dark ? 0.04 + Math.sin(t * 0.22 + 2) * 0.012 : 0.03})`);
      a3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = a3;
      ctx.fillRect(0, 0, W, H);

      //  Stars 
      stars.forEach((s) => {
        s.phase += s.speed * 60;
        const alpha = s.a * (0.7 + 0.3 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(219,226,239,${alpha * 0.7})`
          : `rgba(63,114,175,${alpha * 0.35})`;
        ctx.fill();
      });

      //  Grid 
      ctx.strokeStyle = dark
        ? "rgba(63,114,175,0.025)"
        : "rgba(63,114,175,0.07)";
      ctx.lineWidth = 0.5;
      const gs = 90;
      for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      //  Move nodes 
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy; n.phase += 0.012;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      //  Connections 
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180) {
            ctx.strokeStyle = `rgba(63,114,175,${(1 - d / 180) * (dark ? 0.07 : 0.1)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        });
      });

      //  Node dots 
      nodes.forEach((n) => {
        const g = (Math.sin(n.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + g * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(90,143,196,${0.22 + g * 0.2})`
          : `rgba(63,114,175,${0.18 + g * 0.15})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}
