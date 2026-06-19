"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const PLANES = ["basico", "estandar", "enterprise"];
const planColor = { basico: "#9ca3af", estandar: "#f97316", enterprise: "#a78bfa" };

export default function AdminPanel() {
  const [stats, setStats]       = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState("");

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

  const card = (label, value, color = "#f97316") => (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem", textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value ?? "—"}</div>
      <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>{label}</div>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", fontFamily: "sans-serif", padding: "2rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
          <a href="/dashboard" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Volver</a>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Panel de Administración</h1>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>{error}</div>}
        {toast && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "0.75rem", color: "#34d399", fontSize: 13, marginBottom: "1rem" }}>✅ {toast}</div>}

        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            {card("Usuarios", stats.usuarios, "#f97316")}
            {card("Buses", stats.buses, "#60a5fa")}
            {card("Conductores", stats.conductores, "#34d399")}
            {card("Ingresos registrados", stats.ingresos, "#a78bfa")}
          </div>
        )}

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Usuarios del sistema</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Nombre", "Email", "Empresa", "Buses", "Conductores", "Plan", "Registro"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "#9ca3af", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.75rem", color: u.activo ? "#fff" : "#6b7280" }}>{u.nombre}</td>
                    <td style={{ padding: "0.75rem", color: "#9ca3af" }}>{u.email}</td>
                    <td style={{ padding: "0.75rem", color: "#9ca3af" }}>{u.empresa || "—"}</td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>{u.buses}</td>
                    <td style={{ padding: "0.75rem", textAlign: "center" }}>{u.conductores}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <select
                        value={u.plan}
                        onChange={e => cambiarPlan(u.id, e.target.value)}
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: planColor[u.plan] || "#fff", padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
                      >
                        {PLANES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("es-CL") : "—"}
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
