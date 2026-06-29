import React, { useState } from "react";
import { Box, Typography, TextField, Alert, Grid } from "@mui/material";
import { motion } from "framer-motion";
import {
  PersonOutlined, EmailOutlined, CalendarTodayOutlined,
  EditOutlined, SaveOutlined, CancelOutlined,
  ChatOutlined, UploadFileOutlined, SettingsOutlined, InsertDriveFileOutlined, SearchOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateMe } from "../api/auth";
import { GlassCard, MetricCard, SidebarNav, NeonBadge, AvatarCircle } from "../components/ui/design-system";

const A = "#ff6a3d";

const NAV_ITEMS = [
  { id: "/dashboard", label: "Profile",  icon: <PersonOutlined sx={{ fontSize: 17 }} /> },
  { id: "/chat",      label: "Chat",     icon: <ChatOutlined sx={{ fontSize: 17 }} /> },
  { id: "/settings",  label: "Settings", icon: <SettingsOutlined sx={{ fontSize: 17 }} /> },
];

const METRICS = [
  { icon: <InsertDriveFileOutlined sx={{ fontSize: 18 }} />, label: "Total Documents", value: "—",  trend: null },
  { icon: <ChatOutlined sx={{ fontSize: 18 }} />,            label: "Queries Today",   value: "—",  trend: null },
  { icon: <SearchOutlined sx={{ fontSize: 18 }} />,          label: "Embeddings",      value: "RAG", trend: null },
  { icon: <UploadFileOutlined sx={{ fontSize: 18 }} />,      label: "Avg Response",    value: "<1s", trend: null, trendUp: true },
];

function InfoRow({ icon, label, value }) {
  return (
    <Box display="flex" alignItems="center" gap={1.5} py={1.4}
      sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <Box sx={{ color: "rgba(255,106,61,0.35)", display: "flex", flexShrink: 0 }}>{icon}</Box>
      <Box minWidth={0}>
        <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.7)", fontFamily: label === "Email" ? "'JetBrains Mono', monospace" : "inherit" }} noWrap>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function DashboardPage() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: user?.username || "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      const { data } = await updateMe({ username: form.username });
      loginUser(localStorage.getItem("token"), data);
      setSuccess("Profile updated!"); setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <Box sx={{
      display: "flex", minHeight: "calc(100vh - 56px)",
      position: "relative", zIndex: 1, background: "#0a0a0a",
    }}>
      {/* ── Left Sidebar ── */}
      <Box sx={{
        width: 240, flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(14,14,14,0.8)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 56, height: "calc(100vh - 56px)",
      }}>
        {/* Sidebar header */}
        <Box sx={{ px: 3, pt: 4, pb: 3, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", mb: 2 }}>
            Workspace
          </Typography>
          <Box display="flex" alignItems="center" gap={1.5}>
            <AvatarCircle name={user?.username || "U"} size={34} showStatus />
            <Box minWidth={0}>
              <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#f5f5f5" }} noWrap>
                {user?.username || "User"}
              </Typography>
              <NeonBadge color="green" size="xs">Active</NeonBadge>
            </Box>
          </Box>
        </Box>

        {/* Nav */}
        <Box sx={{ px: 2, pt: 2.5, flex: 1 }}>
          <SidebarNav
            items={NAV_ITEMS}
            active={location.pathname}
            onSelect={(id) => navigate(id)}
          />
        </Box>

        {/* Bottom */}
        <Box sx={{ px: 3, py: 3, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <NeonBadge color="orange">Free Plan</NeonBadge>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box sx={{ flex: 1, overflow: "auto", p: { xs: 3, md: 5 } }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>

          {/* Page header */}
          <Box mb={6}>
            <Typography sx={{
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em",
              color: "rgba(255,106,61,0.5)", textTransform: "uppercase", mb: 0.75,
            }}>
              Profile Overview
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{
              color: "#f5f5f5", letterSpacing: "-0.03em",
              fontFamily: "'DM Sans', Inter, sans-serif",
            }}>
              Good to see you, <Box component="span" sx={{ color: A }}>{user?.username || "there"}</Box>
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.875rem", mt: 0.75 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </Typography>
          </Box>

          {/* Metric cards */}
          <Grid container spacing={2} mb={5}>
            {METRICS.map((m, i) => (
              <Grid item xs={12} sm={6} xl={3} key={i}>
                <MetricCard {...m} delay={i * 0.06} />
              </Grid>
            ))}
          </Grid>

          {/* Profile cards */}
          <Grid container spacing={3}>
            {/* Identity card */}
            <Grid item xs={12} md={4}>
              <GlassCard hover={false} sx={{ height: "100%" }}>
                <Box p={3.5}>
                  <Box textAlign="center" mb={3.5}>
                    <motion.div whileHover={{ scale: 1.04 }} style={{ display: "inline-block", marginBottom: 12 }}>
                      <AvatarCircle name={user?.username || "U"} size={72} showStatus />
                    </motion.div>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#f5f5f5", fontSize: "1rem", mt: 1.5 }}>
                      {user?.username}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", mt: 0.4, fontFamily: "'JetBrains Mono', monospace" }}>
                      {user?.email}
                    </Typography>
                  </Box>
                  <InfoRow icon={<PersonOutlined sx={{ fontSize: 14 }} />} label="Username" value={user?.username} />
                  <InfoRow icon={<EmailOutlined sx={{ fontSize: 14 }} />}   label="Email"    value={user?.email} />
                  <InfoRow icon={<CalendarTodayOutlined sx={{ fontSize: 14 }} />} label="Joined" value={fmt(user?.created_at)} />
                </Box>
              </GlassCard>
            </Grid>

            {/* Edit panel */}
            <Grid item xs={12} md={8}>
              <GlassCard hover={false} sx={{ mb: 2.5 }}>
                <Box p={3.5}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: "#f5f5f5", fontSize: "0.95rem" }}>Edit Profile</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", mt: 0.25 }}>Update your display name</Typography>
                    </Box>
                    {!editing && (
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setEditing(true)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "7px 15px", borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.03)",
                          color: "rgba(255,255,255,0.45)",
                          fontWeight: 600, fontSize: "0.8rem",
                          cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,106,61,0.3)"; e.currentTarget.style.color = A; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                      >
                        <EditOutlined style={{ fontSize: 13 }} /> Edit
                      </motion.button>
                    )}
                  </Box>

                  {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}
                  {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }} onClose={() => setError("")}>{error}</Alert>}

                  <TextField
                    label="Username" value={editing ? form.username : user?.username || ""}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    fullWidth disabled={!editing} margin="normal"
                  />
                  <TextField
                    label="Email" value={user?.email || ""} fullWidth disabled margin="normal"
                    helperText="Email cannot be changed after signup"
                  />

                  {editing && (
                    <Box display="flex" gap={1.5} mt={2.5}>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleSave} disabled={loading}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "9px 22px", borderRadius: 9, border: "none",
                          background: A, color: "#fff",
                          fontWeight: 700, fontSize: "0.85rem",
                          cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
                          boxShadow: "0 0 18px rgba(255,106,61,0.25)",
                        }}>
                        <SaveOutlined style={{ fontSize: 14 }} />
                        {loading ? "Saving..." : "Save changes"}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setEditing(false); setForm({ username: user?.username }); setError(""); }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "9px 22px", borderRadius: 9,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "transparent",
                          color: "rgba(255,255,255,0.35)",
                          fontWeight: 500, fontSize: "0.85rem",
                          cursor: "pointer", fontFamily: "'DM Sans', Inter, sans-serif",
                        }}>
                        <CancelOutlined style={{ fontSize: 14 }} /> Cancel
                      </motion.button>
                    </Box>
                  )}
                </Box>
              </GlassCard>

              {/* Account info */}
              <GlassCard hover={false}>
                <Box p={3.5}>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", mb: 2.5 }}>
                    Account Details
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: "Auth Method", value: "JWT" },
                      { label: "Account Status", value: "Active" },
                    ].map((s) => (
                      <Grid item xs={6} key={s.label}>
                        <Box sx={{
                          p: 2.5, borderRadius: "12px", textAlign: "center",
                          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                        }}>
                          <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, color: A, letterSpacing: "-0.03em", fontFamily: "'JetBrains Mono', monospace" }}>
                            {s.value}
                          </Typography>
                          <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)", mt: 0.5 }}>
                            {s.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </GlassCard>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
}
