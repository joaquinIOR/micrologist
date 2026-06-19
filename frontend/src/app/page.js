"use client";
import { useState } from "react";

const WHATSAPP_NUMBER = "56939680565";

function whatsappLink(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

export default function Landing() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <main style={{ background: "#0a0e1a", color: "#fff", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,14,26,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🚌</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>MicroLogist</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="#precios" style={{ color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>Precios</a>
          <a href="/login" style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 14, textDecoration: "none" }}>Iniciar sesión</a>
          <a href={whatsappLink("Hola, me interesa MicroLogist para gestionar mi flota de buses")} target="_blank" style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Comenzar gratis</a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8rem 2rem 4rem", position: "relative" }}>
        {/* Fondo con gradiente */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div style={{ position: "relative", maxWidth: 700 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 99, fontSize: 13, color: "#f97316", marginBottom: "1.5rem" }}>
            🚌 Diseñado para transportistas chilenos
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: "1.5rem" }}>
            Gestiona tu flota de buses<br />
            <span style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>sin papel, sin Excel</span>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#9ca3af", lineHeight: 1.6, marginBottom: "2.5rem", maxWidth: 560, margin: "0 auto 2.5rem" }}>
            MicroLogist te avisa por WhatsApp antes de que venza la revisión técnica, el SOAP o la licencia de tus conductores. Evita multas de hasta $230.000 por bus.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={whatsappLink("Hola, me interesa MicroLogist para gestionar mi flota de buses")} target="_blank" style={{ padding: "0.9rem 2rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              📱 Contactar por WhatsApp
            </a>
            <a href="/registro" style={{ padding: "0.9rem 2rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
              Crear cuenta →
            </a>
          </div>
          <p style={{ color: "#4b5563", fontSize: 13, marginTop: "1rem" }}>30 días de prueba gratis · Sin tarjeta de crédito</p>
        </div>
      </section>

      {/* ── PROBLEMA ───────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>¿Te ha pasado esto?</h2>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Los dolores más comunes de los dueños de buses en la región</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            { emoji: "😰", titulo: "Multa inesperada", desc: "Tu bus sale a la calle con la revisión técnica vencida. Multa de $230.000 y el bus parado." },
            { emoji: "📋", titulo: "El Excel se perdió", desc: "Alguien modificó el archivo, se corrompió o simplemente nadie lo actualizó desde hace meses." },
            { emoji: "📞", titulo: "Llamadas de último minuto", desc: "Te enteras que la licencia de un conductor venció cuando ya está manejando." },
            { emoji: "❓", titulo: "Sin visibilidad", desc: "No sabes cuánto recaudó cada bus hoy, ni qué recorrido es más rentable." },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "1.5rem" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{item.titulo}</div>
              <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUCIÓN ───────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: "rgba(249,115,22,0.03)", borderTop: "1px solid rgba(249,115,22,0.1)", borderBottom: "1px solid rgba(249,115,22,0.1)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>Todo lo que necesitas en un solo lugar</h2>
            <p style={{ color: "#6b7280", fontSize: 16 }}>Simple, directo y hecho para el transportista chileno</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "🔔", titulo: "Alertas por WhatsApp", desc: "Recibe avisos automáticos días antes de que venza la revisión técnica, SOAP, permisos de circulación y licencias de conductores." },
              { icon: "🚌", titulo: "Control de flota", desc: "Registra todos tus buses con sus documentos. Un semáforo visual te muestra al instante qué está al día y qué no." },
              { icon: "👨‍✈️", titulo: "Gestión de conductores", desc: "Organiza los turnos de tus conductores, controla sus licencias y asigna qué bus maneja cada uno cada día." },
              { icon: "💰", titulo: "Seguimiento de ingresos", desc: "Registra la recaudación diaria por bus e importa archivos del sistema de pago electrónico. Sabe qué bus rinde más." },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{item.titulo}</div>
                <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ────────────────────────────────────────────── */}
      <section id="precios" style={{ padding: "5rem 2rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>Precios simples y transparentes</h2>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Sin contratos largos · Cancela cuando quieras</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {/* Plan Básico */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2rem" }}>
            <div style={{ fontSize: 13, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Plan Básico</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>$25.000</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>por mes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {["Hasta 5 buses", "Hasta 5 conductores", "Alertas por WhatsApp", "Control de turnos", "Soporte por WhatsApp"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d1d5db" }}>
                  <span style={{ color: "#10b981" }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href={whatsappLink("Hola, me interesa el Plan Básico de MicroLogist")} target="_blank" style={{ display: "block", textAlign: "center", padding: "0.8rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Contactar por WhatsApp
            </a>
          </div>

          {/* Plan Estándar */}
          <div style={{ background: "rgba(249,115,22,0.08)", border: "2px solid rgba(249,115,22,0.4)", borderRadius: 20, padding: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f97316, #ea580c)", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
              ⭐ Más popular
            </div>
            <div style={{ fontSize: 13, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Plan Estándar</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>$45.000</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" }}>por mes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {["Hasta 15 buses", "Hasta 15 conductores", "Alertas por WhatsApp", "Control de turnos", "Módulo de ingresos", "Importación CSV Bipay", "Soporte prioritario"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#d1d5db" }}>
                  <span style={{ color: "#f97316" }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href={whatsappLink("Hola, me interesa el Plan Estándar de MicroLogist")} target="_blank" style={{ display: "block", textAlign: "center", padding: "0.8rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "#4b5563", fontSize: 13, marginTop: "1.5rem" }}>
          ¿Tienes más de 15 buses? <a href={whatsappLink("Hola, tengo más de 15 buses y me interesa MicroLogist")} target="_blank" style={{ color: "#f97316" }}>Contáctanos para un plan personalizado</a>
        </p>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>
            Empieza hoy y evita tu próxima multa
          </h2>
          <p style={{ color: "#6b7280", fontSize: 16, marginBottom: "2rem" }}>
            Únete a los primeros transportistas de Viña del Mar, Valparaíso, Quilpué y Villa Alemana que gestionan su flota de forma digital.
          </p>
          <a href={whatsappLink("Hola, quiero empezar a usar MicroLogist para mi flota de buses")} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "1rem 2.5rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            📱 Escribir por WhatsApp
          </a>
          <p style={{ color: "#4b5563", fontSize: 13, marginTop: "1rem" }}>Te respondemos en menos de 1 hora · Lunes a viernes</p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "2rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: "1rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🚌</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>MicroLogist</span>
        </div>
        <p style={{ color: "#4b5563", fontSize: 13, marginBottom: 8 }}>Gestión de flotas para transportistas de la Región de Valparaíso</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 13 }}>
          <a href="/login" style={{ color: "#6b7280", textDecoration: "none" }}>Iniciar sesión</a>
          <a href="/registro" style={{ color: "#6b7280", textDecoration: "none" }}>Crear cuenta</a>
          <a href={whatsappLink("Hola, tengo una consulta sobre MicroLogist")} target="_blank" style={{ color: "#6b7280", textDecoration: "none" }}>Contacto</a>
        </div>
        <p style={{ color: "#374151", fontSize: 12, marginTop: "1rem" }}>© 2026 MicroLogist · Viña del Mar, Chile</p>
      </footer>
    </main>
  );
}
