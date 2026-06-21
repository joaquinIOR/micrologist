"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const input = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const label = { color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 };

export default function Perfil() {
  const [form, setForm] = useState({
    nombre: "", empresa: "", ciudad: "", telefono: "",
  });
  const [email, setEmail]     = useState("");
  const [plan, setPlan]       = useState("estandar");
  const [loading, setLoading] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState("");

  useEffect(() => {
    api.perfil.obtener().then(p => {
      setEmail(p.email);
      setPlan(p.plan || "estandar");
      setForm({
        nombre:   p.nombre   || "",
        empresa:  p.empresa  || "",
        ciudad:   p.ciudad   || "",
        telefono: p.telefono || "",
      });
    }).catch(() => { window.location.href = "/"; });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.nombre) { setError("El nombre es obligatorio"); return; }
    setLoading(true); setError(""); setGuardado(false);
    try {
      const res = await api.perfil.actualizar(form);
      localStorage.setItem("usuario", JSON.stringify({
        id:      res.id,
        nombre:  res.nombre,
        email:   res.email,
        empresa: res.empresa,
      }));
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enviarAlertas = async () => {
    if (!form.telefono) {
      setError("Debes agregar tu teléfono para recibir alertas por WhatsApp");
      return;
    }
    try {
      const res = await api.alertas.enviarWhatsApp();
      setToast(res.mensaje);
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", padding: "2rem" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
          <a href="/dashboard" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Volver</a>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Mi Perfil</h1>
          <span style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 20, background: plan === "enterprise" ? "rgba(139,92,246,0.15)" : plan === "estandar" ? "rgba(249,115,22,0.15)" : "rgba(107,114,128,0.15)", border: `1px solid ${plan === "enterprise" ? "rgba(139,92,246,0.4)" : plan === "estandar" ? "rgba(249,115,22,0.4)" : "rgba(107,114,128,0.4)"}`, color: plan === "enterprise" ? "#a78bfa" : plan === "estandar" ? "#f97316" : "#9ca3af", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
            {plan}
          </span>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>{error}</div>
        )}
        {guardado && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "0.75rem", color: "#34d399", fontSize: 13, marginBottom: "1rem" }}>✅ Perfil actualizado correctamente</div>
        )}
        {toast && (
          <div style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 8, padding: "0.75rem", color: "#25d366", fontSize: 13, marginBottom: "1rem" }}>📱 {toast}</div>
        )}

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Datos personales</div>

          <div>
            <label style={label}>Nombre completo</label>
            <input style={input} placeholder="Juan Pérez" value={form.nombre} onChange={e => set("nombre", e.target.value)} />
          </div>

          <div>
            <label style={label}>Correo electrónico</label>
            <input style={{ ...input, opacity: 0.5 }} value={email} disabled />
            <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>El correo no se puede cambiar</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Empresa</label>
              <input style={input} placeholder="Trans. Pérez Hnos." value={form.empresa} onChange={e => set("empresa", e.target.value)} />
            </div>
            <div>
              <label style={label}>Ciudad</label>
              <input style={input} placeholder="Viña del Mar" value={form.ciudad} onChange={e => set("ciudad", e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Teléfono / WhatsApp <span style={{ color: "#f97316" }}>*</span></label>
            <input style={input} placeholder="+56912345678" value={form.telefono} onChange={e => set("telefono", e.target.value)} />
            <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>Formato: +569XXXXXXXX — se usa para enviarte alertas por WhatsApp</div>
          </div>

          <button onClick={guardar} disabled={loading} style={{ padding: "0.85rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Guardando..." : "Guardar cambios →"}
          </button>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
          <div style={{ color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Alertas WhatsApp</div>
          <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: "1rem" }}>
            Envía un resumen de todas las alertas activas de tu flota directamente a tu WhatsApp.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={enviarAlertas} style={{ padding: "0.75rem 1.5rem", background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 10, color: "#25d366", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              📱 Enviar alertas por WhatsApp
            </button>
            <button onClick={() => api.reportes.descargarPDF().catch(e => setError(e.message))} style={{ padding: "0.75rem 1.5rem", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 10, color: "#60a5fa", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              📄 Descargar reporte PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}