const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401 && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(error.detail || "Error en la solicitud");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  auth: {
    login:          (data) => request("/auth/login",           { method: "POST", body: JSON.stringify(data) }),
    registro:       (data) => request("/auth/registro",        { method: "POST", body: JSON.stringify(data) }),
    recuperar:      (data) => request("/auth/recuperar",       { method: "POST", body: JSON.stringify(data) }),
    nuevaPassword:  (data) => request("/auth/nueva-password",  { method: "POST", body: JSON.stringify(data) }),
  },
  buses: {
    listar:     (skip = 0, limit = 50) => request(`/buses?skip=${skip}&limit=${limit}`),
    obtener:    (id)                   => request(`/buses/${id}`),
    crear:      (data)                 => request("/buses",       { method: "POST", body: JSON.stringify(data) }),
    actualizar: (id, data)             => request(`/buses/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
    eliminar:   (id)                   => request(`/buses/${id}`, { method: "DELETE" }),
  },
  conductores: {
    listar:     (skip = 0, limit = 50) => request(`/conductores?skip=${skip}&limit=${limit}`),
    obtener:    (id)                   => request(`/conductores/${id}`),
    crear:      (data)                 => request("/conductores",       { method: "POST", body: JSON.stringify(data) }),
    actualizar: (id, data)             => request(`/conductores/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
    eliminar:   (id)                   => request(`/conductores/${id}`, { method: "DELETE" }),
  },
  turnos: {
    listar:  (fecha) => request(`/turnos${fecha ? `?fecha=${fecha}` : ""}`),
    crear:   (data)  => request("/turnos", { method: "POST", body: JSON.stringify(data) }),
    eliminar:(id)    => request(`/turnos/${id}`, { method: "DELETE" }),
  },
  alertas: {
    obtener:        () => request("/alertas"),
    enviarWhatsApp: () => request("/alertas/enviar-whatsapp", { method: "POST" }),
  },
  perfil: {
    obtener:    ()     => request("/auth/perfil"),
    actualizar: (data) => request("/auth/perfil", { method: "PUT", body: JSON.stringify(data) }),
  },
  ingresos: {
    listar: (params = {}) => {
      const q = new URLSearchParams();
      if (params.fecha_desde) q.append("fecha_desde", params.fecha_desde);
      if (params.fecha_hasta) q.append("fecha_hasta", params.fecha_hasta);
      if (params.bus_id)      q.append("bus_id", params.bus_id);
      return request(`/ingresos?${q.toString()}`);
    },
    resumen:  ()     => request("/ingresos/resumen"),
    crear:      (data)     => request("/ingresos",       { method: "POST",   body: JSON.stringify(data) }),
    actualizar: (id, data) => request(`/ingresos/${id}`, { method: "PUT",    body: JSON.stringify(data) }),
    eliminar:   (id)       => request(`/ingresos/${id}`, { method: "DELETE" }),
    importarCSV: async (file, cols = {}) => {
      const token = localStorage.getItem("token");
      const form  = new FormData();
      form.append("file", file);
      const params = new URLSearchParams({
        col_fecha:     cols.fecha     || "fecha",
        col_monto:     cols.monto     || "monto",
        col_patente:   cols.patente   || "patente",
        col_pasajeros: cols.pasajeros || "pasajeros",
        col_recorrido: cols.recorrido || "recorrido",
      });
      const res = await fetch(`${API_URL}/ingresos/importar-csv?${params}`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Error desconocido" }));
        throw new Error(err.detail || "Error al importar");
      }
      return res.json();
    },
  },
  admin: {
    stats:       ()             => request("/admin/stats"),
    usuarios:    ()             => request("/admin/usuarios"),
    cambiarPlan:     (id, plan) => request(`/admin/usuarios/${id}/plan`, { method: "PUT", body: JSON.stringify({ plan }) }),
    eliminarUsuario: (id)       => request(`/admin/usuarios/${id}`, { method: "DELETE" }),
    audit:           ()         => request("/admin/audit"),
  },
  reportes: {
    descargarPDF: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reportes/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al generar el reporte");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `reporte-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};