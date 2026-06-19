"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const input = {
  width: "100%", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff",
  fontSize: 14, outline: "none", boxSizing: "border-box",
};
const btn = {
  width: "100%", padding: "0.9rem", background: "linear-gradient(135deg, #f97316, #ea580c)",
  border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
};

export default function Recuperar() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => { document.title = "Recuperar contraseña | MicroLogist"; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.auth.recuperar({ email });
      setEnviado(true);
    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: "2.5rem" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>MicroLogist</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Gestión de flota urbana</div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔑</div>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>¿Olvidaste tu contraseña?</h1>
            <p style={{ color: "#6b7280", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Ingresa tu correo y te enviaremos un link de recuperación por WhatsApp.
            </p>
          </div>

          {enviado ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📲</div>
              <p style={{ color: "#10b981", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                ¡Listo! Revisa tu WhatsApp
              </p>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>
                Si el correo está registrado, recibirás el link en tu número de WhatsApp en segundos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", color: "#9ca3af", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={input}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "0.7rem 1rem", color: "#f87171", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Enviando..." : "Enviar link de recuperación"}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="/login" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>
            ← Volver al inicio de sesión
          </a>
        </div>
      </div>
    </main>
  );
}
