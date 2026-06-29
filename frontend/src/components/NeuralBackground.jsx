import React, { useEffect, useRef } from "react";

export default function NeuralBackground() {
  const canvasRef = useRef(null);

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

    const nodes = Array.from({ length: 22 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      r: Math.random() * 1.2 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.002;

      // Base — pure matte black
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Subtle orange radial glow — top center
      const g1 = ctx.createRadialGradient(W * 0.5, H * -0.1, 0, W * 0.5, H * 0.3, W * 0.6);
      g1.addColorStop(0, `rgba(255,106,61,${0.04 + Math.sin(t * 0.4) * 0.01})`);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      // Bottom right ambient
      const g2 = ctx.createRadialGradient(W * 0.85, H * 1.1, 0, W * 0.8, H * 0.8, W * 0.4);
      g2.addColorStop(0, `rgba(255,106,61,${0.025 + Math.sin(t * 0.3 + 1) * 0.008})`);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      // Ultra-subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.015)";
      ctx.lineWidth = 0.5;
      const gs = 100;
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy; n.phase += 0.01;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Connections
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200) {
            ctx.strokeStyle = `rgba(255,106,61,${(1 - d / 200) * 0.045})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        });
      });

      // Node dots
      nodes.forEach((n) => {
        const pulse = (Math.sin(n.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + pulse * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,106,61,${0.12 + pulse * 0.1})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}
