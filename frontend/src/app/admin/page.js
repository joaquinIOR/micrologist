"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const PLANES = ["basico", "estandar", "enterprise"];
const PLAN_COLOR = { basico: "#9ca3af", estandar: "#f97316", enterprise: "#a78bfa" };
const PLAN_BG    = { basico: "rgba(156,163,175,0.1)", estandar: "rgba(249,115,22,0.1)", enterprise: "rgba(167,139,250,0.1)" };

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const avatarColor = (name = "") => {
  const colors = ["#f97316","#3b82f6","#10b981","#a78bfa","#f59e0b","#ef4444","#06b6d4","#ec4899"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % colors.length;
  return colors[h];
};

export default function AdminPanel() {
  const [stats,    setStats]    = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [error,    setError]    = useState("");
  const [toast,    setToast]    = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [hoverId,  setHoverId]  = useState(null);

  useEffect(() => {
    Promise.all([api.admin.stats(), api.admin.usuarios()])
      .then(([s, u]) => { setStats(s); setUsuarios(u); })
      .catch(e => {
        if (e.message?.includes("403") || e.message?.includes("No autorizado")) {
          window.location.href = "/dashboard";
        } else {
          setError(e.message);
        }
      });
  }, []);

  const cambiarPlan = async (id, plan) => {
    try {
      await api.admin.cambiarPlan(id, plan);
      setUsuarios(us => us.map(u => u.id === id ? { ...u, plan } : u));
      setToast("Plan actualizado");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      setError(e.message);
    }
  };

  const filtrados = usuarios.filter(u => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return u.nombre?.toLowerCase().includes(q) ||
           u.email?.toLowerCase().includes(q) ||
           u.empresa?.toLowerCase().includes(q);
  });

  const STATS = stats ? [
    { label: "Usuarios",             value: stats.usuarios,   color: "#f97316" },
    { label: "Buses registrados",    value: stats.buses,      color: "#60a5fa" },
    { label: "Conductores",          value: stats.conductores, color: "#34d399" },
    { label: "Ingresos registrados", value: stats.ingresos,   color: "#a78bfa" },
  ] : [];

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", padding: "2rem" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="/dashboard" style={{ color: "#6b7280", textDecoration: "none", fontSize: 13 }}>← Volver</a>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
                <ShieldIcon />
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>Panel de Administración</h1>
                <div style={{ fontSize: 11, color: "#4b5563", marginTop: 1 }}>Solo acceso super-admin</div>
              </div>
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 99, fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: "#a78bfa", display: "inline-block" }} />
            ADMIN
          </div>
        </div>

        {/* ── ALERTAS ── */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "0.75rem 1rem", color: "#f87171", fontSize: 13, marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}
        {toast && (
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: "0.75rem 1rem", color: "#34d399", fontSize: 13, marginBottom: "1.5rem" }}>
            ✓ {toast}
          </div>
        )}

        {/* ── STATS ── */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${s.color}`, borderRadius: 12, padding: "1.1rem 1.25rem" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value ?? "—"}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── TABLA DE USUARIOS ── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          {/* Cabecera del panel */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.4rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e7eb" }}>Usuarios del sistema</div>
              <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>{filtrados.length} de {usuarios.length} usuarios</div>
            </div>
            {/* Búsqueda */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }}>
                <SearchIcon />
              </div>
              <input
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "0.45rem 0.75rem 0.45rem 2rem", color: "#fff", fontSize: 13, outline: "none", width: 210 }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Usuario", "Empresa / Ciudad", "Flota", "Plan", "Registro"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.6rem 1rem", color: "#4b5563", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: "#374151", fontSize: 13 }}>
                      No hay usuarios que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
                {filtrados.map(u => (
                  <tr
                    key={u.id}
                    onMouseEnter={() => setHoverId(u.id)}
                    onMouseLeave={() => setHoverId(null)}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: hoverId === u.id ? "rgba(255,255,255,0.025)" : "transparent", transition: "background 0.15s" }}
                  >
                    {/* Usuario */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 99, background: avatarColor(u.nombre), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                          {(u.nombre || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: u.activo ? "#e5e7eb" : "#4b5563", fontWeight: 600 }}>{u.nombre}</div>
                          <div style={{ fontSize: 11, color: "#4b5563", marginTop: 1 }}>{u.email}</div>
                        </div>
                        {!u.activo && (
                          <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 99, background: "rgba(239,68,68,0.1)", color: "#f87171", fontWeight: 600, marginLeft: 4 }}>Inactivo</span>
                        )}
                      </div>
                    </td>

                    {/* Empresa / Ciudad */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ color: "#9ca3af" }}>{u.empresa || <span style={{ color: "#374151" }}>—</span>}</div>
                      {u.ciudad && <div style={{ fontSize: 11, color: "#4b5563", marginTop: 1 }}>{u.ciudad}</div>}
                    </td>

                    {/* Flota */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#60a5fa" }}>{u.buses} 🚌</span>
                        <span style={{ fontSize: 11, color: "#34d399" }}>{u.conductores} 👤</span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <select
                        value={u.plan}
                        onChange={e => cambiarPlan(u.id, e.target.value)}
                        style={{ background: PLAN_BG[u.plan] || "rgba(255,255,255,0.05)", border: `1px solid ${PLAN_COLOR[u.plan] || "rgba(255,255,255,0.1)"}`, borderRadius: 99, color: PLAN_COLOR[u.plan] || "#fff", padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", outline: "none" }}
                      >
                        {PLANES.map(p => <option key={p} value={p} style={{ background: "#0d1220", color: "#fff", textTransform: "capitalize" }}>{p}</option>)}
                      </select>
                    </td>

                    {/* Registro */}
                    <td style={{ padding: "0.85rem 1rem", color: "#4b5563", fontSize: 12, whiteSpace: "nowrap" }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
