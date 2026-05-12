"use client";
import { useState } from "react";
import { api } from "@/lib/api";

const input = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const label = { color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 };

export default function NuevoConductor() {
  const [form, setForm] = useState({
    nombre: "", rut: "", telefono: "", email: "",
    whatsapp: "", tipo_licencia: "", vencimiento_licencia: "", notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.nombre) { setError("El nombre es obligatorio"); return; }
    setLoading(true); setError("");
    try {
      const payload = { ...form };
      if (!payload.vencimiento_licencia) delete payload.vencimiento_licencia;
      await api.conductores.crear(payload);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", fontFamily: "sans-serif", padding: "2rem" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
          <a href="/dashboard" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Volver</a>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Agregar conductor</h1>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>{error}</div>}

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Nombre completo <span style={{ color: "#f97316" }}>*</span></label>
              <input style={input} placeholder="Juan Pérez" value={form.nombre} onChange={e => set("nombre", e.target.value)} />
            </div>
            <div>
              <label style={label}>RUT</label>
              <input style={input} placeholder="12.345.678-9" value={form.rut} onChange={e => set("rut", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Teléfono</label>
              <input style={input} placeholder="+56 9 1234 5678" value={form.telefono} onChange={e => set("telefono", e.target.value)} />
            </div>
            <div>
              <label style={label}>WhatsApp</label>
              <input style={input} placeholder="+56 9 1234 5678" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Correo electrónico</label>
            <input style={input} type="email" placeholder="conductor@correo.cl" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1rem" }}>
            <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Licencia de conducir</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={label}>Tipo de licencia</label>
                <select style={{ ...input, cursor: "pointer" }} value={form.tipo_licencia} onChange={e => set("tipo_licencia", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="A3">A3</option>
                  <option value="A4">A4</option>
                  <option value="A5">A5</option>
                </select>
              </div>
              <div>
                <label style={label}>Vencimiento licencia</label>
                <input style={input} type="date" value={form.vencimiento_licencia} onChange={e => set("vencimiento_licencia", e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <label style={label}>Notas</label>
            <textarea style={{ ...input, height: 80, resize: "vertical" }} placeholder="Observaciones del conductor..." value={form.notas} onChange={e => set("notas", e.target.value)} />
          </div>

          <button onClick={guardar} disabled={loading} style={{ padding: "0.85rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Guardando..." : "Guardar conductor →"}
          </button>
        </div>
      </div>
    </main>
  );
}