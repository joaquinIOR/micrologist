"use client";
import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "56939680565";
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const BusIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const PHRASES = ["sin papel.", "sin Excel.", "sin multas."];

const TICKER_ITEMS = [
  "🚌 Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana", "Concón", "San Antonio",
  "✔ Alertas WhatsApp", "✔ Sin Excel", "✔ Sin multas", "✔ Gratis 30 días",
];

export default function Landing() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed,  setDisplayed]  = useState("");
  const [deleting,   setDeleting]   = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIdx];
    const speed   = deleting ? 45 : 90;
    const pause   = !deleting && displayed === current ? 1600 : speed;
    const t = setTimeout(() => {
      if (!deleting) {
        if (displayed.length < current.length) setDisplayed(current.slice(0, displayed.length + 1));
        else setDeleting(true);
      } else {
        if (displayed.length > 0) setDisplayed(current.slice(0, displayed.length - 1));
        else { setDeleting(false); setPhraseIdx((phraseIdx + 1) % PHRASES.length); }
      }
    }, pause);
    return () => clearTimeout(t);
  }, [displayed, deleting, phraseIdx]);

  return (
    <main style={{ background: "#0a0e1a", color: "#fff", overflowX: "hidden" }}>

      {/* ── TICKER BAR ─────────────────────────────────────────── */}
      <div style={{ background: "#060912", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "7px 0", overflow: "hidden", position: "relative", zIndex: 102 }}>
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ padding: "0 2rem", color: i % 10 < 6 ? "#374151" : "#f97316", fontSize: 12, whiteSpace: "nowrap", opacity: i % 10 < 6 ? 0.9 : 1 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,14,26,0.9)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.85rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <BusIcon size={16} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.5px" }}>MicroLogist</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="#precios" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>Precios</a>
          <a href="/login" style={{ padding: "0.45rem 0.9rem", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#d1d5db", fontSize: 13, textDecoration: "none" }}>Entrar</a>
          <a href={waLink("Hola, me interesa MicroLogist")} target="_blank" style={{ padding: "0.45rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Comenzar gratis</a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", padding: "5rem 2rem 4rem" }}>
        {/* Un solo glow sutil */}
        <div aria-hidden style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
        {/* Grid animado */}
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        {/* Partículas */}
        {[
          { left: "65%", top: "20%", delay: "0s",   dur: "7s"  },
          { left: "80%", top: "55%", delay: "1.5s", dur: "9s"  },
          { left: "72%", top: "80%", delay: "3s",   dur: "6s"  },
          { left: "55%", top: "70%", delay: "0.8s", dur: "8s"  },
        ].map((p, i) => (
          <div key={i} aria-hidden className="particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.dur }} />
        ))}

        {/* Layout principal */}
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4rem" }}>

          {/* Texto izquierdo */}
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            {/* Label editorial */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.8rem" }}>
              <div style={{ width: 28, height: 2, background: "#f97316", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600 }}>Diseñado para transportistas chilenos</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "1.5rem", margin: "0 0 1.5rem" }}>
              Gestiona tu flota<br />de buses<br />
              <span style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {displayed}<span className="cursor">|</span>
              </span>
            </h1>

            <p style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", color: "#6b7280", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: 480 }}>
              MicroLogist te avisa por WhatsApp antes de que venza la revisión técnica, el SOAP o la licencia de tus conductores. Controla toda tu flota desde el celular.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={waLink("Hola, me interesa MicroLogist para gestionar mi flota de buses")} target="_blank" className="btn-glow" style={{ padding: "0.85rem 1.75rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                📱 Contactar por WhatsApp
              </a>
              <a href="/registro" style={{ padding: "0.85rem 1.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#d1d5db", fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                Crear cuenta →
              </a>
            </div>
            <p style={{ color: "#374151", fontSize: 12, marginTop: "1rem" }}>Sin tarjeta de crédito · 30 días de prueba</p>
          </div>

          {/* Tarjeta stat derecha — solo desktop */}
          <div className="stat-card-desktop" style={{ flexShrink: 0, width: 240 }}>
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "1.75rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Multa por RT vencida</div>
              <div style={{ fontSize: 58, fontWeight: 900, color: "#f87171", lineHeight: 1, letterSpacing: "-3px" }}>$230K</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>por bus · en Chile</div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: "#10b981", animation: "dot-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>MicroLogist te avisa 30 días antes</span>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem" }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Alertas enviadas hoy</div>
              {[
                { patente: "BCTK-21", doc: "SOAP", color: "#f59e0b" },
                { patente: "RNWK-89", doc: "Rev. Técnica", color: "#ef4444" },
                { patente: "GFPR-43", doc: "Licencia",     color: "#f59e0b" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: i < 2 ? 8 : 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#d1d5db" }}>{a.patente}</span>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: `${a.color}18`, color: a.color, fontWeight: 600 }}>{a.doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROUTE CONNECTOR ────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "0 2rem", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", height: 2, background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.25), rgba(249,115,22,0.5), rgba(249,115,22,0.25), transparent)" }}>
          <div className="bus-rider" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", color: "#f97316" }}>
            <BusIcon size={16} />
          </div>
        </div>
      </div>

      {/* ── PRODUCT PREVIEW ────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "3rem 2rem 5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ position: "relative", background: "#0d1220", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, overflow: "hidden", boxShadow: "0 0 60px rgba(249,115,22,0.07), 0 40px 80px rgba(0,0,0,0.4)" }}>
            <div className="scan-line" />
            {/* Browser chrome */}
            <div style={{ background: "#070b14", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ef4444","#f59e0b","#10b981"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 99, background: c, opacity: 0.6 }} />)}
              </div>
              <div style={{ flex: 1, maxWidth: 240, margin: "0 auto", background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 10px", fontSize: 10, color: "#4b5563", textAlign: "center" }}>
                micrologist.vercel.app/dashboard
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#10b981" }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: "#10b981", display: "inline-block", animation: "dot-pulse 2s ease-in-out infinite" }} />
                LIVE
              </div>
            </div>
            {/* Dashboard layout */}
            <div style={{ display: "flex", minHeight: 300 }}>
              <div style={{ width: 155, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.9rem", padding: "0 0.25rem" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg, #f97316, #ea580c)", flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: 11, color: "#fff" }}>MicroLogist</span>
                </div>
                {[
                  { label: "Mi Flota",     active: true },
                  { label: "Conductores" },
                  { label: "Turnos" },
                  { label: "Ingresos" },
                  { label: "Alertas (2)", warn: true },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "0.32rem 0.55rem", borderRadius: 6, background: item.active ? "rgba(249,115,22,0.15)" : "transparent", color: item.active ? "#f97316" : item.warn ? "#fbbf24" : "#4b5563", fontSize: 11, fontWeight: item.active ? 600 : 400 }}>
                    {item.label}
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, padding: "1.1rem", overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: "0.8rem" }}>Mi Flota</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginBottom: "0.9rem" }}>
                  {[
                    { label: "Total",     value: "8",  color: "#3b82f6" },
                    { label: "Operativos",value: "6",  color: "#10b981" },
                    { label: "Alertas",   value: "2",  color: "#f59e0b" },
                    { label: "Críticos",  value: "1",  color: "#ef4444" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${s.color}`, borderRadius: 7, padding: "0.55rem 0.65rem" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 9, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, overflow: "hidden" }}>
                  <div style={{ padding: "0.55rem 0.9rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>Vehículos</span>
                    <span style={{ fontSize: 10, color: "#f97316", fontWeight: 600 }}>+ Agregar</span>
                  </div>
                  {[
                    { patente: "BCTK-21", modelo: "Mercedes OF-1721", color: "#34d399", bg: "rgba(16,185,129,0.12)",  label: "Al día" },
                    { patente: "GFPR-43", modelo: "Volvo B8R",        color: "#fbbf24", bg: "rgba(245,158,11,0.12)", label: "Por vencer" },
                    { patente: "RNWK-89", modelo: "Marcopolo G7",     color: "#f87171", bg: "rgba(239,68,68,0.12)",  label: "Vencido" },
                  ].map((bus, i) => (
                    <div key={i} style={{ padding: "0.5rem 0.9rem", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{bus.patente}</div>
                        <div style={{ fontSize: 10, color: "#4b5563" }}>{bus.modelo}</div>
                      </div>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: bus.bg, color: bus.color, fontWeight: 600 }}>{bus.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", color: "#374151", fontSize: 12, marginTop: "0.75rem" }}>Vista real del dashboard · Datos de ejemplo</p>
        </div>
      </section>

      {/* ── PROBLEMA ───────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
            <div style={{ width: 28, height: 2, background: "#f97316" }} />
            <span style={{ fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>El problema</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.5px" }}>¿Te ha pasado esto?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>

          {/* Card 1: Multa inesperada */}
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "#080c18", borderBottom: "1px solid rgba(239,68,68,0.15)", padding: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: "#ef4444" }} />
                <span style={{ fontSize: 9, color: "#6b7280", fontFamily: "monospace" }}>SEREMITT · Fiscalización vial</span>
              </div>
              <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 8, padding: "0.75rem", fontSize: 10, fontFamily: "monospace", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Vehículo</span>
                  <span style={{ color: "#d1d5db", fontWeight: 700 }}>BCTK-21</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Revisión Técnica</span>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>VENCIDA ✕</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280" }}>Multa</span>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>$230.000</span>
                </div>
                <div style={{ marginTop: 2, padding: "5px 8px", background: "rgba(239,68,68,0.12)", borderRadius: 5, textAlign: "center", color: "#f87171", fontSize: 9, letterSpacing: "0.04em" }}>
                  Bus detenido hasta regularizar documentos
                </div>
              </div>
            </div>
            <div style={{ padding: "1.1rem" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#e5e7eb" }}>Multa inesperada</div>
              <div style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.65 }}>Tu bus sale con la revisión técnica vencida. Multa de $230.000 y el bus parado toda la jornada.</div>
            </div>
          </div>

          {/* Card 2: Excel se perdió */}
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "#080c18", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: "#10b981" }} />
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: "#22c55e" }} />
                </div>
                <span style={{ fontSize: 9, color: "#6b7280", fontFamily: "monospace" }}>Buses_flota_2024_final_v3.xlsx</span>
              </div>
              <div style={{ fontSize: 9, fontFamily: "monospace", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,0.06)" }}>
                  {["Patente","Venc. RT","SOAP"].map(h => <div key={h} style={{ padding: "4px 6px", color: "#6b7280", borderRight: "1px solid rgba(255,255,255,0.05)" }}>{h}</div>)}
                </div>
                {[
                  ["BCTK-21", "#VALOR!",   "ok"],
                  ["GFPR-43", "12/2023",   "#REF!"],
                  ["RNWK-89", "???",       ""],
                  ["LMPQ-02", "#######",   "#VALOR!"],
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <div style={{ padding: "4px 6px", color: "#9ca3af", borderRight: "1px solid rgba(255,255,255,0.04)" }}>{row[0]}</div>
                    <div style={{ padding: "4px 6px", color: row[1].startsWith("#") ? "#ef4444" : "#9ca3af", borderRight: "1px solid rgba(255,255,255,0.04)" }}>{row[1]}</div>
                    <div style={{ padding: "4px 6px", color: row[2].startsWith("#") ? "#ef4444" : "#4b5563" }}>{row[2]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "1.1rem" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#e5e7eb" }}>El Excel se perdió</div>
              <div style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.65 }}>Alguien lo modificó, se corrompió o nadie lo actualizó desde hace meses. Los datos no son confiables.</div>
            </div>
          </div>

          {/* Card 3: Aviso de último minuto */}
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "#080c18", borderBottom: "1px solid rgba(245,158,11,0.12)", padding: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: "#22c55e" }} />
                <span style={{ fontSize: 9, color: "#6b7280", fontFamily: "monospace" }}>WhatsApp · Hoy, 14:32</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.06)", borderRadius: "10px 10px 10px 2px", padding: "7px 10px", maxWidth: "88%", fontSize: 10, color: "#d1d5db", lineHeight: 1.5 }}>
                  <div style={{ fontSize: 9, color: "#f97316", fontWeight: 600, marginBottom: 3 }}>SEREMITT V Región</div>
                  Bus <strong>RNWK-89</strong> fue detenido en ruta 68 por <span style={{ color: "#f59e0b" }}>licencia de conductor vencida</span>. Multa en curso.
                  <div style={{ fontSize: 8, color: "#4b5563", marginTop: 4 }}>14:32 ✓✓</div>
                </div>
                <div style={{ alignSelf: "flex-end", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px 10px 2px 10px", padding: "6px 10px", fontSize: 10, color: "#fbbf24" }}>
                  ¿Cuándo venció? 😰
                  <div style={{ fontSize: 8, color: "#6b7280", marginTop: 3 }}>14:33 ✓</div>
                </div>
              </div>
            </div>
            <div style={{ padding: "1.1rem" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#e5e7eb" }}>Aviso de último minuto</div>
              <div style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.65 }}>Te enteras que la licencia de un conductor venció cuando ya está manejando — y ya es demasiado tarde.</div>
            </div>
          </div>

          {/* Card 4: Sin visibilidad */}
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "#080c18", borderBottom: "1px solid rgba(59,130,246,0.1)", padding: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: "#374151" }} />
                <span style={{ fontSize: 9, color: "#6b7280", fontFamily: "monospace" }}>Panel de control · Sin datos</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 8 }}>
                {[
                  { label: "Buses operativos", color: "#374151" },
                  { label: "Alertas activas",  color: "#374151" },
                  { label: "Recaudación hoy",  color: "#374151" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 7, padding: "8px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#374151", lineHeight: 1 }}>—</div>
                    <div style={{ fontSize: 8, color: "#374151", marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 7, padding: "8px 10px", fontSize: 9, fontFamily: "monospace" }}>
                {[["BCTK-21", "?", "?"], ["GFPR-43", "?", "?"], ["RNWK-89", "?", "?"]].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", color: "#374151", marginBottom: i < 2 ? 5 : 0 }}>
                    <span>{r[0]}</span><span>RT: {r[1]}</span><span>SOAP: {r[2]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "1.1rem" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#e5e7eb" }}>Sin visibilidad</div>
              <div style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.65 }}>No sabes cuánto recaudó cada bus hoy, ni el estado real de tus documentos. Operas a ciegas.</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SOLUCIÓN ───────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: "rgba(249,115,22,0.025)", borderTop: "1px solid rgba(249,115,22,0.07)", borderBottom: "1px solid rgba(249,115,22,0.07)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
              <div style={{ width: 28, height: 2, background: "#f97316" }} />
              <span style={{ fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>La solución</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.5px" }}>Todo en un solo lugar</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "🔔", titulo: "Alertas por WhatsApp",     desc: "Avisos automáticos días antes de que venza la revisión técnica, SOAP, permisos y licencias." },
              { icon: "🚌", titulo: "Control de flota",          desc: "Semáforo visual en tiempo real: verde, amarillo y rojo por cada documento de cada bus." },
              { icon: "👨‍✈️", titulo: "Gestión de conductores",  desc: "Controla licencias, asigna turnos y sabe qué conductor maneja qué bus cada día." },
              { icon: "💰", titulo: "Seguimiento de ingresos",   desc: "Registra la recaudación diaria por bus. Sabe qué recorrido rinde más." },
            ].map((item, i) => (
              <div key={i} className="card-hover" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.4rem" }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 7, color: "#e5e7eb" }}>{item.titulo}</div>
                <div style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ────────────────────────────────────────────── */}
      <section id="precios" style={{ padding: "5rem 2rem", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
            <div style={{ width: 28, height: 2, background: "#f97316" }} />
            <span style={{ fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Planes</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.5px" }}>Precios simples y transparentes</h2>
          <p style={{ color: "#4b5563", fontSize: 14, marginTop: 6 }}>Sin contratos largos · Cancela cuando quieras</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "2rem" }}>
            <div style={{ fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Básico</div>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1px", marginBottom: 2 }}>$25.000</div>
            <div style={{ fontSize: 12, color: "#4b5563", marginBottom: "1.5rem" }}>por mes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: "1.5rem" }}>
              {["Hasta 5 buses", "Hasta 5 conductores", "Alertas por WhatsApp", "Control de turnos", "Soporte por WhatsApp"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9ca3af" }}>
                  <span style={{ color: "#10b981", fontSize: 14 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href={waLink("Hola, me interesa el Plan Básico de MicroLogist")} target="_blank" style={{ display: "block", textAlign: "center", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, color: "#d1d5db", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Empezar →
            </a>
          </div>

          <div className="card-hover" style={{ background: "rgba(249,115,22,0.07)", border: "2px solid rgba(249,115,22,0.35)", borderRadius: 18, padding: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, right: 20, background: "linear-gradient(135deg, #f97316, #ea580c)", padding: "3px 14px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>
              Más popular
            </div>
            <div style={{ fontSize: 12, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Estándar</div>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-1px", marginBottom: 2 }}>$45.000</div>
            <div style={{ fontSize: 12, color: "#4b5563", marginBottom: "1.5rem" }}>por mes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: "1.5rem" }}>
              {["Hasta 15 buses", "Hasta 15 conductores", "Alertas por WhatsApp", "Control de turnos", "Módulo de ingresos", "Importación CSV Bipay", "Soporte prioritario"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9ca3af" }}>
                  <span style={{ color: "#f97316", fontSize: 14 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href={waLink("Hola, me interesa el Plan Estándar de MicroLogist")} target="_blank" className="btn-glow" style={{ display: "block", textAlign: "center", padding: "0.75rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 9, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Empezar →
            </a>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "#374151", fontSize: 13, marginTop: "1.5rem" }}>
          ¿Más de 15 buses?{" "}
          <a href={waLink("Hola, tengo más de 15 buses y me interesa MicroLogist")} target="_blank" style={{ color: "#f97316" }}>Contáctanos</a>
        </p>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1rem" }}>
            Evita tu próxima multa
          </h2>
          <p style={{ color: "#4b5563", fontSize: 15, marginBottom: "2rem" }}>
            Únete a los primeros transportistas de Viña del Mar, Valparaíso, Quilpué y Villa Alemana que gestionan su flota digitalmente.
          </p>
          <a href={waLink("Hola, quiero empezar a usar MicroLogist")} target="_blank" className="btn-glow" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "1rem 2.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            📱 Escribir por WhatsApp
          </a>
          <p style={{ color: "#374151", fontSize: 12, marginTop: "1rem" }}>Te respondemos en menos de 1 hora · Lunes a viernes</p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1rem" }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <BusIcon size={13} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>MicroLogist</span>
        </div>
        <p style={{ color: "#374151", fontSize: 12, marginBottom: 8 }}>Gestión de flotas · Región de Valparaíso, Chile</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 12 }}>
          <a href="/login"    style={{ color: "#374151", textDecoration: "none" }}>Iniciar sesión</a>
          <a href="/registro" style={{ color: "#374151", textDecoration: "none" }}>Crear cuenta</a>
          <a href={waLink("Hola, tengo una consulta")} target="_blank" style={{ color: "#374151", textDecoration: "none" }}>Contacto</a>
        </div>
        <p style={{ color: "#1f2937", fontSize: 11, marginTop: "1rem" }}>© 2026 MicroLogist · Viña del Mar</p>
      </footer>

      <style>{`
        /* ── TICKER ── */
        .ticker-track {
          display: flex;
          animation: ticker 28s linear infinite;
          width: max-content;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── GRID ── */
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 44px 44px;
          animation: grid-drift 25s linear infinite;
          pointer-events: none;
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 44px 44px; }
        }

        /* ── PARTÍCULAS ── */
        .particle {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(249,115,22,0.45);
          animation: particle-float 6s ease-in-out infinite;
          box-shadow: 0 0 5px rgba(249,115,22,0.3);
          pointer-events: none;
        }
        @keyframes particle-float {
          0%,100% { transform: translateY(0) scale(1);   opacity: 0.5; }
          50%      { transform: translateY(-18px) scale(1.3); opacity: 0.9; }
        }

        /* ── BUS RIDER ── */
        .bus-rider {
          animation: bus-ride 8s linear infinite;
        }
        @keyframes bus-ride {
          from { left: -20px; }
          to   { left: 100%; }
        }

        /* ── CURSOR TYPEWRITER ── */
        .cursor {
          animation: blink 0.8s step-end infinite;
          color: #f97316;
          font-weight: 300;
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }

        /* ── DOT PULSE ── */
        @keyframes dot-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(1.6); }
        }

        /* ── SCAN LINE ── */
        .scan-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent);
          z-index: 10;
          animation: scan 5s linear infinite;
          pointer-events: none;
        }
        @keyframes scan {
          0%   { transform: translateY(0);    opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(360px); opacity: 0; }
        }

        /* ── CARD HOVER ── */
        .card-hover {
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          border-color: rgba(249,115,22,0.25) !important;
          box-shadow: 0 8px 28px rgba(249,115,22,0.07);
        }

        /* ── BTN GLOW ── */
        .btn-glow {
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .btn-glow:hover {
          box-shadow: 0 0 28px rgba(249,115,22,0.45);
          transform: translateY(-2px);
        }

        /* ── STAT CARD (ocultar en mobile) ── */
        @media (max-width: 768px) {
          .stat-card-desktop { display: none !important; }
        }
      `}</style>
    </main>
  );
}
