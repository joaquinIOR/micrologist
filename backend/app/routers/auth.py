from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from collections import defaultdict
from app.database import get_db
from app.dependencies import get_current_user
from app.models.usuario import Usuario
from app.auth import hash_password, verify_password, create_access_token, create_reset_token, decode_reset_token
from twilio.rest import Client
from dotenv import load_dotenv
import os

_intentos: dict[str, list[datetime]] = defaultdict(list)

def _check_rate_limit(ip: str):
    ahora   = datetime.utcnow()
    ventana = ahora - timedelta(minutes=5)
    _intentos[ip] = [t for t in _intentos[ip] if t > ventana]
    if len(_intentos[ip]) >= 5:
        raise HTTPException(status_code=429, detail="Demasiados intentos. Espera 5 minutos.")
    _intentos[ip].append(ahora)

load_dotenv()

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

router = APIRouter(prefix="/auth", tags=["Autenticación"])

# --- Schemas ---
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

# --- Endpoints ---
@router.post("/registro", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def registro(data: RegistroSchema, db: AsyncSession = Depends(get_db)):
    # Verificar si el email ya existe
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

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {"id": user.id, "nombre": user.nombre, "email": user.email, "empresa": user.empresa, "plan": user.plan}
    }

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginSchema, request: Request, db: AsyncSession = Depends(get_db)):
    _check_rate_limit(request.client.host)

    result = await db.execute(select(Usuario).where(Usuario.email == data.email))
    user   = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    if not user.activo:
        raise HTTPException(status_code=403, detail="Cuenta desactivada")

    _intentos.pop(request.client.host, None)  # login exitoso → resetear contador
    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {"id": user.id, "nombre": user.nombre, "email": user.email, "empresa": user.empresa, "plan": user.plan}
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

# --- Recuperación de contraseña ---

class RecuperarSchema(BaseModel):
    email: EmailStr

class NuevaPasswordSchema(BaseModel):
    token:    str
    password: str

@router.post("/recuperar")
async def recuperar_password(
    data:             RecuperarSchema,
    background_tasks: BackgroundTasks,
    db:               AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Usuario).where(Usuario.email == data.email))
    user   = result.scalar_one_or_none()

    # Siempre responde igual para no revelar si el email existe
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
async def nueva_password(
    data: NuevaPasswordSchema,
    db:   AsyncSession = Depends(get_db),
):
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