"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass]   = useState(false);

  useEffect(() => {
    document.title = "Iniciar sesión | MicroLogist";
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.message.toLowerCase().includes("incorrectos") || err.message.includes("401")) {
        setError("Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.");
      } else {
        setError(err.message || "Ocurrió un error. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%",
    padding: "0.75rem 1rem",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${focused ? "#f97316" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  });

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", fontFamily: "sans-serif" }}>

      {/* Panel izquierdo — formulario */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2.5rem" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>MicroLogist</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>Gestión de flota urbana</div>
            </div>
          </div>

          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.5px" }}>
            Tus rutas te esperan
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: "1.8rem", lineHeight: 1.5 }}>
            Ingresa a tu panel para monitorear y gestionar tu flota de hoy.
          </p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem 1rem", color: "#f87171", fontSize: 13, marginBottom: "1rem", display: "flex", gap: 8 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6, fontWeight: 500 }}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.cl"
              autoFocus
              autoComplete="email"
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
              style={inputStyle(focusEmail)}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6, fontWeight: 500 }}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                onFocus={() => setFocusPass(true)}
                onBlur={() => setFocusPass(false)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ ...inputStyle(focusPass), paddingRight: "2.8rem" }}
              />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 16, padding: 0 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <a href="/recuperar" style={{ color: "#f97316", fontSize: 12, textDecoration: "none" }}>¿Olvidaste tu contraseña?</a>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "0.85rem", background: loading ? "rgba(249,115,22,0.5)" : "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Ingresando..." : "Ir a mi flota →"}
          </button>

          <p style={{ color: "#4b5563", fontSize: 13, textAlign: "center", marginTop: "1.5rem" }}>
            ¿Nuevo en MicroLogist?{" "}
            <a href="/registro" style={{ color: "#f97316", fontWeight: 600 }}>Crea tu cuenta gratis →</a>
          </p>
        </div>
      </div>

      {/* Panel derecho — solo escritorio */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(10,14,26,0.95))", borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.12) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 380, textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "1rem" }}>
            Control total de tu flota
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.7, marginBottom: "2rem" }}>
            Gestiona buses, conductores y turnos desde tu celular. Recibe alertas por WhatsApp antes de que venza cualquier documento.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🔔", texto: "Alertas automáticas por WhatsApp" },
              { icon: "🚦", texto: "Semáforo de documentos en tiempo real" },
              { icon: "👨‍✈️", texto: "Gestión de conductores y turnos" },
              { icon: "💰", texto: "Control de ingresos por bus" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "0.75rem 1rem", textAlign: "left" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ color: "#d1d5db", fontSize: 13 }}>{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { main > div:last-child { display: none !important; } }`}</style>
    </main>
  );
}