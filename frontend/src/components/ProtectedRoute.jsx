import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: "#0a0a0a" }}>
        <CircularProgress sx={{ color: "#ff6a3d" }} size={28} />
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
