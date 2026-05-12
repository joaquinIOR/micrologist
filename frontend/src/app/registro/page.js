"use client";
import { useState } from "react";
import { api } from "@/lib/api";

const input = { width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
const label = { color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 6 };

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "", email: "", password: "", confirmar: "",
    empresa: "", ciudad: "", telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const guardar = async () => {
    if (!form.nombre || !form.email || !form.password) { setError("Nombre, correo y contraseña son obligatorios"); return; }
    if (form.password !== form.confirmar) { setError("Las contraseñas no coinciden"); return; }
    if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true); setError("");
    try {
      const res = await api.auth.registro({
        nombre:   form.nombre,
        email:    form.email,
        password: form.password,
        empresa:  form.empresa,
        ciudad:   form.ciudad,
        telefono: form.telefono,
      });
      localStorage.setItem("token",   res.access_token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", color: "#fff", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚌</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>MicroLogist</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Gestión de flota urbana</div>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Crear cuenta</h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: "1.8rem" }}>Empieza a gestionar tu flota gratis por 30 días</p>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", color: "#f87171", fontSize: 13, marginBottom: "1rem" }}>{error}</div>}

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div>
            <label style={label}>Nombre completo <span style={{ color: "#f97316" }}>*</span></label>
            <input style={input} placeholder="Juan Pérez" value={form.nombre} onChange={e => set("nombre", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={label}>Empresa / Nombre negocio</label>
              <input style={input} placeholder="Trans. Pérez Hnos." value={form.empresa} onChange={e => set("empresa", e.target.value)} />
            </div>
            <div>
              <label style={label}>Ciudad</label>
              <input style={input} placeholder="Viña del Mar" value={form.ciudad} onChange={e => set("ciudad", e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Teléfono / WhatsApp</label>
            <input style={input} placeholder="+56 9 1234 5678" value={form.telefono} onChange={e => set("telefono", e.target.value)} />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1rem" }}>
            <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Acceso</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={label}>Correo electrónico <span style={{ color: "#f97316" }}>*</span></label>
                <input style={input} type="email" placeholder="tucorreo@empresa.cl" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={label}>Contraseña <span style={{ color: "#f97316" }}>*</span></label>
                  <input style={input} type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} />
                </div>
                <div>
                  <label style={label}>Confirmar contraseña</label>
                  <input style={input} type="password" placeholder="••••••••" value={form.confirmar} onChange={e => set("confirmar", e.target.value)} onKeyDown={e => e.key === "Enter" && guardar()} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={guardar} disabled={loading} style={{ padding: "0.85rem", background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Creando cuenta..." : "Crear cuenta gratis →"}
          </button>
        </div>

        <p style={{ color: "#4b5563", fontSize: 12, textAlign: "center", marginTop: "1.5rem" }}>
          ¿Ya tienes cuenta? <a href="/" style={{ color: "#f97316" }}>Inicia sesión aquí</a>
        </p>
      </div>
    </main>
  );
}