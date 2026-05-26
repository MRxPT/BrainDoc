import { useState, useCallback, useRef, useEffect } from "react";

//  Icons 
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="1"     x2="12" y2="3"     />
      <line x1="12" y1="21"    x2="12" y2="23"    />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"     y1="12"    x2="3"     y2="12"    />
      <line x1="21"    y1="12"    x2="23"    y2="12"    />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

//  Design tokens 
const TOKENS = {
  light: {
    btnBg:   "#f3ede1",
    btnText: "#1a1a1a",
    btnRing: "rgba(255,255,255,0.15)",
  },
  dark: {
    btnBg:   "#0e0e0e",
    btnText: "#dfd8c6",
    btnRing: "rgba(0,0,0,0.25)",
  },
};

const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

//  CurtainThemeToggle 
// Icon-only variant - renders a floating button with a full-page curtain wipe.
// Props:
//   defaultTheme  "light" | "dark"   (default: "dark" - matches this app)
//   buttonSize    number px           (default: 34)
//   duration      number ms           (default: 550)
//   onThemeChange (theme) => void
export function CurtainThemeToggle({
  defaultTheme = "dark",
  buttonSize   = 34,
  duration     = 550,
  onThemeChange,
}) {
  const [theme, setTheme]     = useState(defaultTheme);
  const [phase, setPhase]     = useState("idle");   // "idle" | "falling" | "rising"
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const curtainColorRef       = useRef("");

  // Curtain colors - wipe to the NEXT theme's background
  const CURTAIN_COLORS = { light: "#f3ede1", dark: "#020408" };

  const toggle = useCallback(() => {
    if (phase !== "idle") return;
    const next = theme === "light" ? "dark" : "light";
    curtainColorRef.current = CURTAIN_COLORS[next];
    setPhase("falling");
    setTimeout(() => {
      setTheme(next);
      onThemeChange?.(next);
      setPhase("rising");
      setTimeout(() => setPhase("idle"), duration + 60);
    }, duration);
  }, [phase, theme, duration, onThemeChange]);

  const t = TOKENS[theme];
  const btnScale = pressed ? 0.93 : hovered ? 1.12 : 1;

  const btnStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: t.btnBg,
    color: t.btnText,
    boxShadow: `0 0 0 1.5px ${t.btnRing}`,
    zIndex: 9999,
    outline: "none",
    transform: `scale(${btnScale})`,
    transition: "background 0.3s ease, color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease",
    flexShrink: 0,
  };

  const curtainStyle = {
    position: "fixed",
    inset: 0,
    background: curtainColorRef.current,
    transformOrigin: "top",
    transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
    transition: phase !== "idle" ? `transform ${duration}ms ${EASING}` : "none",
    zIndex: 9997,
    pointerEvents: "none",
  };

  return (
    <>
      <div aria-hidden="true" style={curtainStyle} />
      <button
        style={btnStyle}
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        aria-pressed={theme === "dark"}
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>
    </>
  );
}
