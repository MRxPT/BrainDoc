import React, { createContext, useContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

const ThemeCtx = createContext({ mode: "dark", toggleMode: () => {} });

export function useAppTheme() {
  return useContext(ThemeCtx);
}

//  Palette 
// #F9F7F7  off-white      -> light bg, light text on dark
// #DBE2EF  soft blue-grey -> secondary surfaces, borders, muted text
// #3F72AF  medium blue    -> primary accent, CTAs, highlights
// #112D4E  deep navy      -> dark bg, headings, strong text

export const P = {
  white:  "#F9F7F7",
  silver: "#DBE2EF",
  blue:   "#3F72AF",
  navy:   "#112D4E",
  // Derived
  blueGlow:   "rgba(63,114,175,0.4)",
  blueDim:    "#2d5a8e",
  blueBright: "#5a8fc4",
  navyDeep:   "#0a1e35",
  success:    "#22c55e",
  warning:    "#f59e0b",
  error:      "#ef4444",
};

function buildTheme(mode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary:   { main: P.blue,   light: P.blueBright, dark: P.blueDim },
      secondary: { main: P.silver, light: P.white,      dark: P.navy   },
      background: {
        default: isDark ? P.navy    : P.white,
        paper:   isDark ? "rgba(17,45,78,0.88)" : "rgba(249,247,247,0.92)",
      },
      divider: isDark ? "rgba(63,114,175,0.18)" : "rgba(63,114,175,0.2)",
      text: {
        primary:   isDark ? P.white  : P.navy,
        secondary: isDark ? P.silver : "#4a6080",
      },
      success: { main: P.success },
      warning: { main: P.warning },
      error:   { main: P.error   },
    },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      h1: { fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 },
      h2: { fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1  },
      h3: { fontWeight: 800, letterSpacing: "-0.025em" },
      h4: { fontWeight: 700, letterSpacing: "-0.02em"  },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      body1: { lineHeight: 1.7  },
      body2: { lineHeight: 1.65 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": { boxSizing: "border-box", margin: 0, padding: 0 },
          html: { scrollBehavior: "smooth" },
          body: {
            background: isDark ? P.navy : P.white,
            overflowX: "hidden",
            color: isDark ? P.white : P.navy,
            transition: "background 0.4s ease, color 0.4s ease",
          },
          "::selection": { background: "rgba(63,114,175,0.3)", color: "#fff" },
          "::-webkit-scrollbar": { width: "4px" },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            background: isDark ? "rgba(63,114,175,0.3)" : "rgba(63,114,175,0.35)",
            borderRadius: "2px",
          },
          "::-webkit-scrollbar-thumb:hover": { background: "rgba(90,143,196,0.55)" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none", fontWeight: 700, borderRadius: 8,
            letterSpacing: "0.01em",
            transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${P.blue} 0%, ${P.blueDim} 100%)`,
            color: P.white,
            boxShadow: `0 0 22px ${P.blueGlow}, 0 4px 14px rgba(0,0,0,0.25)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${P.blueBright} 0%, ${P.blue} 100%)`,
              boxShadow: `0 0 38px rgba(63,114,175,0.55), 0 6px 20px rgba(0,0,0,0.3)`,
              transform: "translateY(-2px)",
            },
          },
          outlinedPrimary: {
            borderColor: "rgba(63,114,175,0.4)", color: P.blue,
            "&:hover": { background: "rgba(63,114,175,0.08)", borderColor: P.blue },
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            background: isDark ? "rgba(17,45,78,0.85)" : "rgba(249,247,247,0.92)",
            border: isDark
              ? "1px solid rgba(63,114,175,0.18)"
              : "1px solid rgba(63,114,175,0.22)",
            backdropFilter: "blur(24px)",
            boxShadow: isDark ? "none" : "0 4px 24px rgba(63,114,175,0.1)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              background: isDark ? "rgba(63,114,175,0.06)" : "rgba(63,114,175,0.04)",
              "& fieldset": {
                borderColor: isDark ? "rgba(63,114,175,0.2)" : "rgba(63,114,175,0.25)",
              },
              "&:hover fieldset": { borderColor: "rgba(90,143,196,0.5)" },
              "&.Mui-focused fieldset": {
                borderColor: P.blue,
                boxShadow: "0 0 0 3px rgba(63,114,175,0.15)",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: P.blue },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? "rgba(63,114,175,0.18)" : "rgba(63,114,175,0.2)",
          },
        },
      },
      MuiAlert: { styleOverrides: { root: { borderRadius: 10 } } },
    },
  });
}

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));
  const muiTheme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeCtx.Provider value={{ mode, toggleMode }}>
      {children(muiTheme, mode)}
    </ThemeCtx.Provider>
  );
}
