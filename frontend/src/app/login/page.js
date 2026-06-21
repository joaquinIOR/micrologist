"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const EyeOpen  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const BusIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const ShieldIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MoneyIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass]   = useState(false);

  useEffect(() => { document.title = "Iniciar sesión | MicroLogist"; }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true); setError("");
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message.toLowerCase().includes("incorrectos") || err.message.includes("401")
        ? "Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo."
        : err.message || "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%", padding: "0.75rem 1rem",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${focused ? "#f97316" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 10, color: "#fff", fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border 0.2s",
  });

  const features = [
    { icon: <BellIcon />,   texto: "Alertas automáticas por WhatsApp" },
    { icon: <ShieldIcon />, texto: "Semáforo de documentos en tiempo real" },
    { icon: <UserIcon />,   texto: "Gestión de conductores y turnos" },
    { icon: <MoneyIcon />,  texto: "Control de ingresos por bus" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex" }}>

      {/* Panel izquierdo — formulario */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2.5rem" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BusIcon />
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
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: 10, padding: "0.9rem 1rem 0.9rem 1.1rem", color: "#fca5a5", fontSize: 13, marginBottom: "1rem", display: "flex", gap: 10, alignItems: "flex-start", animation: "shake 0.35s ease" }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠</span>
              <span style={{ lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }`}</style>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6, fontWeight: 500 }}>Correo electrónico</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.cl" autoFocus autoComplete="email"
              onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
              style={inputStyle(focusEmail)}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6, fontWeight: 500 }}>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                autoComplete="current-password"
                onFocus={() => setFocusPass(true)} onBlur={() => setFocusPass(false)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ ...inputStyle(focusPass), paddingRight: "2.8rem" }}
              />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", alignItems: "center", padding: 0 }}>
                {showPass ? <EyeOff /> : <EyeOpen />}
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
      <div style={{ flex: 1, background: "#0d1220", borderLeft: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 380, width: "100%" }}>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "0.5rem" }}>
            Control total de tu flota
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: "2rem" }}>
            Gestiona buses, conductores y turnos desde tu celular. Recibe alertas por WhatsApp antes de que venza cualquier documento.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "2rem" }}>
            {features.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "0.75rem 1rem" }}>
                <span style={{ color: "#f97316", display: "flex", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ color: "#d1d5db", fontSize: 13 }}>{item.texto}</span>
              </div>
            ))}
          </div>
          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { label: "Alertas evitadas", value: "847", color: "#10b981" },
              { label: "Multas ahorradas", value: "$12M", color: "#f97316" },
              { label: "Buses gestionados", value: "200+", color: "#3b82f6" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${s.color}`, borderRadius: 10, padding: "0.75rem" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { main > div:last-child { display: none !important; } }`}</style>
    </main>
  );
}
