"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function ResetForm() {
  const params  = useSearchParams();
  const token   = params.get("token") || "";

  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [exito,     setExito]     = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => { document.title = "Nueva contraseña | MicroLogist"; }, []);

  if (!token) return (
    <div style={{ textAlign: "center", color: "#f87171", fontSize: 14 }}>
      Link inválido. <a href="/recuperar" style={{ color: "#f97316" }}>Solicita uno nuevo</a>.
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) return setError("Las contraseñas no coinciden");
    if (password.length < 6)    return setError("Mínimo 6 caracteres");
    setLoading(true);
    setError("");
    try {
      await api.auth.nuevaPassword({ token, password });
      setExito(true);
    } catch (err) {
      setError(err.message || "Token inválido o expirado");
    } finally {
      setLoading(false);
    }
  };

  return exito ? (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
      <p style={{ color: "#10b981", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>¡Contraseña actualizada!</p>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
      <a href="/login" style={{ ...btn, display: "block", textAlign: "center", textDecoration: "none", padding: "0.9rem" }}>
        Ir al inicio de sesión
      </a>
    </div>
  ) : (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", color: "#9ca3af", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Nueva contraseña
        </label>
        <input type="password" placeholder="Mínimo 6 caracteres" value={password}
          onChange={e => setPassword(e.target.value)} required style={input} />
      </div>
      <div>
        <label style={{ display: "block", color: "#9ca3af", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Confirmar contraseña
        </label>
        <input type="password" placeholder="Repite la contraseña" value={password2}
          onChange={e => setPassword2(e.target.value)} required style={input} />
      </div>
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "0.7rem 1rem", color: "#f87171", fontSize: 13 }}>
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Guardando..." : "Guardar nueva contraseña"}
      </button>
    </form>
  );
}

export default function ResetPage() {
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
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Nueva contraseña</h1>
            <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Elige una contraseña segura para tu cuenta.</p>
          </div>
          <Suspense fallback={<div style={{ color: "#6b7280", textAlign: "center" }}>Cargando...</div>}>
            <ResetForm />
          </Suspense>
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
