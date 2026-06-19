# MicroLogist — Documentación de Proyecto de Título

**Institución:** DuocUC  
**Desarrolladora:** Melanie Orellana  
**Fecha:** Junio 2026  
**Versión:** MVP 0.1.0  
**Tecnologías:** FastAPI · PostgreSQL · Next.js · Twilio  

---

## 1. Objetivo General (Metodología SMART)

**Desarrollar una plataforma web MVP de gestión de flotas de transporte urbano que permita a dueños de microbuses registrar vehículos, conductores y turnos, y recibir alertas automáticas ante vencimientos de documentación, durante el primer semestre de 2026, en la región de Valparaíso.**

| Criterio | Descripción |
|----------|-------------|
| **S — Específico** | Plataforma web para gestión de flotas de transporte urbano: registro de buses, conductores, turnos, alertas de vencimiento y seguimiento de ingresos. |
| **M — Medible** | Implementación de al menos 5 módulos funcionales (autenticación, buses, conductores, turnos, alertas) con cobertura CRUD completa en backend y frontend. |
| **A — Alcanzable** | Desarrollo en stack conocido (Python/FastAPI, Next.js) con despliegue en Railway y Vercel, sin necesidad de infraestructura física propia. |
| **R — Relevante** | Responde a la necesidad real de dueños de flotas que gestionan vencimientos de documentos (SOAP, revisión técnica, permisos, licencias) mediante registros manuales o en papel, exponiéndose a multas evitables. |
| **T — Temporal** | MVP funcional entregado durante el primer semestre de 2026, con todas las funcionalidades documentadas y desplegadas en entorno productivo. |

---

## 2. Problemática

Los dueños de flotas de microbuses en Chile —especialmente en ciudades como Viña del Mar— administran sus vehículos y conductores de forma manual: planillas en papel, cuadernos o archivos Excel no centralizados.

Esta realidad genera los siguientes problemas:

- **Vencimientos desapercibidos:** La revisión técnica, el SOAP, el permiso de circulación y la licencia de conducir tienen fechas críticas. Sin un sistema de seguimiento, un documento vencido puede resultar en multas que van de $100.000 a $230.000 CLP por infracción.
- **Sin visibilidad del estado de la flota:** El dueño no tiene una vista consolidada del estado general de sus buses y conductores.
- **Asignación de turnos desorganizada:** La distribución de conductores a buses se hace de forma informal, sin registro histórico ni control de horarios.
- **Ingresos no registrados:** Los ingresos diarios por recorrido no se sistematizan, impidiendo análisis financiero básico.
- **Escalabilidad cero:** Cuando la flota crece, el sistema informal colapsa.

---

## 3. Solución Propuesta

MicroLogist es una plataforma web multi-tenant que permite a cada dueño de flota:

1. **Registrar su flota** de buses con datos técnicos y fechas de vencimiento de documentos.
2. **Gestionar conductores** con datos de contacto y vencimiento de licencias.
3. **Asignar turnos** conductor ↔ bus por fecha y tipo (mañana, tarde, noche, completo).
4. **Recibir alertas automáticas** calculadas en tiempo real mediante un sistema semáforo:
   - **Verde (OK):** documento vence en más de 30 días.
   - **Amarillo (Alerta):** vence en 30 días o menos.
   - **Rojo (Crítico):** documento ya venció.
5. **Enviar alertas por WhatsApp** al número del dueño via Twilio, con estimación de multas.
6. **Registrar ingresos** diarios por bus y recorrido, con resumen hoy / semana / mes.

Toda la información de cada usuario está aislada: un dueño solo ve sus propios buses, conductores y turnos.

---

## 4. Alcances

El sistema contempla las siguientes funcionalidades en su versión MVP:

| Módulo | Funcionalidades incluidas |
|--------|--------------------------|
| **Autenticación** | Registro, login, perfil editable. JWT con expiración de 24h. |
| **Buses** | CRUD completo. Registro de patente, marca, modelo, año, color, recorrido, y fechas de revisión técnica, SOAP y permiso de circulación. Estado (activo, inactivo, taller). Cálculo de semáforo automático. |
| **Conductores** | CRUD completo. Registro de nombre, RUT, teléfono, email, WhatsApp, tipo y vencimiento de licencia. Estado (activo, inactivo, con licencia médica). Semáforo de licencia. |
| **Turnos** | Crear y eliminar turnos. Asignación conductor ↔ bus por fecha y tipo. Filtro por fecha. Vista de turnos del día. |
| **Alertas** | Cálculo automático de alertas por vencimiento (buses y conductores). Envío por WhatsApp vía Twilio con resumen de multas estimadas. |
| **Ingresos** | Registro manual de ingresos diarios por bus. Importación desde CSV. Resumen financiero (hoy, semana, mes). Filtros por fecha y bus. |
| **Dashboard** | Vista consolidada con estadísticas de flota, alertas activas y accesos rápidos. Responsive (móvil y escritorio). |

---

## 5. Limitaciones

Las siguientes funcionalidades quedan fuera del alcance del MVP:

| Limitación | Justificación |
|------------|---------------|
| No hay gestión de roles ni múltiples usuarios por empresa | El MVP contempla un único usuario (dueño) por cuenta. |
| ~~No hay generación de reportes PDF~~ | **Implementado en v1.0** con fpdf2: endpoint `/reportes/pdf` genera PDF con estado de flota e ingresos del mes. |
| ~~Las alertas WhatsApp son manuales~~ | **Implementado en v1.0**: cron diario a las 08:00 en Oracle Cloud ejecuta `/alertas/enviar-automatico`. |
| No hay mapa de recorridos ni integración con GPS | Requiere integración con APIs de geolocalización fuera del alcance del proyecto de título. |
| No hay recuperación de contraseña funcional | La página `/recuperar` existe en el frontend pero el endpoint backend no está implementado. |
| Sin autenticación con proveedores externos (Google, etc.) | Solo login con email y contraseña. |
| Sin historial de cambios (auditoría) | No se registra quién modificó qué ni cuándo (más allá de `created_at` y `updated_at`). |

---

## 6. Patrón Arquitectónico

MicroLogist sigue una **arquitectura cliente-servidor en capas**, con separación estricta entre frontend y backend, comunicados a través de una API REST.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USUARIO FINAL                                  │
│                     (navegador / móvil)                                 │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │ HTTPS
              ┌─────────────▼──────────────┐
              │   Vercel (CDN global)       │
              │   Next.js 14 App Router     │
              │   JavaScript / React        │
              │   micrologist.vercel.app    │
              └─────────────┬──────────────┘
                            │ REST/JSON (HTTPS)
              ┌─────────────▼──────────────────────────────────────────┐
              │          Oracle Cloud A1 ARM — Always Free              │
              │               4 OCPUs · 24 GB RAM                      │
              │                                                         │
              │  ┌─────────────────────────────────────────────────┐   │
              │  │  Nginx (reverse proxy :80/:443)                  │   │
              │  └───────────────────┬─────────────────────────────┘   │
              │                      │ proxy_pass :8000                 │
              │  ┌───────────────────▼─────────────────────────────┐   │
              │  │  FastAPI (Python 3.11) — systemd                 │   │
              │  │  ┌──────────────────────────────────────────┐   │   │
              │  │  │ Routers: /auth /buses /conductores        │   │   │
              │  │  │         /turnos /alertas /ingresos        │   │   │
              │  │  │         /admin /reportes                  │   │   │
              │  │  ├──────────────────────────────────────────┤   │   │
              │  │  │ Lógica: semáforo, planes, JWT, rate-limit │   │   │
              │  │  ├──────────────────────────────────────────┤   │   │
              │  │  │ SQLAlchemy async + asyncpg                │   │   │
              │  │  └─────────────────┬────────────────────────┘   │   │
              │  └────────────────────┼────────────────────────────┘   │
              │                       │                                 │
              │  ┌────────────────────▼────────────────────────────┐   │
              │  │  PostgreSQL 15 (localhost)                       │   │
              │  │  Tablas: usuarios, buses, conductores,           │   │
              │  │          turnos, ingresos                        │   │
              │  └─────────────────────────────────────────────────┘   │
              │                                                         │
              │  crontab 08:00 → POST /alertas/enviar-automatico        │
              └────────────────────────────────────┬────────────────────┘
                                                   │ WhatsApp API
                                      ┌────────────▼─────────────┐
                                      │  Twilio (cloud)           │
                                      │  Mensajes WhatsApp        │
                                      └──────────────────────────┘
```

**Características del patrón:**

- **Separación de responsabilidades:** El frontend solo renderiza y consume la API; toda la lógica de negocio reside en el backend.
- **Multi-tenant por fila:** El aislamiento de datos entre usuarios se implementa filtrando por `owner_id` en cada consulta, sin bases de datos separadas.
- **Stateless backend:** El servidor no guarda sesión; la autenticación viaja en el JWT de cada request.
- **Asincronismo completo:** El backend usa `async/await` en todos los endpoints y la capa de base de datos (asyncpg), permitiendo alta concurrencia sin bloqueos.

---

## 7. Metodología de Desarrollo

Se utilizó una metodología **iterativa e incremental**, con entregas funcionales al final de cada ciclo, priorizando el camino crítico del MVP.

### Fases del desarrollo

| Fase | Actividades | Entregable |
|------|-------------|------------|
| **1. Análisis y diseño** | Levantamiento de requerimientos, definición de modelos de datos, diseño de la API | Diagrama de BD, contratos de endpoints |
| **2. Backend — Base** | Configuración de FastAPI, SQLAlchemy async, modelos de BD, autenticación JWT | API de auth funcionando con PostgreSQL |
| **3. Backend — Módulos** | Implementación de routers: buses, conductores, turnos, alertas, ingresos | API REST completa con Swagger documentado |
| **4. Frontend — Estructura** | Setup Next.js, App Router, `api.js`, páginas de auth | Login y registro funcionales |
| **5. Frontend — Dashboard** | Implementación de dashboard responsive, módulos de flota, conductores, turnos y alertas | MVP visual completo |
| **6. Frontend — Ingresos** | Módulo de ingresos con importación CSV | Módulo financiero funcional |
| **7. Integración** | Pruebas end-to-end, ajuste de CORS, variables de entorno, deploy | Aplicación en Railway + Vercel |

### Criterios de priorización (MoSCoW)

- **Must have:** Auth, buses CRUD, conductores CRUD, alertas de vencimiento, dashboard
- **Should have:** Turnos, ingresos básicos, envío WhatsApp
- **Could have:** Importación CSV, resumen financiero, perfil editable
- **Won't have (MVP):** Reportes PDF, roles, recuperación de contraseña, GPS

---

## 8. Vista 4+1 (Philippe Kruchten)

### Vista de Escenarios (+1) — Casos de Uso Principales

```
┌─────────────────────────────────────────────────────────┐
│                     CASOS DE USO                        │
├─────────────────────────────────────────────────────────┤
│  [Dueño de flota]                                       │
│    ├── Registrarse / Iniciar sesión                     │
│    ├── Registrar bus con documentos                     │
│    ├── Registrar conductor con licencia                 │
│    ├── Asignar conductor a bus (turno)                  │
│    ├── Ver alertas de vencimiento                       │
│    ├── Enviar alertas por WhatsApp                      │
│    └── Registrar / importar ingresos diarios            │
└─────────────────────────────────────────────────────────┘
```

---

### Vista Lógica — Componentes y Relaciones

```
┌──────────────────────────────────────────────────────────────┐
│                       DOMINIO                                │
│                                                              │
│   ┌──────────┐       ┌──────────┐      ┌──────────────┐    │
│   │ Usuario  │1─────N│   Bus    │      │  Conductor   │    │
│   │          │       │ patente  │      │  nombre      │    │
│   │ email    │1─────N│ soap     │      │  rut         │    │
│   │ empresa  │       │ rev_tec  │      │  licencia    │    │
│   │ telefono │1─────N│ perm_cir │      │  venc_lic    │    │
│   └──────────┘       │ estado   │      │  estado      │    │
│         │1           └────┬─────┘      └───────┬──────┘    │
│         │                 │N                    │N          │
│         │1─────N          └──────────┬──────────┘          │
│   ┌─────┴──────┐              ┌──────┴──────┐              │
│   │  Ingreso   │              │    Turno    │              │
│   │ monto      │              │  fecha      │              │
│   │ fecha      │              │  tipo       │              │
│   │ tipo_tarifa│              │  hora_ini   │              │
│   │ fuente     │              │  hora_fin   │              │
│   └────────────┘              └─────────────┘              │
└──────────────────────────────────────────────────────────────┘

Relaciones:
  - Usuario 1:N Bus        (un dueño tiene muchos buses)
  - Usuario 1:N Conductor  (un dueño tiene muchos conductores)
  - Usuario 1:N Ingreso    (un dueño tiene muchos ingresos)
  - Bus 1:N Turno          (un bus tiene muchos turnos)
  - Conductor 1:N Turno    (un conductor tiene muchos turnos)
  - Bus 1:N Ingreso        (un bus tiene muchos ingresos)
```

---

### Vista de Desarrollo — Estructura del Código

```
micrologist/
├── backend/                    # Python 3.11 / FastAPI
│   ├── main.py                 # Punto de entrada, CORS, routers
│   ├── requirements.txt
│   └── app/
│       ├── auth.py             # Argon2 hash, JWT sign/verify
│       ├── database.py         # Engine async, sesión, Base declarativa
│       ├── dependencies.py     # get_current_user (middleware JWT)
│       ├── models/             # SQLAlchemy ORM
│       │   ├── usuario.py
│       │   ├── bus.py
│       │   ├── conductor.py
│       │   ├── turno.py
│       │   └── ingreso.py
│       └── routers/            # Endpoints + Pydantic schemas
│           ├── auth.py         # /auth/registro /login /perfil
│           ├── buses.py        # /buses CRUD + semáforo
│           ├── conductores.py  # /conductores CRUD + semáforo licencia
│           ├── turnos.py       # /turnos CRUD + filtro fecha
│           ├── alertas.py      # /alertas cálculo + WhatsApp
│           └── ingresos.py     # /ingresos CRUD + CSV + resumen
│
└── frontend/                   # Next.js 14 / App Router
    └── src/
        ├── lib/
        │   └── api.js          # Cliente HTTP centralizado (Bearer token)
        └── app/
            ├── page.js         # Landing / redirect
            ├── login/
            ├── registro/
            ├── recuperar/
            └── dashboard/
                ├── page.js     # Dashboard principal (tabs)
                ├── buses/      # nuevo/ editar/
                ├── conductores/# nuevo/ editar/
                ├── turnos/     # nuevo/
                ├── ingresos/   # page.js, nuevo/
                └── perfil/
```

---

### Vista de Procesos — Flujo de una Petición Autenticada

```
Browser                 Next.js               FastAPI              PostgreSQL
  │                        │                     │                      │
  │── (1) Acción usuario ──►│                     │                      │
  │                        │── (2) fetch() ──────►│                      │
  │                        │   Authorization:     │                      │
  │                        │   Bearer <JWT>       │                      │
  │                        │                     │─(3) decode JWT ──────►│
  │                        │                     │    get_current_user   │
  │                        │                     │◄─ usuario válido ─────│
  │                        │                     │                      │
  │                        │                     │─(4) query filtrada ──►│
  │                        │                     │    WHERE owner_id=X   │
  │                        │                     │◄─ resultado ──────────│
  │                        │                     │                      │
  │                        │◄── (5) JSON 200 ────│                      │
  │◄── (6) render UI ──────│                     │                      │

Flujo de alertas WhatsApp (asíncrono):
  ├── (A) POST /alertas/enviar-whatsapp
  ├── (B) FastAPI responde 200 inmediato
  └── (C) BackgroundTask → Twilio API → WhatsApp del dueño
```

---

### Vista Física — Despliegue

```
                    INTERNET
                       │
          ┌────────────┼────────────┐
          │                         │
   ┌──────▼──────┐         ┌────────▼────────┐
   │   Vercel    │         │    Railway      │
   │  (Frontend) │         │   (Backend)     │
   │             │         │                 │
   │  Next.js    │◄───────►│  FastAPI        │
   │  CDN global │  HTTPS  │  Uvicorn        │
   │  .vercel.app│  REST   │  .railway.app   │
   └─────────────┘         └────────┬────────┘
                                    │ asyncpg
                           ┌────────▼────────┐
                           │  PostgreSQL 15  │
                           │  (Railway DB)   │
                           └─────────────────┘
                                    
                           ┌─────────────────┐
                           │  Twilio API     │
                           │  (WhatsApp)     │
                           └─────────────────┘

Variables de entorno (Railway):
  DATABASE_URL, SECRET_KEY, TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, FRONTEND_URL

Variables de entorno (Vercel):
  NEXT_PUBLIC_API_URL
```

---

## 9. Herramientas Utilizadas

| Herramienta | Versión | Rol en el proyecto |
|-------------|---------|-------------------|
| **Python** | 3.11 | Lenguaje del backend |
| **FastAPI** | 0.111 | Framework web async para la API REST. Genera documentación Swagger automática. |
| **SQLAlchemy** | 2.0 | ORM async para mapear modelos Python a tablas PostgreSQL. |
| **asyncpg** | 0.29 | Driver async de PostgreSQL. Permite conexiones concurrentes sin bloquear el event loop. |
| **Pydantic** | 2.7 | Validación y serialización de datos. Define los schemas de entrada/salida de cada endpoint. |
| **python-jose** | 3.3 | Generación y verificación de tokens JWT (HS256). |
| **passlib + argon2** | 1.7 / 23.1 | Hash seguro de contraseñas. Argon2 es el algoritmo ganador de la Password Hashing Competition. |
| **Twilio** | 9.1 | Envío de mensajes WhatsApp via API. Se usa en modo sandbox para desarrollo. |
| **python-dotenv** | 1.0 | Carga de variables de entorno desde `.env` sin exponerlas en el código. |
| **uvicorn** | 0.29 | Servidor ASGI para ejecutar FastAPI en producción. |
| **PostgreSQL** | 15 | Base de datos relacional. Elegida por su robustez, soporte de tipos de fecha, y disponibilidad en Railway. |
| **Next.js** | 14 | Framework React con App Router. Permite rutas file-based y rendering híbrido. |
| **React** | 18 | Biblioteca UI para construir componentes reactivos del dashboard. |
| **Tailwind CSS** | 3 | Utilidades CSS para estilos. Usado junto con estilos inline para el dark theme del dashboard. |
| **Railway** | — | Plataforma de deploy del backend y la base de datos PostgreSQL. |
| **Vercel** | — | Plataforma de deploy del frontend Next.js. CDN global. |
| **Git** | — | Control de versiones del proyecto. |

---

## 10. Funcionamiento del Sistema

### 10.1 Autenticación

1. El usuario se registra con nombre, email, contraseña, empresa y teléfono.
2. La contraseña se hashea con **Argon2** antes de guardarse en PostgreSQL.
3. Al iniciar sesión, FastAPI verifica el hash y devuelve un **JWT** firmado con HS256, válido por 24 horas.
4. El frontend guarda el token en `localStorage` y lo envía en el header `Authorization: Bearer <token>` en cada request.
5. El backend valida el token en cada endpoint protegido mediante la dependencia `get_current_user`.

### 10.2 Sistema Semáforo

El sistema calcula automáticamente el estado de cada documento al consultar buses y conductores. No se guarda el estado en la base de datos; se recalcula en cada petición para garantizar actualidad.

```
Días hasta vencimiento → Estado
  < 0     → CRÍTICO (rojo)  — documento vencido
  0 – 30  → ALERTA (amarillo) — vence pronto
  > 30    → OK (verde)
  sin fecha → SIN_FECHA (gris)
```

Para cada bus se evalúan tres documentos (revisión técnica, SOAP, permiso de circulación) y el semáforo final del bus es el peor de los tres.

### 10.3 Alertas y Multas Estimadas

El endpoint `GET /alertas` agrega todas las alertas activas (nivel alerta o crítico) del usuario autenticado, tanto de buses como de conductores, ordenadas con los críticos primero.

Cada alerta incluye la **multa estimada** en CLP según el tipo de documento:

| Documento | Multa estimada |
|-----------|---------------|
| Revisión técnica | $230.000 CLP |
| SOAP | $150.000 CLP |
| Permiso de circulación | $100.000 CLP |
| Licencia de conducir | $200.000 CLP |

El endpoint `POST /alertas/enviar-whatsapp` genera un resumen de texto con todas las alertas y lo envía por WhatsApp al número del dueño via Twilio, usando `BackgroundTasks` para no bloquear la respuesta HTTP.

### 10.4 Aislamiento de Datos (Multi-tenant)

Cada entidad (bus, conductor, turno, ingreso) tiene un campo `owner_id` que referencia al usuario dueño. Todas las consultas filtran por este campo, garantizando que un usuario nunca vea datos de otro:

```python
# Ejemplo: un usuario solo ve sus propios buses
select(Bus).where(Bus.owner_id == current.id)
```

Además, al crear un turno, el sistema valida que el bus y el conductor pertenezcan al mismo dueño antes de permitir la asignación.

---

## 11. Validaciones y CRUD

### 11.1 Validaciones de Entrada (Pydantic)

Todos los datos de entrada son validados automáticamente por Pydantic antes de llegar a la lógica del router.

| Campo | Validación |
|-------|-----------|
| `email` | Formato de email válido (`EmailStr`). Único en la base de datos. |
| `password` | String requerido (mínimo definido por el frontend). |
| `patente` | String requerido, máximo 10 caracteres. |
| `revision_tecnica`, `soap`, `permiso_circulacion` | Tipo `date` (YYYY-MM-DD). Opcionales. |
| `vencimiento_licencia` | Tipo `date`. Opcional. |
| `fecha` (turnos, ingresos) | Tipo `date`. Requerido. |
| `hora_inicio`, `hora_fin` | Tipo `time` (HH:MM:SS). Opcionales. |
| `monto` | Float requerido en ingresos. |
| `estado` (bus) | Enum: `activo`, `inactivo`, `taller`. |
| `estado` (conductor) | Enum: `activo`, `inactivo`, `licencia`. |
| `tipo` (turno) | Enum: `manana`, `tarde`, `noche`, `completo`. |

### 11.2 Validaciones de Negocio

| Regla | Implementación |
|-------|---------------|
| Email único al registrarse | `SELECT` previo antes del `INSERT`; devuelve HTTP 400 si ya existe. |
| Contraseña correcta al login | `verify_password()` con Argon2; devuelve HTTP 401 si no coincide. |
| Cuenta activa | Verificación de `usuario.activo`; devuelve HTTP 403 si está desactivada. |
| Pertenencia de recursos | Toda consulta de GET/PUT/DELETE filtra por `owner_id == current.id`; devuelve HTTP 404 si no pertenece. |
| Bus y conductor del mismo dueño en turnos | `validate_ownership()` verifica ambos antes de crear el turno. |
| Teléfono requerido para WhatsApp | El endpoint valida `current.telefono` antes de intentar enviar. |

### 11.3 CRUD por Módulo

#### Usuarios (Autenticación)

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Crear | POST | `/auth/registro` | Registra nuevo usuario, retorna JWT |
| Leer | GET | `/auth/perfil` | Obtiene datos del usuario autenticado |
| Actualizar | PUT | `/auth/perfil` | Actualiza nombre, empresa, ciudad, teléfono |
| Autenticar | POST | `/auth/login` | Login con email/password, retorna JWT |

#### Buses

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Crear | POST | `/buses/` | Crea bus con datos y fechas de documentos |
| Listar | GET | `/buses/` | Lista todos los buses del usuario con semáforo |
| Leer | GET | `/buses/{id}` | Obtiene un bus específico |
| Actualizar | PUT | `/buses/{id}` | Actualiza cualquier campo del bus |
| Eliminar | DELETE | `/buses/{id}` | Elimina el bus y sus turnos (cascade) |

#### Conductores

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Crear | POST | `/conductores/` | Crea conductor con datos y licencia |
| Listar | GET | `/conductores/` | Lista todos los conductores con semáforo de licencia |
| Leer | GET | `/conductores/{id}` | Obtiene un conductor específico |
| Actualizar | PUT | `/conductores/{id}` | Actualiza cualquier campo del conductor |
| Eliminar | DELETE | `/conductores/{id}` | Elimina el conductor y sus turnos (cascade) |

#### Turnos

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Crear | POST | `/turnos/` | Asigna conductor a bus en una fecha y tipo |
| Listar | GET | `/turnos/?fecha=YYYY-MM-DD` | Lista turnos, con filtro opcional por fecha |
| Eliminar | DELETE | `/turnos/{id}` | Elimina la asignación de turno |

#### Ingresos

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Crear | POST | `/ingresos/` | Registra ingreso manual |
| Listar | GET | `/ingresos/` | Lista ingresos con filtros de fecha y bus |
| Resumen | GET | `/ingresos/resumen` | Totales de hoy, semana y mes |
| Eliminar | DELETE | `/ingresos/{id}` | Elimina un registro de ingreso |
| Importar | POST | `/ingresos/importar-csv` | Importa ingresos desde archivo CSV |

#### Alertas

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Obtener | GET | `/alertas/` | Calcula y retorna todas las alertas activas |
| Enviar WhatsApp | POST | `/alertas/enviar-whatsapp` | Envía resumen de alertas por WhatsApp |

---

*Documentación generada en junio 2026 — MicroLogist MVP 0.1.0*
