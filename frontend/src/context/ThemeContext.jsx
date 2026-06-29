import React, { createContext, useContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

const ThemeCtx = createContext({ mode: "dark", toggleMode: () => {} });

export function useAppTheme() {
  return useContext(ThemeCtx);
}

// Cinematic matte-black palette
export const P = {
  bg:       "#0a0a0a",
  bgAlt:    "#111111",
  card:     "rgba(255,255,255,0.03)",
  border:   "rgba(255,255,255,0.07)",
  accent:   "#ff6a3d",
  accentDim:"rgba(255,106,61,0.18)",
  accentGlow:"rgba(255,106,61,0.35)",
  text:     "#f5f5f5",
  textSub:  "rgba(255,255,255,0.5)",
  textDim:  "rgba(255,255,255,0.25)",
  // keep legacy aliases so existing code that imports P still works
  white:    "#f5f5f5",
  silver:   "rgba(255,255,255,0.5)",
  blue:     "#ff6a3d",
  navy:     "#0a0a0a",
  blueGlow: "rgba(255,106,61,0.35)",
  blueDim:  "#e55a2b",
  blueBright:"#ff8a65",
  navyDeep: "#050505",
  success:  "#22c55e",
  warning:  "#f59e0b",
  error:    "#ef4444",
};

function buildTheme(mode) {
  // Always dark — the cinematic matte-black theme
  return createTheme({
    palette: {
      mode: "dark",
      primary:   { main: P.accent, light: P.blueBright, dark: P.blueDim },
      secondary: { main: "rgba(255,255,255,0.5)" },
      background: { default: P.bg, paper: P.bgAlt },
      divider: P.border,
      text: { primary: P.text, secondary: P.textSub },
      success: { main: P.success },
      warning: { main: P.warning },
      error:   { main: P.error },
    },
    typography: {
      fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
      h1: { fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 },
      h2: { fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 },
      h3: { fontWeight: 800, letterSpacing: "-0.025em" },
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.65 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": { boxSizing: "border-box", margin: 0, padding: 0 },
          html: { scrollBehavior: "smooth" },
          body: {
            background: P.bg,
            overflowX: "hidden",
            color: P.text,
            fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
          },
          "::selection": { background: "rgba(255,106,61,0.25)", color: "#fff" },
          "::-webkit-scrollbar": { width: "3px" },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            background: "rgba(255,106,61,0.2)",
            borderRadius: "2px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none", fontWeight: 700, borderRadius: 8,
            letterSpacing: "0.01em",
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${P.accent}, ${P.blueDim})`,
            color: "#fff",
            boxShadow: `0 0 22px ${P.accentGlow}`,
            "&:hover": {
              background: `linear-gradient(135deg, ${P.blueBright}, ${P.accent})`,
              boxShadow: `0 0 38px rgba(255,106,61,0.5)`,
              transform: "translateY(-1px)",
            },
          },
          outlinedPrimary: {
            borderColor: "rgba(255,106,61,0.3)", color: P.accent,
            "&:hover": { background: P.accentDim, borderColor: P.accent },
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            background: P.card,
            border: `1px solid ${P.border}`,
            backdropFilter: "blur(24px)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.03)",
              color: P.text,
              "& fieldset": { borderColor: P.border },
              "&:hover fieldset": { borderColor: "rgba(255,106,61,0.3)" },
              "&.Mui-focused fieldset": {
                borderColor: P.accent,
                boxShadow: `0 0 0 3px rgba(255,106,61,0.08)`,
              },
            },
            "& .MuiInputLabel-root": { color: P.textSub },
            "& .MuiInputLabel-root.Mui-focused": { color: P.accent },
            "& .MuiInputBase-input": { color: P.text },
            "& .MuiFormHelperText-root": { color: P.textDim },
          },
        },
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: P.border } },
      },
      MuiAlert: { styleOverrides: { root: { borderRadius: 10 } } },
      MuiCircularProgress: {
        styleOverrides: { root: { color: P.accent } },
      },
    },
  });
}

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  const muiTheme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeCtx.Provider value={{ mode: "dark", toggleMode }}>
      {children(muiTheme, "dark")}
    </ThemeCtx.Provider>
  );
}
