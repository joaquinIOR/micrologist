from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, date
from collections import defaultdict
from app.database import get_db
from app.dependencies import get_current_user
from app.models.usuario import Usuario
from app.models.bus import Bus
from app.models.conductor import Conductor
from app.models.ingreso import Ingreso
from app.auth import hash_password, verify_password, create_access_token, create_reset_token, decode_reset_token
from twilio.rest import Client
from dotenv import load_dotenv
import os

load_dotenv()

# ── Rate limiting manual (sin dependencias extra) ─────────────────
_intentos: dict[str, dict[str, list[datetime]]] = defaultdict(lambda: defaultdict(list))

def _rate_limit(ip: str, endpoint: str, max_calls: int, window_min: int):
    ahora   = datetime.utcnow()
    ventana = ahora - timedelta(minutes=window_min)
    _intentos[endpoint][ip] = [t for t in _intentos[endpoint][ip] if t > ventana]
    if len(_intentos[endpoint][ip]) >= max_calls:
        raise HTTPException(status_code=429, detail=f"Demasiados intentos. Espera {window_min} minutos.")
    _intentos[endpoint][ip].append(ahora)

def _reset_rate_limit(ip: str, endpoint: str):
    _intentos[endpoint].pop(ip, None)

# ── WhatsApp ──────────────────────────────────────────────────────
def _enviar_whatsapp(telefono: str, mensaje: str):
    sid   = os.getenv("TWILIO_ACCOUNT_SID")
    token = os.getenv("TWILIO_AUTH_TOKEN")
    from_ = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")
    if not sid or not token:
        print(f"[WhatsApp simulado] → {telefono}: {mensaje}")
        return
    try:
        Client(sid, token).messages.create(body=mensaje, from_=from_, to=f"whatsapp:{telefono}")
    except Exception as e:
        print(f"Error enviando WhatsApp: {e}")

# ── Seed de datos de ejemplo ──────────────────────────────────────
async def _seed_datos_ejemplo(db: AsyncSession, owner_id: int):
    hoy = date.today()
    buses = [
        Bus(owner_id=owner_id, patente="BCTK-21", marca="Mercedes", modelo="OF-1721", anio=2018,
            recorrido="Viña - Valparaíso",
            revision_tecnica=hoy + timedelta(days=180),
            soap=hoy + timedelta(days=120),
            permiso_circulacion=hoy + timedelta(days=90)),
        Bus(owner_id=owner_id, patente="GFPR-43", marca="Volvo", modelo="B8R", anio=2019,
            recorrido="Quilpué - Villa Alemana",
            revision_tecnica=hoy + timedelta(days=25),
            soap=hoy + timedelta(days=95),
            permiso_circulacion=hoy + timedelta(days=60)),
        Bus(owner_id=owner_id, patente="RNWK-89", marca="Marcopolo", modelo="G7", anio=2016,
            recorrido="Viña - Concón",
            revision_tecnica=hoy - timedelta(days=15),
            soap=hoy + timedelta(days=8),
            permiso_circulacion=hoy + timedelta(days=45)),
        Bus(owner_id=owner_id, patente="LMPQ-02", marca="Agrale", modelo="MA 10.0", anio=2020,
            recorrido="Quilpué Express",
            revision_tecnica=hoy + timedelta(days=95),
            soap=hoy + timedelta(days=65),
            permiso_circulacion=hoy + timedelta(days=30)),
    ]
    conductores = [
        Conductor(owner_id=owner_id, nombre="Juan Pérez",     rut="12.345.678-9", tipo_licencia="A3",
                  vencimiento_licencia=hoy + timedelta(days=240)),
        Conductor(owner_id=owner_id, nombre="María Rojas",    rut="15.678.901-2", tipo_licencia="A3",
                  vencimiento_licencia=hoy + timedelta(days=20)),
        Conductor(owner_id=owner_id, nombre="Carlos Fuentes", rut="18.234.567-8", tipo_licencia="A2",
                  vencimiento_licencia=hoy + timedelta(days=365)),
    ]
    for b in buses:
        db.add(b)
    for c in conductores:
        db.add(c)
    await db.flush()  # obtener IDs de buses antes de crear ingresos

    # Ingresos de los últimos 7 días (lun-sáb)
    montos = {
        buses[0].id: [48500, 51000, 46000, 62000, 54000, 49000, 0],
        buses[1].id: [52000, 55000, 50000, 58000, 57000, 53000, 0],
        buses[2].id: [44000, 47000, 42000, 53000, 49000, 45000, 0],
        buses[3].id: [55000, 58000, 53000, 67000, 61000, 57000, 0],
    }
    for i in range(7):
        dia = hoy - timedelta(days=i)
        if dia.weekday() == 6:  # domingo, sin ingreso
            continue
        for bus in buses:
            monto = montos[bus.id][i]
            if monto:
                db.add(Ingreso(
                    owner_id=owner_id,
                    bus_id=bus.id,
                    fecha=dia,
                    recorrido=bus.recorrido,
                    monto=monto,
                    total_pasajeros=int(monto / 850),
                ))
    await db.commit()

# ── Router ────────────────────────────────────────────────────────
router = APIRouter(prefix="/auth", tags=["Autenticación"])

class RegistroSchema(BaseModel):
    nombre:   str
    email:    EmailStr
    password: str
    empresa:  str | None = None
    ciudad:   str | None = None
    telefono: str | None = None

class LoginSchema(BaseModel):
    email:    EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    usuario: dict

@router.post("/registro", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def registro(data: RegistroSchema, request: Request, db: AsyncSession = Depends(get_db)):
    _rate_limit(request.client.host, "registro", 5, 10)

    existing = await db.execute(select(Usuario).where(Usuario.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    user = Usuario(
        nombre   = data.nombre,
        email    = data.email,
        password = hash_password(data.password),
        empresa  = data.empresa,
        ciudad   = data.ciudad,
        telefono = data.telefono,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    await _seed_datos_ejemplo(db, user.id)

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "usuario": {"id": user.id, "nombre": user.nombre, "email": user.email,
                    "empresa": user.empresa, "plan": user.plan},
    }

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginSchema, request: Request, db: AsyncSession = Depends(get_db)):
    _rate_limit(request.client.host, "login", 5, 5)

    result = await db.execute(select(Usuario).where(Usuario.email == data.email))
    user   = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    if not user.activo:
        raise HTTPException(status_code=403, detail="Cuenta desactivada")

    _reset_rate_limit(request.client.host, "login")
    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "usuario": {"id": user.id, "nombre": user.nombre, "email": user.email,
                    "empresa": user.empresa, "plan": user.plan},
    }

@router.get("/perfil")
async def obtener_perfil(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    return {
        "id":       current.id,
        "nombre":   current.nombre,
        "email":    current.email,
        "empresa":  current.empresa,
        "ciudad":   current.ciudad,
        "telefono": current.telefono,
        "plan":     current.plan,
    }

class ActualizarPerfilSchema(BaseModel):
    nombre:   str | None = None
    empresa:  str | None = None
    ciudad:   str | None = None
    telefono: str | None = None

@router.put("/perfil")
async def actualizar_perfil(
    data:    ActualizarPerfilSchema,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(current, field, value)
    await db.commit()
    await db.refresh(current)
    return {
        "id":       current.id,
        "nombre":   current.nombre,
        "email":    current.email,
        "empresa":  current.empresa,
        "ciudad":   current.ciudad,
        "telefono": current.telefono,
        "plan":     current.plan,
    }

class RecuperarSchema(BaseModel):
    email: EmailStr

class NuevaPasswordSchema(BaseModel):
    token:    str
    password: str

@router.post("/recuperar")
async def recuperar_password(
    data:             RecuperarSchema,
    request:          Request,
    background_tasks: BackgroundTasks,
    db:               AsyncSession = Depends(get_db),
):
    _rate_limit(request.client.host, "recuperar", 3, 10)

    result = await db.execute(select(Usuario).where(Usuario.email == data.email))
    user   = result.scalar_one_or_none()

    respuesta = {"ok": True, "mensaje": "Si el correo está registrado, recibirás el link por WhatsApp"}

    if not user or not user.activo or not user.telefono:
        return respuesta

    token     = create_reset_token({"sub": str(user.id), "ph": user.password[-8:]})
    frontend  = os.getenv("FRONTEND_URL", "http://localhost:3000")
    reset_url = f"{frontend}/reset?token={token}"
    mensaje   = (
        f"🔑 *MicroLogist — Recuperar contraseña*\n\n"
        f"Hola {user.nombre}, haz clic en este link para crear una nueva contraseña:\n"
        f"{reset_url}\n\n"
        f"_Expira en 1 hora. Si no lo solicitaste, ignora este mensaje._"
    )
    background_tasks.add_task(_enviar_whatsapp, user.telefono, mensaje)
    return respuesta

@router.post("/nueva-password")
async def nueva_password(data: NuevaPasswordSchema, db: AsyncSession = Depends(get_db)):
    payload = decode_reset_token(data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    result = await db.execute(select(Usuario).where(Usuario.id == int(payload["sub"])))
    user   = result.scalar_one_or_none()

    if not user or user.password[-8:] != payload.get("ph"):
        raise HTTPException(status_code=400, detail="Token inválido o ya utilizado")

    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres")

    user.password = hash_password(data.password)
    await db.commit()
    return {"ok": True, "mensaje": "Contraseña actualizada correctamente"}
