import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { AppThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import NeuralBackground from "./components/NeuralBackground";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";

function AppRoutes() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const isChatPage = location.pathname === "/chat";

  return (
    <>
      <NeuralBackground />
      {!isAuthPage && <Navbar />}
      <Box sx={{
        position: "relative", zIndex: 1,
        // Home + auth: no top padding (they manage their own layout)
        // Chat: no padding, use full remaining viewport height
        // Other app pages: standard navbar offset
        pt: (isHomePage || isAuthPage || isChatPage) ? 0 : "64px",
        // Chat page needs to fill exactly the remaining viewport
        height: isChatPage ? "100vh" : "auto",
        overflow: isChatPage ? "hidden" : "visible",
      }}>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/signup"    element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/chat"      element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/settings"  element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}

export default function App() {
  return (
    <AppThemeProvider>
      {(muiTheme) => (
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      )}
    </AppThemeProvider>
  );
}
