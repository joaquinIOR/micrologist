"use client";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: "rgba(249,115,22,0.15)", lineHeight: 1, marginBottom: "0.5rem", letterSpacing: "-4px" }}>404</div>
        <div style={{ width: 48, height: 3, background: "linear-gradient(90deg,#f97316,#ea580c)", borderRadius: 2, margin: "0 auto 1.5rem" }} />
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: "0.75rem", letterSpacing: "-0.5px" }}>
          Página no encontrada
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: "2rem" }}>
          Esta ruta no existe en MicroLogist. Puede que el link esté roto o la página fue movida.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <a href="/dashboard" style={{ padding: "0.7rem 1.5rem", background: "linear-gradient(135deg,#f97316,#ea580c)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Ir al dashboard
          </a>
          <a href="/" style={{ padding: "0.7rem 1.5rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#9ca3af", fontSize: 14, textDecoration: "none" }}>
            Inicio
          </a>
        </div>
      </div>
    </main>
  );
}
