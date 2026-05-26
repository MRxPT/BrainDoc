import React, { useState } from "react";
import { Box, TextField, Typography, Alert, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { PersonOutlined, EmailOutlined, CalendarTodayOutlined, EditOutlined, SaveOutlined, CancelOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
import { updateMe } from "../api/auth";

function InfoRow({ icon, label, value, isDark }) {
  return (
    <Box display="flex" alignItems="center" gap={1.5} py={1.25} sx={{ borderBottom: "1px solid rgba(63,114,175,0.07)" }}>
      <Box sx={{ color: "rgba(63,114,175,0.35)", display: "flex" }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", color: isDark ? "rgba(90,120,160,0.4)" : "rgba(17,45,78,0.4)", textTransform: "uppercase" }}>{label}</Typography>
        <Typography sx={{ fontSize: "0.85rem", color: isDark ? "rgba(240,246,255,0.8)" : "rgba(17,45,78,0.85)" }}>{value}</Typography>
      </Box>
    </Box>
  );
}

export default function DashboardPage() {
  const { user, loginUser } = useAuth();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";
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
    } catch (err) { setError(err.response?.data?.detail || "Update failed."); }
    finally { setLoading(false); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const cardBg = isDark ? "rgba(17,45,78,0.82)" : "rgba(249,247,247,0.95)";
  const cardBorder = isDark ? "rgba(63,114,175,0.12)" : "rgba(63,114,175,0.18)";
  const shimmerBg = isDark ? "rgba(63,114,175,0.35)" : "rgba(63,114,175,0.25)";

  return (
    <Box sx={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 56px)", py: 6, px: 2 }}>
      <Box sx={{ maxWidth: 860, mx: "auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <Typography variant="h4" fontWeight={800} mb={0.5}
            sx={{ color: isDark ? "#F9F7F7" : "#112D4E", transition: "color 0.4s" }}
          >Profile</Typography>
          <Typography sx={{ color: isDark ? "rgba(219,226,239,0.5)" : "rgba(17,45,78,0.5)", mb: 5, fontSize: "0.88rem", transition: "color 0.4s" }}>Manage your account</Typography>

          <Grid container spacing={3}>
            {/* Profile card */}
            <Grid item xs={12} md={4}>
              <Box sx={{ background: cardBg, backdropFilter: "blur(32px)", border: `1px solid ${cardBorder}`, borderRadius: "20px", p: 3, position: "relative", overflow: "hidden", transition: "background 0.4s, border-color 0.4s", boxShadow: isDark ? "none" : "0 4px 24px rgba(63,114,175,0.08)" }}>
                <Box sx={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg,transparent,${shimmerBg},transparent)` }} />

                <Box textAlign="center" mb={3}>
                  <motion.div whileHover={{ scale: 1.05 }} style={{ display: "inline-block" }}>
                    <Box sx={{
                      width: 72, height: 72, borderRadius: "18px", mx: "auto", mb: 1.5,
                      background: "linear-gradient(135deg,#3F72AF,#112D4E)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.8rem", fontWeight: 900, color: "#F9F7F7",
                      boxShadow: "0 0 30px rgba(63,114,175,0.35)",
                    }}>
                      {user?.username?.[0]?.toUpperCase()}
                    </Box>
                  </motion.div>
                  <Typography variant="h6" fontWeight={800} sx={{ color: isDark ? "#F9F7F7" : "#112D4E" }}>{user?.username}</Typography>
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, mt: 0.5, px: 1.5, py: 0.3, borderRadius: "100px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                    <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#22c55e" }}>Active</Typography>
                  </Box>
                </Box>

                <InfoRow icon={<PersonOutlined sx={{ fontSize: 15 }} />} label="Username" value={user?.username} isDark={isDark} />
                <InfoRow icon={<EmailOutlined sx={{ fontSize: 15 }} />} label="Email" value={user?.email} isDark={isDark} />
                <InfoRow icon={<CalendarTodayOutlined sx={{ fontSize: 15 }} />} label="Joined" value={user?.created_at ? fmt(user.created_at) : "-"} isDark={isDark} />
              </Box>
            </Grid>

            {/* Edit card */}
            <Grid item xs={12} md={8}>
              <Box sx={{ background: cardBg, backdropFilter: "blur(32px)", border: `1px solid ${cardBorder}`, borderRadius: "20px", p: 3, position: "relative", overflow: "hidden", mb: 2, transition: "background 0.4s, border-color 0.4s", boxShadow: isDark ? "none" : "0 4px 24px rgba(63,114,175,0.08)" }}>
                <Box sx={{ position: "absolute", top: 0, left: "8%", right: "8%", height: 1, background: `linear-gradient(90deg,transparent,${shimmerBg},transparent)` }} />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? "#F9F7F7" : "#112D4E" }}>Edit Profile</Typography>
                  {!editing && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setEditing(true)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 7, border: "1px solid rgba(63,114,175,0.2)", background: "rgba(63,114,175,0.07)", color: "#3F72AF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
                      <EditOutlined style={{ fontSize: 14 }} /> Edit
                    </motion.button>
                  )}
                </Box>

                {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}
                {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>{error}</Alert>}

                <TextField label="Username" value={editing ? form.username : user?.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  fullWidth disabled={!editing} margin="normal" />
                <TextField label="Email" value={user?.email} fullWidth disabled margin="normal" helperText="Email cannot be changed" />

                {editing && (
                  <Box display="flex" gap={1.5} mt={2}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleSave} disabled={loading}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#3F72AF,#2d5a8e)", color: "#fff", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
                      <SaveOutlined style={{ fontSize: 15 }} /> {loading ? "Saving..." : "Save"}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => { setEditing(false); setForm({ username: user?.username }); setError(""); }}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 8, border: `1px solid rgba(63,114,175,0.18)`, background: "transparent", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(17,45,78,0.5)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
                      <CancelOutlined style={{ fontSize: 15 }} /> Cancel
                    </motion.button>
                  </Box>
                )}
              </Box>

              {/* Stats */}
              <Box sx={{ background: cardBg, backdropFilter: "blur(32px)", border: `1px solid ${cardBorder}`, borderRadius: "20px", p: 3, transition: "background 0.4s, border-color 0.4s", boxShadow: isDark ? "none" : "0 4px 24px rgba(63,114,175,0.08)" }}>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(63,114,175,0.4)", textTransform: "uppercase", mb: 2 }}>Account Info</Typography>
                <Grid container spacing={2}>
                  {[{ label: "Auth", value: "JWT" }, { label: "Status", value: "Active" }].map((s) => (
                    <Grid item xs={6} key={s.label}>
                      <Box sx={{ p: 2, borderRadius: "12px", background: isDark ? "rgba(63,114,175,0.04)" : "rgba(63,114,175,0.06)", border: "1px solid rgba(63,114,175,0.1)", textAlign: "center" }}>
                        <Typography sx={{ fontSize: "1.5rem", fontWeight: 900, color: "#3F72AF", letterSpacing: "-0.03em" }}>{s.value}</Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: isDark ? "rgba(90,120,160,0.4)" : "rgba(17,45,78,0.4)", mt: 0.25 }}>{s.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
}
