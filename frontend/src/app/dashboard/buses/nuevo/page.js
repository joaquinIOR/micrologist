"use client";
import { useState } from "react";
import { api } from "@/lib/api";

const input = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const label = { color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 };

export default function NuevoBus() {
  const [form, setForm] = useState({
    patente: "", marca: "", modelo: "", anio: "",
    recorrido: "", revision_tecnica: "", soap: "",
    permiso_circulacion: "", notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.patente) { setError("La patente es obligatoria"); return; }
    setLoading(true); setError("");
    try {
      const payload = { ...form };
      if (!payload.anio) delete payload.anio;
      if (!payload.revision_tecnica) delete payload.revision_tecnica;
      if (!payload.soap) delete payload.soap;
      if (!payload.permiso_circulacion) delete payload.permiso_circulacion;
      await api.buses.crear(payload);
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
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Agregar bus</h1>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>{error}</div>}

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Patente <span style={{ color: "#f97316" }}>*</span></label>
              <input style={input} placeholder="BCTK-21" value={form.patente} onChange={e => set("patente", e.target.value.toUpperCase())} />
            </div>
            <div>
              <label style={label}>Año</label>
              <input style={input} type="number" placeholder="2018" value={form.anio} onChange={e => set("anio", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Marca</label>
              <input style={input} placeholder="Mercedes" value={form.marca} onChange={e => set("marca", e.target.value)} />
            </div>
            <div>
              <label style={label}>Modelo</label>
              <input style={input} placeholder="OF-1721" value={form.modelo} onChange={e => set("modelo", e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Recorrido</label>
            <input style={input} placeholder="Viña - Quilpué" value={form.recorrido} onChange={e => set("recorrido", e.target.value)} />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1rem" }}>
            <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Documentos y vencimientos</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={label}>Revisión técnica</label>
                <input style={input} type="date" value={form.revision_tecnica} onChange={e => set("revision_tecnica", e.target.value)} />
              </div>
              <div>
                <label style={label}>SOAP</label>
                <input style={input} type="date" value={form.soap} onChange={e => set("soap", e.target.value)} />
              </div>
              <div>
                <label style={label}>Permiso circulación</label>
                <input style={input} type="date" value={form.permiso_circulacion} onChange={e => set("permiso_circulacion", e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <label style={label}>Notas</label>
            <textarea style={{ ...input, height: 80, resize: "vertical" }} placeholder="Observaciones del vehículo..." value={form.notas} onChange={e => set("notas", e.target.value)} />
          </div>

          <button onClick={guardar} disabled={loading} style={{ padding: "0.85rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Guardando..." : "Guardar bus →"}
          </button>
        </div>
      </div>
    </main>
  );
}