"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const INGRESO_VACIO = { bus_id: "", fecha: "", recorrido: "", total_pasajeros: "", monto: "", notas: "" };

export default function Ingresos() {
  const [resumen, setResumen]   = useState(null);
  const [ingresos, setIngresos] = useState([]);
  const [buses, setBuses]       = useState([]);
  const [filtros, setFiltros]   = useState({ fecha_desde: "", fecha_hasta: "", bus_id: "" });
  const [loading, setLoading]   = useState(true);
  const [importando, setImportando] = useState(false);
  const [mensaje, setMensaje]   = useState("");
  const [editando, setEditando] = useState(null);   // ingreso siendo editado
  const [editForm, setEditForm] = useState(INGRESO_VACIO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
    api.buses.listar().then(r => setBuses(r.items)).catch(console.error);
  }, []);

  const cargarDatos = async (f = {}) => {
    setLoading(true);
    try {
      const [r, i] = await Promise.all([
        api.ingresos.resumen(),
        api.ingresos.listar(f),
      ]);
      setResumen(r);
      setIngresos(i);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtrar = () => {
    const f = {};
    if (filtros.fecha_desde) f.fecha_desde = filtros.fecha_desde;
    if (filtros.fecha_hasta) f.fecha_hasta = filtros.fecha_hasta;
    if (filtros.bus_id)      f.bus_id      = filtros.bus_id;
    cargarDatos(f);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este registro?")) return;
    await api.ingresos.eliminar(id);
    cargarDatos();
  };

  const importarCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportando(true); setMensaje("");
    try {
      const res = await api.ingresos.importarCSV(file);
      setMensaje(`✅ ${res.mensaje}`);
      if (res.errores?.length > 0) {
        setMensaje(m => m + ` (${res.errores.length} filas con error)`);
      }
      cargarDatos();
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
    } finally {
      setImportando(false);
      e.target.value = "";
    }
  };

  const abrirEdicion = (ing) => {
    setEditando(ing.id);
    setEditForm({
      bus_id:          ing.bus_id          ?? "",
      fecha:           ing.fecha           ?? "",
      recorrido:       ing.recorrido       ?? "",
      total_pasajeros: ing.total_pasajeros ?? "",
      monto:           ing.monto           ?? "",
      notas:           ing.notas           ?? "",
    });
  };

  const guardarEdicion = async () => {
    setGuardando(true);
    try {
      const payload = {
        ...editForm,
        bus_id:          editForm.bus_id          ? parseInt(editForm.bus_id)          : null,
        total_pasajeros: editForm.total_pasajeros ? parseInt(editForm.total_pasajeros) : null,
        monto:           parseFloat(editForm.monto),
        fecha:           editForm.fecha,
      };
      await api.ingresos.actualizar(editando, payload);
      setEditando(null);
      cargarDatos();
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const fmt = (n) => `$${Math.round(n).toLocaleString("es-CL")}`;
  const input = { padding: "0.5rem 0.8rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" };
  const inputModal = { width: "100%", padding: "0.6rem 0.8rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", padding: "2rem" }}>

      {/* Modal edición */}
      {editando && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#0f1420", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Editar ingreso</h2>
              <button onClick={() => setEditando(null)} style={{ background: "transparent", border: "none", color: "#6b7280", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 4 }}>Fecha</label>
                  <input style={inputModal} type="date" value={editForm.fecha} onChange={e => setEditForm(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 4 }}>Monto ($)</label>
                  <input style={inputModal} type="number" value={editForm.monto} onChange={e => setEditForm(f => ({ ...f, monto: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 4 }}>Bus</label>
                  <select style={{ ...inputModal, cursor: "pointer" }} value={editForm.bus_id} onChange={e => setEditForm(f => ({ ...f, bus_id: e.target.value }))}>
                    <option value="">Sin bus</option>
                    {buses.map(b => <option key={b.id} value={b.id}>{b.patente}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 4 }}>Pasajeros</label>
                  <input style={inputModal} type="number" value={editForm.total_pasajeros} onChange={e => setEditForm(f => ({ ...f, total_pasajeros: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 4 }}>Recorrido</label>
                <input style={inputModal} value={editForm.recorrido} onChange={e => setEditForm(f => ({ ...f, recorrido: e.target.value }))} placeholder="Viña - Quilpué" />
              </div>
              <div>
                <label style={{ color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 4 }}>Notas</label>
                <input style={inputModal} value={editForm.notas} onChange={e => setEditForm(f => ({ ...f, notas: e.target.value }))} placeholder="Observaciones..." />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setEditando(null)} style={{ flex: 1, padding: "0.75rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#6b7280", cursor: "pointer" }}>Cancelar</button>
                <button onClick={guardarEdicion} disabled={guardando} style={{ flex: 2, padding: "0.75rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", opacity: guardando ? 0.7 : 1 }}>
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/dashboard" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Volver</a>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Ingresos</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <label style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#9ca3af", fontSize: 13, cursor: "pointer" }}>
              {importando ? "Importando..." : "📂 Importar CSV"}
              <input type="file" accept=".csv" onChange={importarCSV} style={{ display: "none" }} />
            </label>
            <a href="/dashboard/ingresos/nuevo" style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>+ Agregar manual</a>
          </div>
        </div>

        {mensaje && (
          <div style={{ padding: "0.75rem 1rem", borderRadius: 8, background: mensaje.startsWith("✅") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${mensaje.startsWith("✅") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, color: mensaje.startsWith("✅") ? "#34d399" : "#f87171", fontSize: 13, marginBottom: "1rem" }}>
            {mensaje}
          </div>
        )}

        {/* Resumen */}
        {resumen && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Hoy",    monto: resumen.hoy?.monto,    pasajeros: resumen.hoy?.pasajeros,    color: "#3b82f6" },
              { label: "Semana", monto: resumen.semana?.monto, pasajeros: resumen.semana?.pasajeros, color: "#8b5cf6" },
              { label: "Mes",    monto: resumen.mes?.monto,    pasajeros: resumen.mes?.pasajeros,    color: "#10b981" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${s.color}`, borderRadius: 14, padding: "1.2rem" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{fmt(s.monto || 0)}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{s.pasajeros || 0} pasajeros</div>
              </div>
            ))}
          </div>
        )}

        {/* Por bus */}
        {resumen?.por_bus?.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.2rem 1.5rem", marginBottom: "2rem" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recaudación por bus este mes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {resumen.por_bus.map((b, i) => {
                const max   = resumen.por_bus[0]?.monto || 1;
                const pct   = Math.round((b.monto / max) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{b.patente}</span>
                      <span style={{ color: "#10b981" }}>{fmt(b.monto)}</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
                      <div style={{ height: 6, width: `${pct}%`, background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: 99, transition: "width 0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div style={{ display: "flex", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
          <input style={input} type="date" value={filtros.fecha_desde} onChange={e => setFiltros(f => ({ ...f, fecha_desde: e.target.value }))} />
          <input style={input} type="date" value={filtros.fecha_hasta} onChange={e => setFiltros(f => ({ ...f, fecha_hasta: e.target.value }))} />
          <select style={{ ...input, cursor: "pointer" }} value={filtros.bus_id} onChange={e => setFiltros(f => ({ ...f, bus_id: e.target.value }))}>
            <option value="">Todos los buses</option>
            {buses.map(b => <option key={b.id} value={b.id}>{b.patente}</option>)}
          </select>
          <button onClick={filtrar} style={{ padding: "0.5rem 1rem", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, color: "#f97316", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Filtrar
          </button>
          <button onClick={() => { setFiltros({ fecha_desde: "", fecha_hasta: "", bus_id: "" }); cargarDatos(); }} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#6b7280", fontSize: 13, cursor: "pointer" }}>
            Limpiar
          </button>
        </div>

        {/* Tabla */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>Cargando...</div>
          ) : ingresos.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
              No hay registros. <a href="/dashboard/ingresos/nuevo" style={{ color: "#f97316" }}>Agrega el primero</a> o importa un CSV.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["Fecha", "Bus", "Recorrido", "Pasajeros", "Monto", "Fuente", ""].map(h => (
                    <th key={h} style={{ padding: "0.9rem 1.5rem", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ingresos.map(ing => (
                  <tr key={ing.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "1rem 1.5rem", fontSize: 14 }}>{ing.fecha}</td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{ing.bus_patente || "—"}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "#9ca3af" }}>{ing.recorrido || "—"}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "#9ca3af" }}>{ing.total_pasajeros ?? "—"}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "#10b981", fontWeight: 600 }}>{fmt(ing.monto)}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: ing.fuente === "importado" ? "rgba(139,92,246,0.15)" : "rgba(249,115,22,0.15)", color: ing.fuente === "importado" ? "#a78bfa" : "#f97316" }}>
                        {ing.fuente === "importado" ? "📂 CSV" : "✍️ Manual"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => abrirEdicion(ing)} style={{ padding: "4px 10px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 6, color: "#f97316", fontSize: 12, cursor: "pointer" }}>✏️</button>
                        <button onClick={() => eliminar(ing.id)} style={{ padding: "4px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, color: "#f87171", fontSize: 12, cursor: "pointer" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}