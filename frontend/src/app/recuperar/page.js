"use client";
import { useEffect } from "react";

const WHATSAPP_NUMBER = "56939680565";

export default function Recuperar() {
  useEffect(() => {
    document.title = "Recuperar contraseña | MicroLogist";
  }, []);

  const mensaje = encodeURIComponent("Hola, olvidé mi contraseña de MicroLogist y necesito recuperar mi cuenta.");
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "2.5rem" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>MicroLogist</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Gestión de flota urbana</div>
          </div>
        </div>

        {/* Ícono */}
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: 28 }}>
          🔑
        </div>

        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" }}>
          ¿Olvidaste tu contraseña?
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: "2rem" }}>
          No te preocupes. Escríbenos por WhatsApp y te ayudamos a recuperar tu cuenta en minutos.
        </p>

        {/* Botón WhatsApp */}
        
          href={whatsappLink}
          target="_blank"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "0.9rem", background: "#25d366", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", marginBottom: "1rem", boxSizing: "border-box" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contactar por WhatsApp
        </a>

        {/* Info adicional */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem", textAlign: "left" }}>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8, fontWeight: 600 }}>¿Qué necesitas tener a mano?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "El correo con el que te registraste",
              "El nombre de tu empresa",
              "Tu número de teléfono registrado",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                <span style={{ color: "#10b981" }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>

        <a href="/login" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>
          ← Volver al inicio de sesión
        </a>
      </div>
    </main>
  );
}