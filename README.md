# MicroLogist

Plataforma SaaS de gestión de flotas de transporte urbano. Desarrollada en Viña del Mar, Chile como proyecto de título DuocUC.

**Deploy:** [micrologist.vercel.app](https://micrologist.vercel.app) · API: `https://micrologist.ddns.net`

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) · React 18 |
| Backend | FastAPI (Python 3.11) · Uvicorn |
| Base de datos | PostgreSQL 15 |
| Auth | JWT (HS256) · Argon2 |
| Mensajería | Twilio WhatsApp API |
| Servidor | Oracle Cloud A1 ARM (Always Free) · Nginx |
| Deploy frontend | Vercel |

---

## Estructura

```
micrologist/
├── backend/                    # FastAPI
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── auth.py             # Argon2 + JWT
│       ├── database.py         # SQLAlchemy async + asyncpg
│       ├── dependencies.py     # get_current_user
│       ├── models/
│       │   ├── usuario.py      # Multi-tenant base
│       │   ├── bus.py
│       │   ├── conductor.py
│       │   ├── turno.py
│       │   ├── ingreso.py
│       │   └── audit_log.py    # Registro de acciones admin
│       └── routers/
│           ├── auth.py         # /auth — registro, login, perfil, recuperar
│           ├── buses.py        # /buses — CRUD + semáforo
│           ├── conductores.py  # /conductores — CRUD + semáforo licencia
│           ├── turnos.py       # /turnos — CRUD + filtro por fecha
│           ├── alertas.py      # /alertas — cálculo + WhatsApp
│           ├── ingresos.py     # /ingresos — CRUD + CSV + resumen
│           ├── reportes.py     # /reportes — PDF con fpdf2
│           └── admin.py        # /admin — usuarios, planes, audit log
│
├── frontend/
│   └── src/
│       ├── lib/api.js          # Cliente HTTP centralizado
│       └── app/
│           ├── page.js         # Landing
│           ├── login/
│           ├── registro/
│           ├── recuperar/
│           ├── reset/
│           ├── admin/
│           └── dashboard/      # Módulos: buses, conductores, turnos, ingresos, alertas, perfil
│
└── deploy/
    ├── 1_setup.sh              # Ubuntu: dependencias, PostgreSQL, Python venv
    ├── 2_service.sh            # systemd service para FastAPI
    └── 3_nginx.sh              # Nginx reverse proxy + Certbot SSL
```

---

## Correr en local

### Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate        # Linux/Mac
.venv\Scripts\activate           # Windows

pip install -r requirements.txt

# Crear base de datos
createdb micrologist

# Variables de entorno
cp .env.example .env
# Editar .env (ver sección Variables de entorno)

uvicorn main:app --reload --port 8000
```

Docs disponibles en: http://localhost:8000/docs

### Frontend

```bash
cd frontend

npm install

# Variables de entorno
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

Frontend en: http://localhost:3000

---

## Variables de entorno

### Backend (`.env`)

```env
DATABASE_URL=postgresql+asyncpg://usuario:password@localhost/micrologist
SECRET_KEY=clave-secreta-larga-y-aleatoria
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
FRONTEND_URL=https://micrologist.vercel.app
ADMIN_EMAIL=j.orellanacan@gmail.com
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=https://micrologist.ddns.net
```

---

## Deploy en Oracle Cloud

```bash
# 1. En el servidor (Ubuntu 22.04 ARM)
sudo bash deploy/1_setup.sh

# 2. Configurar .env en /opt/micrologist/backend/.env

# 3. Servicio systemd
sudo bash deploy/2_service.sh

# 4. Nginx + SSL (requiere dominio apuntando al servidor)
sudo bash deploy/3_nginx.sh micrologist.ddns.net

# 5. Actualizar
cd /opt/micrologist && sudo git pull && sudo systemctl restart micrologist
```

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/registro` | Registro → JWT + seed de datos de ejemplo |
| POST | `/auth/login` | Login → JWT |
| GET | `/auth/perfil` | Perfil del usuario autenticado |
| PUT | `/auth/perfil` | Actualizar nombre/empresa/ciudad/teléfono |
| POST | `/auth/recuperar` | Envía link de recuperación por WhatsApp |
| POST | `/auth/nueva-password` | Resetea contraseña con token |
| GET | `/buses` | Listar buses con semáforo de documentos |
| POST | `/buses` | Crear bus |
| PUT | `/buses/{id}` | Actualizar bus |
| DELETE | `/buses/{id}` | Eliminar bus |
| GET | `/conductores` | Listar conductores con semáforo de licencia |
| POST | `/conductores` | Crear conductor |
| GET | `/turnos?fecha=YYYY-MM-DD` | Turnos del día |
| POST | `/turnos` | Asignar conductor a bus |
| GET | `/alertas` | Alertas activas (buses + conductores) |
| POST | `/alertas/enviar-whatsapp` | Enviar resumen por WhatsApp |
| GET | `/ingresos` | Listar ingresos con filtros |
| POST | `/ingresos` | Registrar ingreso |
| GET | `/ingresos/resumen` | Totales hoy / semana / mes |
| POST | `/ingresos/importar-csv` | Importar ingresos desde CSV |
| GET | `/reportes/pdf` | Generar reporte PDF |
| GET | `/admin/stats` | Estadísticas globales (admin) |
| GET | `/admin/usuarios` | Listar usuarios (admin) |
| PUT | `/admin/usuarios/{id}/plan` | Cambiar plan (admin) |
| DELETE | `/admin/usuarios/{id}` | Eliminar usuario (admin) |
| GET | `/admin/audit` | Log de acciones admin |

---

## Modelos de datos

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Dueños de flotas. Campo `plan`: gratis/basico/pro |
| `buses` | Vehículos con RT, SOAP y permiso de circulación |
| `conductores` | Conductores con tipo y vencimiento de licencia |
| `turnos` | Asignación conductor ↔ bus por fecha y tipo |
| `ingresos` | Ingresos diarios por bus y recorrido |
| `audit_logs` | Registro de acciones del panel admin |

Aislamiento multi-tenant: todas las tablas tienen `owner_id` (FK a `usuarios`). Cada query filtra por `owner_id == current_user.id`.

---

## Sistema semáforo

Estado calculado en tiempo real (nunca guardado en BD):

```
días hasta vencimiento → estado
  < 0          → CRITICO   (rojo)
  0 a 30       → ALERTA    (amarillo)
  > 30         → OK        (verde)
  sin fecha    → SIN_FECHA (gris)
```

Multas estimadas por documento vencido: RT $230.000 · SOAP $150.000 · Permiso $100.000 · Licencia $200.000 CLP.

---

*Proyecto de Título — DuocUC · Melanie Orellana · 2026*
