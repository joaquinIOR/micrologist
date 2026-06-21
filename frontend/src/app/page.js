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

      {/* ── ORBES ANIMADOS (fondo global) ──────────────────────── */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,14,26,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <BusIcon size={18} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>MicroLogist</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="#precios" style={{ color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>Precios</a>
          <a href="/login" style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 14, textDecoration: "none" }}>Iniciar sesión</a>
          <a href={waLink("Hola, me interesa MicroLogist para gestionar mi flota de buses")} target="_blank" style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Comenzar gratis</a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8rem 2rem 4rem" }}>
        {/* Grid animado */}
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        {/* Partículas */}
        {[
          { left: "12%", top: "25%", delay: "0s",   dur: "6s"  },
          { left: "28%", top: "70%", delay: "1s",   dur: "8s"  },
          { left: "55%", top: "20%", delay: "2s",   dur: "7s"  },
          { left: "72%", top: "65%", delay: "0.5s", dur: "9s"  },
          { left: "88%", top: "40%", delay: "1.5s", dur: "5s"  },
          { left: "42%", top: "85%", delay: "3s",   dur: "10s" },
        ].map((p, i) => (
          <div key={i} aria-hidden className="particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.dur }} />
        ))}

        <div style={{ position: "relative", maxWidth: 720 }}>
          <div className="badge-pulse" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 99, fontSize: 13, color: "#f97316", marginBottom: "1.5rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: "#f97316", display: "inline-block", animation: "dot-pulse 1.5s ease-in-out infinite" }} />
            Diseñado para transportistas chilenos
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "1.5rem" }}>
            Gestiona tu flota de buses<br />
            <span style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {displayed}<span className="cursor">|</span>
            </span>
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "#9ca3af", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 540, margin: "0 auto 2.5rem" }}>
            MicroLogist te avisa por WhatsApp antes de que venza la revisión técnica, el SOAP o la licencia de tus conductores. Evita multas de hasta $230.000 por bus.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={waLink("Hola, me interesa MicroLogist para gestionar mi flota de buses")} target="_blank" className="btn-glow" style={{ padding: "0.9rem 2rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              📱 Contactar por WhatsApp
            </a>
            <a href="/registro" style={{ padding: "0.9rem 2rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(4px)" }}>
              Crear cuenta →
            </a>
          </div>
          <p style={{ color: "#374151", fontSize: 13, marginTop: "1rem" }}>30 días de prueba gratis · Sin tarjeta de crédito</p>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 2rem 5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ position: "relative", background: "#0d1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 80px rgba(249,115,22,0.1), 0 40px 80px rgba(0,0,0,0.4)" }}>
            {/* Scan line */}
            <div className="scan-line" />
            {/* Browser chrome */}
            <div style={{ background: "#070b14", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0.65rem 1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 99, background: "#3f3f46" }} />
                <div style={{ width: 10, height: 10, borderRadius: 99, background: "#3f3f46" }} />
                <div style={{ width: 10, height: 10, borderRadius: 99, background: "#3f3f46" }} />
              </div>
              <div style={{ flex: 1, maxWidth: 260, margin: "0 auto", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "3px 12px", fontSize: 11, color: "#6b7280", textAlign: "center" }}>
                micrologist.vercel.app/dashboard
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#10b981" }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "#10b981", display: "inline-block", animation: "dot-pulse 2s ease-in-out infinite" }} />
                LIVE
              </div>
            </div>
            {/* Dashboard layout */}
            <div style={{ display: "flex", minHeight: 320 }}>
              <div style={{ width: 160, borderRight: "1px solid rgba(255,255,255,0.07)", padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "1rem", padding: "0 0.25rem" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #f97316, #ea580c)", flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>MicroLogist</span>
                </div>
                {[
                  { label: "Mi Flota", active: true },
                  { label: "Conductores" },
                  { label: "Turnos" },
                  { label: "Ingresos" },
                  { label: "Alertas (2)", warn: true },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "0.35rem 0.6rem", borderRadius: 7, background: item.active ? "rgba(249,115,22,0.15)" : "transparent", color: item.active ? "#f97316" : item.warn ? "#fbbf24" : "#6b7280", fontSize: 11, fontWeight: item.active ? 600 : 400 }}>
                    {item.label}
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, padding: "1.25rem", overflow: "hidden" }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: "0.9rem", color: "#fff" }}>Mi Flota</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: "1rem" }}>
                  {[
                    { label: "Total buses", value: "8", color: "#3b82f6" },
                    { label: "Operativos",  value: "6", color: "#10b981" },
                    { label: "Con alertas", value: "2", color: "#f59e0b" },
                    { label: "Críticos",    value: "1", color: "#ef4444" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${s.color}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "0.6rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Vehículos registrados</span>
                    <span style={{ fontSize: 10, color: "#f97316", fontWeight: 600 }}>+ Agregar bus</span>
                  </div>
                  {[
                    { patente: "BCTK-21", modelo: "Mercedes OF-1721", color: "#34d399", bg: "rgba(16,185,129,0.12)",  label: "Al día" },
                    { patente: "GFPR-43", modelo: "Volvo B8R",        color: "#fbbf24", bg: "rgba(245,158,11,0.12)", label: "Por vencer" },
                    { patente: "RNWK-89", modelo: "Marcopolo G7",     color: "#f87171", bg: "rgba(239,68,68,0.12)",  label: "Vencido" },
                  ].map((bus, i) => (
                    <div key={i} style={{ padding: "0.55rem 1rem", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{bus.patente}</div>
                        <div style={{ fontSize: 10, color: "#6b7280" }}>{bus.modelo}</div>
                      </div>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: bus.bg, color: bus.color, fontWeight: 600 }}>{bus.label}</span>
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
      <section style={{ position: "relative", zIndex: 1, padding: "5rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>¿Te ha pasado esto?</h2>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Los dolores más comunes de los dueños de buses en la región</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {[
            { emoji: "😰", titulo: "Multa inesperada", desc: "Tu bus sale con la revisión técnica vencida. Multa de $230.000 y el bus parado." },
            { emoji: "📋", titulo: "El Excel se perdió", desc: "Alguien lo modificó, se corrompió o nadie lo actualizó desde hace meses." },
            { emoji: "📞", titulo: "Llamadas de último minuto", desc: "Te enteras que la licencia de un conductor venció cuando ya está manejando." },
            { emoji: "❓", titulo: "Sin visibilidad", desc: "No sabes cuánto recaudó cada bus hoy, ni qué recorrido es más rentable." },
          ].map((item, i) => (
            <div key={i} className="card-hover" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.5rem" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{item.titulo}</div>
              <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUCIÓN ───────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "5rem 2rem", background: "rgba(249,115,22,0.03)", borderTop: "1px solid rgba(249,115,22,0.08)", borderBottom: "1px solid rgba(249,115,22,0.08)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>Todo lo que necesitas en un solo lugar</h2>
            <p style={{ color: "#6b7280", fontSize: 16 }}>Simple, directo y hecho para el transportista chileno</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "🔔", titulo: "Alertas por WhatsApp",    desc: "Recibe avisos automáticos días antes de que venza la revisión técnica, SOAP, permisos y licencias." },
              { icon: "🚌", titulo: "Control de flota",         desc: "Semáforo visual en tiempo real: verde, amarillo y rojo por cada documento de cada bus." },
              { icon: "👨‍✈️", titulo: "Gestión de conductores", desc: "Organiza turnos, controla licencias y asigna qué bus maneja cada conductor cada día." },
              { icon: "💰", titulo: "Seguimiento de ingresos",  desc: "Registra la recaudación diaria por bus e importa desde Bipay. Sabe qué recorrido rinde más." },
            ].map((item, i) => (
              <div key={i} className="card-hover card-orange" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{item.titulo}</div>
                <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ────────────────────────────────────────────── */}
      <section id="precios" style={{ position: "relative", zIndex: 1, padding: "5rem 2rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>Precios simples y transparentes</h2>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Sin contratos largos · Cancela cuando quieras</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2rem" }}>
            <div style={{ fontSize: 13, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Plan Básico</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>$25.000</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>por mes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {["Hasta 5 buses", "Hasta 5 conductores", "Alertas por WhatsApp", "Control de turnos", "Soporte por WhatsApp"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d1d5db" }}>
                  <span style={{ color: "#10b981" }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href={waLink("Hola, me interesa el Plan Básico de MicroLogist")} target="_blank" style={{ display: "block", textAlign: "center", padding: "0.8rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Contactar por WhatsApp
            </a>
          </div>

          <div className="card-hover" style={{ background: "rgba(249,115,22,0.08)", border: "2px solid rgba(249,115,22,0.4)", borderRadius: 20, padding: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f97316, #ea580c)", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
              ⭐ Más popular
            </div>
            <div style={{ fontSize: 13, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Plan Estándar</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>$45.000</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>por mes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {["Hasta 15 buses", "Hasta 15 conductores", "Alertas por WhatsApp", "Control de turnos", "Módulo de ingresos", "Importación CSV Bipay", "Soporte prioritario"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d1d5db" }}>
                  <span style={{ color: "#f97316" }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href={waLink("Hola, me interesa el Plan Estándar de MicroLogist")} target="_blank" style={{ display: "block", textAlign: "center", padding: "0.8rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "#4b5563", fontSize: 13, marginTop: "1.5rem" }}>
          ¿Tienes más de 15 buses?{" "}
          <a href={waLink("Hola, tengo más de 15 buses y me interesa MicroLogist")} target="_blank" style={{ color: "#f97316" }}>Contáctanos para un plan personalizado</a>
        </p>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>
            Empieza hoy y evita tu próxima multa
          </h2>
          <p style={{ color: "#6b7280", fontSize: 16, marginBottom: "2rem" }}>
            Únete a los primeros transportistas de Viña del Mar, Valparaíso, Quilpué y Villa Alemana que gestionan su flota de forma digital.
          </p>
          <a href={waLink("Hola, quiero empezar a usar MicroLogist para mi flota de buses")} target="_blank" className="btn-glow" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "1rem 2.5rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            📱 Escribir por WhatsApp
          </a>
          <p style={{ color: "#4b5563", fontSize: 13, marginTop: "1rem" }}>Te respondemos en menos de 1 hora · Lunes a viernes</p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "2rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <BusIcon size={14} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>MicroLogist</span>
        </div>
        <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 8 }}>Gestión de flotas para transportistas de la Región de Valparaíso</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 13 }}>
          <a href="/login"   style={{ color: "#6b7280", textDecoration: "none" }}>Iniciar sesión</a>
          <a href="/registro" style={{ color: "#6b7280", textDecoration: "none" }}>Crear cuenta</a>
          <a href={waLink("Hola, tengo una consulta sobre MicroLogist")} target="_blank" style={{ color: "#6b7280", textDecoration: "none" }}>Contacto</a>
        </div>
        <p style={{ color: "#1f2937", fontSize: 12, marginTop: "1rem" }}>© 2026 MicroLogist · Viña del Mar, Chile</p>
      </footer>

      <style>{`
        /* ── ORBES ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }
        .orb1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(249,115,22,0.5), transparent 70%);
          top: -150px; left: -150px;
          animation: orb-float1 18s ease-in-out infinite;
        }
        .orb2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%);
          top: 30%; right: -100px;
          animation: orb-float2 22s ease-in-out infinite;
        }
        .orb3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%);
          bottom: 10%; left: 30%;
          animation: orb-float3 16s ease-in-out infinite;
        }
        @keyframes orb-float1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-40px) scale(1.05); }
          66%      { transform: translate(-30px,50px) scale(0.95); }
        }
        @keyframes orb-float2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-50px,40px) scale(1.08); }
        }
        @keyframes orb-float3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(40px,-30px) scale(0.92); }
        }

        /* ── GRID ANIMADO ── */
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-drift 20s linear infinite;
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }

        /* ── PARTÍCULAS ── */
        .particle {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(249,115,22,0.5);
          animation: particle-float 6s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(249,115,22,0.4);
        }
        @keyframes particle-float {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50%      { transform: translateY(-20px) scale(1.4); opacity: 1; }
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
          50%      { opacity: 0.5; transform: scale(1.5); }
        }

        /* ── SCAN LINE ── */
        .scan-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.7), transparent);
          z-index: 10;
          animation: scan 4s linear infinite;
          pointer-events: none;
        }
        @keyframes scan {
          0%   { transform: translateY(0);    opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.4; }
          100% { transform: translateY(380px); opacity: 0; }
        }

        /* ── CARD HOVER ── */
        .card-hover {
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(249,115,22,0.3) !important;
          box-shadow: 0 8px 30px rgba(249,115,22,0.08);
        }

        /* ── BTN GLOW ── */
        .btn-glow {
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .btn-glow:hover {
          box-shadow: 0 0 30px rgba(249,115,22,0.5);
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
