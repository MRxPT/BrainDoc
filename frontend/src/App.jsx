import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  return (
    <AppThemeProvider>
      {(muiTheme) => (
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <NeuralBackground />
          <Navbar />
          <Box sx={{ position: "relative", zIndex: 1, pt: "56px" }}>
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
        </ThemeProvider>
      )}
    </AppThemeProvider>
  );
}
