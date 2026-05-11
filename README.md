# 🚌 MicroLogist — MVP

Plataforma de gestión de flotas para transporte urbano.
Desarrollado en Viña del Mar, Chile.

---

## Estructura del Proyecto

```
micrologist/
├── backend/       → FastAPI + Python
└── frontend/      → Next.js
```

---

## 🐍 Backend (FastAPI)

### Requisitos
- Python 3.11+
- PostgreSQL 15+

### Instalación

```bash
cd backend

# 1. Crear entorno virtual
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus datos de PostgreSQL y Twilio

# 4. Crear base de datos en PostgreSQL
createdb micrologist

# 5. Iniciar servidor
uvicorn main:app --reload --port 8000
```

### Documentación API
Una vez iniciado, visita:
- Swagger UI: http://localhost:8000/docs
- ReDoc:       http://localhost:8000/redoc

---

## ⚛️ Frontend (Next.js)

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
cd frontend

# 1. Crear proyecto Next.js (solo primera vez)
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint

# 2. Copiar los archivos src/ de este repositorio

# 3. Configurar variables de entorno
cp .env.local.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en http://localhost:3000

---

## 🗄️ Modelos de Base de Datos

| Tabla        | Descripción                          |
|--------------|--------------------------------------|
| usuarios     | Dueños de flotas (autenticación)     |
| buses        | Vehículos con fechas de vencimiento  |
| conductores  | Conductores con licencias            |
| turnos       | Asignación conductor ↔ bus por fecha |

---

## 🔔 Alertas WhatsApp

Las alertas se envían via Twilio WhatsApp API.
Para desarrollo, usa el Sandbox de Twilio (gratuito).
Instrucciones: https://www.twilio.com/docs/whatsapp/sandbox

---

## 🚀 Deploy en Railway

1. Crear cuenta en railway.app
2. Nuevo proyecto → Deploy from GitHub
3. Agregar PostgreSQL como servicio
4. Configurar variables de entorno
5. Deploy automático en cada push

---

## 📋 Endpoints principales

| Método | Ruta                          | Descripción               |
|--------|-------------------------------|---------------------------|
| POST   | /auth/registro                | Registro de usuario       |
| POST   | /auth/login                   | Login → JWT token         |
| GET    | /buses                        | Listar buses              |
| POST   | /buses                        | Crear bus                 |
| GET    | /conductores                  | Listar conductores        |
| POST   | /conductores                  | Crear conductor           |
| GET    | /turnos?fecha=2025-05-06      | Turnos por fecha          |
| POST   | /turnos                       | Crear turno               |
| GET    | /alertas                      | Ver alertas activas       |
| POST   | /alertas/enviar-whatsapp      | Enviar alertas por WA     |
