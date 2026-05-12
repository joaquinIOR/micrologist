"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const estadoColor = {
  ok:       { bg: "rgba(16,185,129,0.15)", text: "#34d399", label: "Al día" },
  alerta:   { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", label: "Por vencer" },
  critico:  { bg: "rgba(239,68,68,0.15)",  text: "#f87171", label: "Vencido" },
  sin_fecha:{ bg: "rgba(107,114,128,0.15)",text: "#9ca3af", label: "Sin fecha" },
};

function Badge({ estado }) {
  const c = estadoColor[estado] || estadoColor.sin_fecha;
  return (
    <span style={{ padding: "4px 10px", borderRadius: 999, background: c.bg, color: c.text, fontSize: 12, fontWeight: 600 }}>
      {c.label}
    </span>
  );
}

function TurnosTab() {
  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha]   = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    api.turnos.listar(fecha).then(setTurnos).catch(console.error);
  }, [fecha]);

  return (
    <div>
      <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ color: "#9ca3af", fontSize: 13 }}>Ver turnos del día:</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
          style={{ padding: "0.4rem 0.8rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
      </div>
      {turnos.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No hay turnos para este día.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              {["Bus", "Conductor", "Tipo", "Horario"].map(h => (
                <th key={h} style={{ padding: "0.9rem 1.5rem", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {turnos.map(t => (
              <tr key={t.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{t.bus_patente}</td>
                <td style={{ padding: "1rem 1.5rem", color: "#9ca3af" }}>{t.conductor_nombre}</td>
                <td style={{ padding: "1rem 1.5rem", textTransform: "capitalize" }}>{t.tipo}</td>
                <td style={{ padding: "1rem 1.5rem", color: "#9ca3af" }}>{t.hora_inicio && t.hora_fin ? `${t.hora_inicio} — ${t.hora_fin}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function IngresosPreview() {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    api.ingresos.resumen().then(setResumen).catch(console.error);
  }, []);

  const fmt = (n) => `$${Math.round(n || 0).toLocaleString("es-CL")}`;

  return (
    <div style={{ padding: "1.5rem" }}>
      {resumen ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Hoy",    monto: resumen.hoy?.monto,    color: "#3b82f6" },
              { label: "Semana", monto: resumen.semana?.monto, color: "#8b5cf6" },
              { label: "Mes",    monto: resumen.mes?.monto,    color: "#10b981" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{fmt(s.monto)}</div>
              </div>
            ))}
          </div>
          <a href="/dashboard/ingresos" style={{ display: "block", textAlign: "center", padding: "0.75rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Ver módulo completo →
          </a>
        </>
      ) : (
        <div style={{ textAlign: "center", color: "#6b7280", paddingBottom: "1rem" }}>
          Cargando resumen...
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab]                 = useState("flota");
  const [buses, setBuses]             = useState([]);
  const [conductores, setConductores] = useState([]);
  const [alertas, setAlertas]         = useState(null);
  const [usuario, setUsuario]         = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (!u) { window.location.href = "/"; return; }
    setUsuario(JSON.parse(u));
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [b, c, a] = await Promise.all([
        api.buses.listar(),
        api.conductores.listar(),
        api.alertas.obtener(),
      ]);
      setBuses(b);
      setConductores(c);
      setAlertas(a);
    } catch (err) {
      if (err.message.includes("401")) { window.location.href = "/"; }
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  const btnEditar = { padding: "4px 10px", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 6, color: "#f97316", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none" };
  const s = { minHeight: "100vh", background: "#0a0e1a", color: "#fff", fontFamily: "sans-serif", display: "flex" };

  if (loading) return (
    <div style={{ ...s, alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#6b7280" }}>Cargando...</div>
    </div>
  );

  const titles = { flota: "Mi Flota", conductores: "Conductores", turnos: "Turnos", alertas: "Alertas", ingresos: "Ingresos" };

  return (
    <div style={s}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2.5rem" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>🚌</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>MicroLogist</span>
        </div>

        {[
          { id: "flota",       icon: "🚌", label: "Mi Flota" },
          { id: "conductores", icon: "👨‍✈️", label: "Conductores" },
          { id: "turnos",      icon: "📅", label: "Turnos" },
          { id: "ingresos",    icon: "💰", label: "Ingresos" },
          { id: "alertas",     icon: "🔔", label: `Alertas ${alertas?.total > 0 ? `(${alertas.total})` : ""}` },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.65rem 0.8rem", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, background: tab === item.id ? "rgba(249,115,22,0.15)" : "transparent", color: tab === item.id ? "#f97316" : "#6b7280", fontSize: 14, fontWeight: tab === item.id ? 600 : 400, textAlign: "left" }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}

        <div style={{ marginTop: "auto" }}>
          {usuario && (
            <a href="/dashboard/perfil" style={{ display: "block", padding: "0.8rem", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: "0.8rem", textDecoration: "none" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{usuario.nombre}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{usuario.empresa}</div>
              <div style={{ fontSize: 11, color: "#f97316", marginTop: 4 }}>⚙️ Editar perfil</div>
            </a>
          )}
          <button onClick={cerrarSesion} style={{ width: "100%", padding: "0.6rem", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#6b7280", fontSize: 13, cursor: "pointer" }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ marginLeft: 220, padding: "2rem", flex: 1 }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{titles[tab]}</h1>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total buses",  value: buses.length,                                  color: "#3b82f6" },
            { label: "Operativos",   value: buses.filter(b => b.semaforo === "ok").length, color: "#10b981" },
            { label: "Con alertas",  value: alertas?.alertas  || 0,                        color: "#f59e0b" },
            { label: "Críticos",     value: alertas?.criticos || 0,                        color: "#ef4444" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.2rem" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Flota */}
        {tab === "flota" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Vehículos registrados</span>
              <a href="/dashboard/buses/nuevo" style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>+ Agregar bus</a>
            </div>
            {buses.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                No tienes buses registrados aún. <a href="/dashboard/buses/nuevo" style={{ color: "#f97316" }}>Agrega el primero</a>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    {["Patente", "Modelo", "Rev. Técnica", "SOAP", "Estado", ""].map(h => (
                      <th key={h} style={{ padding: "0.9rem 1.5rem", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buses.map(bus => (
                    <tr key={bus.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{bus.patente}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#9ca3af" }}>{bus.modelo || "—"}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{bus.revision_tecnica || "—"}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{bus.soap || "—"}</td>
                      <td style={{ padding: "1rem 1.5rem" }}><Badge estado={bus.semaforo} /></td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <a href={`/dashboard/buses/editar?id=${bus.id}`} style={btnEditar}>✏️ Editar</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Conductores */}
        {tab === "conductores" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Conductores activos</span>
              <a href="/dashboard/conductores/nuevo" style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>+ Agregar conductor</a>
            </div>
            {conductores.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                No tienes conductores registrados. <a href="/dashboard/conductores/nuevo" style={{ color: "#f97316" }}>Agrega el primero</a>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    {["Nombre", "Licencia", "Vencimiento", "Estado", ""].map(h => (
                      <th key={h} style={{ padding: "0.9rem 1.5rem", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {conductores.map(c => (
                    <tr key={c.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{c.nombre}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "#9ca3af" }}>{c.tipo_licencia || "—"}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{c.vencimiento_licencia || "—"}</td>
                      <td style={{ padding: "1rem 1.5rem" }}><Badge estado={c.semaforo_licencia} /></td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <a href={`/dashboard/conductores/editar?id=${c.id}`} style={btnEditar}>✏️ Editar</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Turnos */}
        {tab === "turnos" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Turnos asignados</span>
              <a href="/dashboard/turnos/nuevo" style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>+ Asignar turno</a>
            </div>
            <TurnosTab />
          </div>
        )}

        {/* Ingresos */}
        {tab === "ingresos" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Resumen de ingresos</span>
              <a href="/dashboard/ingresos" style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Ver módulo completo →</a>
            </div>
            <IngresosPreview />
          </div>
        )}

        {/* Alertas */}
        {tab === "alertas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {alertas?.items?.length === 0 && (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
                ✅ Todo al día, no hay alertas activas.
              </div>
            )}
            {alertas?.items?.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.2rem", background: a.nivel === "critico" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${a.nivel === "critico" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: 12 }}>
                <span style={{ fontSize: 22 }}>{a.nivel === "critico" ? "🚨" : "⚠️"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.entidad} — {a.nombre}</div>
                  <div style={{ color: "#9ca3af", fontSize: 13 }}>{a.mensaje}</div>
                </div>
                {a.multa_estimada > 0 && (
                  <div style={{ color: "#f87171", fontSize: 13, fontWeight: 600 }}>💸 ${a.multa_estimada.toLocaleString()}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}