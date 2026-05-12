"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const input = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const label = { color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 };

export default function NuevoIngreso() {
  const [buses, setBuses] = useState([]);
  const [form, setForm]   = useState({
    bus_id: "", fecha: new Date().toISOString().split("T")[0],
    recorrido: "", total_pasajeros: "", monto: "",
    tipo_tarifa: "completa", notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.buses.listar().then(setBuses).catch(console.error);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.monto || !form.fecha) { setError("Fecha y monto son obligatorios"); return; }
    setLoading(true); setError("");
    try {
      const payload = {
        fecha:           form.fecha,
        monto:           parseFloat(form.monto),
        tipo_tarifa:     form.tipo_tarifa,
        bus_id:          form.bus_id          ? parseInt(form.bus_id)          : null,
        total_pasajeros: form.total_pasajeros ? parseInt(form.total_pasajeros) : null,
        recorrido:       form.recorrido || null,
        notas:           form.notas     || null,
      };
      await api.ingresos.crear(payload);
      window.location.href = "/dashboard/ingresos";
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
          <a href="/dashboard/ingresos" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Volver</a>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Agregar ingreso</h1>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>{error}</div>}

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Fecha <span style={{ color: "#f97316" }}>*</span></label>
              <input style={input} type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} />
            </div>
            <div>
              <label style={label}>Monto recaudado <span style={{ color: "#f97316" }}>*</span></label>
              <input style={input} type="number" placeholder="150000" value={form.monto} onChange={e => set("monto", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Bus</label>
              <select style={{ ...input, cursor: "pointer" }} value={form.bus_id} onChange={e => set("bus_id", e.target.value)}>
                <option value="">Sin bus específico</option>
                {buses.map(b => <option key={b.id} value={b.id}>{b.patente} {b.modelo ? `— ${b.modelo}` : ""}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Total pasajeros</label>
              <input style={input} type="number" placeholder="120" value={form.total_pasajeros} onChange={e => set("total_pasajeros", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Recorrido</label>
              <input style={input} placeholder="Viña - Quilpué" value={form.recorrido} onChange={e => set("recorrido", e.target.value)} />
            </div>
            <div>
              <label style={label}>Tipo de tarifa</label>
              <select style={{ ...input, cursor: "pointer" }} value={form.tipo_tarifa} onChange={e => set("tipo_tarifa", e.target.value)}>
                <option value="completa">Completa</option>
                <option value="adulto_mayor">Adulto mayor</option>
                <option value="estudiante">Estudiante</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label style={label}>Notas</label>
            <textarea style={{ ...input, height: 80, resize: "vertical" }} placeholder="Observaciones..." value={form.notas} onChange={e => set("notas", e.target.value)} />
          </div>

          {/* Info CSV */}
          <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, padding: "0.9rem 1rem" }}>
            <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600, marginBottom: 4 }}>📂 ¿Tienes un archivo CSV de Bipay?</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Puedes importarlo directamente desde la pantalla de ingresos. El archivo debe tener columnas: <strong style={{ color: "#9ca3af" }}>fecha, monto, patente, pasajeros, recorrido</strong>
            </div>
          </div>

          <button onClick={guardar} disabled={loading} style={{ padding: "0.85rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Guardando..." : "Guardar ingreso →"}
          </button>
        </div>
      </div>
    </main>
  );
}