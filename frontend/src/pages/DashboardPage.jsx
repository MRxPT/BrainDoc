import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Edit2, Save, X, MessageSquare, Settings, LayoutDashboard, FileText, Search, Zap, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateMe } from "../api/auth";

const P = "#2563eb";
const EASE = [0.22, 0.61, 0.36, 1];

/* ── Sidebar ──────────────────────────────────────────────────────── */
function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nav = [
    { id: "/dashboard", icon: <LayoutDashboard size={16} />, label: "Profile" },
    { id: "/chat",      icon: <MessageSquare size={16} />,  label: "Chat" },
    { id: "/settings",  icon: <Settings size={16} />,       label: "Settings" },
  ];
  return (
    <div style={{ width: 240, flexShrink: 0, borderRight: "1px solid #f1f5f9", background: "#fafbfc", display: "flex", flexDirection: "column", position: "sticky", top: 64, height: "calc(100vh - 64px)" }}>
      {/* User */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 14px" }}>Workspace</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{user?.username?.[0]?.toUpperCase() || "U"}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.username || "User"}</p>
            <span style={{ padding: "1px 7px", borderRadius: 999, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 10, fontWeight: 700, color: "#10b981" }}>Active</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "12px 12px", flex: 1 }}>
        {nav.map((n) => {
          const isActive = location.pathname === n.id;
          return (
            <button key={n.id} onClick={() => navigate(n.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, marginBottom: 2,
                background: isActive ? "rgba(37,99,235,0.06)" : "transparent",
                border: `1px solid ${isActive ? "rgba(37,99,235,0.15)" : "transparent"}`,
                borderLeft: isActive ? `2px solid ${P}` : "2px solid transparent",
                color: isActive ? "#0f172a" : "#64748b",
                fontWeight: isActive ? 600 : 400, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
            >
              {n.icon}{n.label}
            </button>
          );
        })}
      </div>

      {/* Plan */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9" }}>
        <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", fontSize: 11, fontWeight: 700, color: P }}>Free Plan</span>
      </div>
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────────────── */
function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

/* ── Info row ─────────────────────────────────────────────────────── */
function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
      <div style={{ color: "#94a3b8", display: "flex", flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 2px" }}>{label}</p>
        <p style={{ fontSize: 14, color: "#334155", margin: 0, fontFamily: label === "Email" ? "monospace" : "inherit" }}>{value || "—"}</p>
      </div>
    </div>
  );
}

/* ── Metric card ──────────────────────────────────────────────────── */
function MetricCard({ icon, label, value, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.08)"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: P, marginBottom: 14 }}>
          {icon}
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.03em", fontFamily: "monospace" }}>{value}</p>
      </div>
    </motion.div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, loginUser } = useAuth();
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
    } finally { setLoading(false); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  const METRICS = [
    { icon: <FileText size={16} />,    label: "Documents",    value: "—",   delay: 0 },
    { icon: <MessageSquare size={16}/>,label: "Queries",      value: "—",   delay: 0.06 },
    { icon: <Search size={16} />,      label: "Embeddings",   value: "RAG", delay: 0.12 },
    { icon: <Clock size={16} />,       label: "Avg Response", value: "<1s", delay: 0.18 },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", background: "#f8fafc" }}>
      <Sidebar user={user} />

      <div style={{ flex: 1, overflow: "auto", padding: "40px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P, margin: "0 0 6px" }}>Profile Overview</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
              Good to see you, <span style={{ color: P }}>{user?.username || "there"}</span>
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Metric cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {METRICS.map((m) => <MetricCard key={m.label} {...m} />)}
          </div>

          {/* Profile + Edit grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>

            {/* Identity card */}
            <Card>
              <div style={{ padding: 28 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <motion.div whileHover={{ scale: 1.04 }} style={{ display: "inline-block", marginBottom: 12 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}>
                      <span style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{user?.username?.[0]?.toUpperCase() || "U"}</span>
                    </div>
                  </motion.div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>{user?.username}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px", fontFamily: "monospace" }}>{user?.email}</p>
                  <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 11, fontWeight: 700, color: "#10b981" }}>● Active</span>
                </div>
                <InfoRow icon={<User size={14} />}     label="Username" value={user?.username} />
                <InfoRow icon={<Mail size={14} />}     label="Email"    value={user?.email} />
                <InfoRow icon={<Calendar size={14} />} label="Joined"   value={fmt(user?.created_at)} />
              </div>
            </Card>

            {/* Edit section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card>
                <div style={{ padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 3px", letterSpacing: "-0.02em" }}>Edit Profile</h3>
                      <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Update your display name</p>
                    </div>
                    {!editing && (
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setEditing(true)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
                      >
                        <Edit2 size={13} /> Edit
                      </motion.button>
                    )}
                  </div>

                  {success && <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#10b981" }}>{success}</div>}
                  {error   && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>{error}</div>}

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Username</label>
                    <input
                      value={editing ? form.username : user?.username || ""}
                      onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                      disabled={!editing}
                      style={{ display: "block", width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: editing ? "#fff" : "#f8fafc", color: "#0f172a", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }}
                      onFocus={(e) => { if (editing) { e.target.style.borderColor = P; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; } }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
                    <input value={user?.email || ""} disabled style={{ display: "block", width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #f1f5f9", background: "#f8fafc", color: "#94a3b8", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>Email cannot be changed after signup</p>
                  </div>

                  {editing && (
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleSave} disabled={loading}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                        <Save size={14} /> {loading ? "Saving..." : "Save changes"}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setEditing(false); setForm({ username: user?.username }); setError(""); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                        <X size={14} /> Cancel
                      </motion.button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Account info */}
              <Card>
                <div style={{ padding: 28 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 16px" }}>Account Details</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[{ label: "Auth Method", value: "JWT" }, { label: "Account Status", value: "Active" }].map((s) => (
                      <div key={s.label} style={{ padding: "18px 20px", borderRadius: 14, textAlign: "center", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <p style={{ fontSize: 20, fontWeight: 900, color: P, letterSpacing: "-0.03em", margin: "0 0 3px", fontFamily: "monospace" }}>{s.value}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
