"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const input = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const label = { color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 };

export default function NuevoTurno() {
  const [buses, setBuses]           = useState([]);
  const [conductores, setConductores] = useState([]);
  const [form, setForm] = useState({
    bus_id: "", conductor_id: "", fecha: "",
    tipo: "manana", hora_inicio: "", hora_fin: "", notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.buses.listar().then(setBuses).catch(console.error);
    api.conductores.listar().then(setConductores).catch(console.error);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.bus_id || !form.conductor_id || !form.fecha) {
      setError("Bus, conductor y fecha son obligatorios"); return;
    }
    setLoading(true); setError("");
    try {
      const payload = {
        bus_id:       parseInt(form.bus_id),
        conductor_id: parseInt(form.conductor_id),
        fecha:        form.fecha,
        tipo:         form.tipo,
        notas:        form.notas || null,
        hora_inicio:  form.hora_inicio || null,
        hora_fin:     form.hora_fin    || null,
      };
      await api.turnos.crear(payload);
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
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Asignar turno</h1>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>{error}</div>}

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Bus <span style={{ color: "#f97316" }}>*</span></label>
              <select style={{ ...input, cursor: "pointer" }} value={form.bus_id} onChange={e => set("bus_id", e.target.value)}>
                <option value="">Seleccionar bus...</option>
                {buses.map(b => (
                  <option key={b.id} value={b.id}>{b.patente} {b.modelo ? `— ${b.modelo}` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={label}>Conductor <span style={{ color: "#f97316" }}>*</span></label>
              <select style={{ ...input, cursor: "pointer" }} value={form.conductor_id} onChange={e => set("conductor_id", e.target.value)}>
                <option value="">Seleccionar conductor...</option>
                {conductores.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.tipo_licencia ? `(${c.tipo_licencia})` : ""}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Fecha <span style={{ color: "#f97316" }}>*</span></label>
              <input style={input} type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
            </div>
            <div>
              <label style={label}>Tipo de turno</label>
              <select style={{ ...input, cursor: "pointer" }} value={form.tipo} onChange={e => set("tipo", e.target.value)}>
                <option value="manana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
                <option value="completo">Completo</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Hora inicio</label>
              <input style={input} type="time" value={form.hora_inicio} onChange={e => set("hora_inicio", e.target.value)} />
            </div>
            <div>
              <label style={label}>Hora fin</label>
              <input style={input} type="time" value={form.hora_fin} onChange={e => set("hora_fin", e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Notas</label>
            <textarea style={{ ...input, height: 80, resize: "vertical" }} placeholder="Observaciones del turno..." value={form.notas} onChange={e => set("notas", e.target.value)} />
          </div>

          <button onClick={guardar} disabled={loading} style={{ padding: "0.85rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Guardando..." : "Asignar turno →"}
          </button>
        </div>
      </div>
    </main>
  );
}