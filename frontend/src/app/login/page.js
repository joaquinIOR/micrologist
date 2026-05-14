"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "2.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚌</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>MicroLogist</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Gestión de flota urbana</div>
          </div>
        </div>

        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Bienvenido de vuelta</h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: "1.8rem" }}>Ingresa tus credenciales para continuar</p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 }}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tucorreo@empresa.cl"
            style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1.6rem" }}>
          <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "0.85rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
        >
          {loading ? "Ingresando..." : "Ingresar →"}
        </button>

        <p style={{ color: "#4b5563", fontSize: 12, textAlign: "center", marginTop: "1.5rem" }}>
          ¿No tienes cuenta? <a href="/registro" style={{ color: "#f97316" }}>Regístrate aquí</a>
        </p>
      </div>
    </main>
  );
}
