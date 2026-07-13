import React, { createContext, useContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

const ThemeCtx = createContext({ mode: "dark", toggleMode: () => {} });
export function useAppTheme() { return useContext(ThemeCtx); }

// ── Palette tokens ─────────────────────────────────────────────────────────
export const P = {
  // Light (landing page) tokens
  bg:          "#ffffff",
  bgSoft:      "#f8fafc",
  text:        "#0f172a",
  textSub:     "#64748b",
  textDim:     "#94a3b8",
  border:      "#e2e8f0",
  primary:     "#2563eb",
  purple:      "#7c3aed",
  success:     "#10b981",
  // Dark (app pages) tokens
  darkBg:      "#0a0a0a",
  darkCard:    "rgba(22,22,22,0.7)",
  darkBorder:  "rgba(255,255,255,0.08)",
  darkText:    "#f5f5f5",
  darkSub:     "rgba(255,255,255,0.5)",
  darkDim:     "rgba(255,255,255,0.25)",
  accent:      "#ff6a3d",
  accentGlow:  "rgba(255,106,61,0.35)",
  // Legacy aliases (used by auth/chat/dashboard pages)
  white:       "#f5f5f5",
  silver:      "rgba(255,255,255,0.5)",
  blue:        "#2563eb",
  navy:        "#0a0a0a",
  blueGlow:    "rgba(37,99,235,0.35)",
  blueDim:     "#1d4ed8",
  blueBright:  "#3b82f6",
  navyDeep:    "#050505",
  error:       "#ef4444",
  warning:     "#f59e0b",
};

function buildDarkTheme() {
  return createTheme({
    palette: {
      mode: "dark",
      primary:    { main: P.accent, light: "#ff8a65", dark: "#e55a2b" },
      background: { default: P.darkBg, paper: "#111111" },
      divider:    P.darkBorder,
      text:       { primary: P.darkText, secondary: P.darkSub },
      success:    { main: P.success },
      warning:    { main: P.warning },
      error:      { main: P.error },
    },
    typography: {
      fontFamily: '"Inter", "DM Sans", system-ui, sans-serif',
      h1: { fontWeight: 900, letterSpacing: "-0.04em" },
      h2: { fontWeight: 800, letterSpacing: "-0.03em" },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // Don't force any background — each page/route controls it
            overflowX: "hidden",
          },
          "::selection": { background: "rgba(255,106,61,0.25)", color: "#fff" },
          "::-webkit-scrollbar": { width: "3px" },
          "::-webkit-scrollbar-thumb": { background: "rgba(255,106,61,0.2)", borderRadius: "2px" },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.03)",
              color: P.darkText,
              "& fieldset": { borderColor: P.darkBorder },
              "&:hover fieldset": { borderColor: "rgba(255,106,61,0.3)" },
              "&.Mui-focused fieldset": { borderColor: P.accent, boxShadow: "0 0 0 3px rgba(255,106,61,0.08)" },
            },
            "& .MuiInputLabel-root": { color: P.darkSub },
            "& .MuiInputLabel-root.Mui-focused": { color: P.accent },
            "& .MuiInputBase-input": { color: P.darkText },
            "& .MuiFormHelperText-root": { color: P.darkDim },
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiAlert: { styleOverrides: { root: { borderRadius: 10 } } },
      MuiCircularProgress: { styleOverrides: { root: { color: P.accent } } },
    },
  });
}

export function AppThemeProvider({ children }) {
  const [mode] = useState("dark");
  const muiTheme = useMemo(() => buildDarkTheme(), []);

  return (
    <ThemeCtx.Provider value={{ mode, toggleMode: () => {} }}>
      {children(muiTheme, mode)}
    </ThemeCtx.Provider>
  );
}
