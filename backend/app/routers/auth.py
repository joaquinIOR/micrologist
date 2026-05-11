from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.dependencies import get_current_user
from app.models.usuario import Usuario
from app.auth import hash_password, verify_password, create_access_token

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
        "usuario": {"id": user.id, "nombre": user.nombre, "email": user.email, "empresa": user.empresa}
    }

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Usuario).where(Usuario.email == data.email))
    user   = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    if not user.activo:
        raise HTTPException(status_code=403, detail="Cuenta desactivada")

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {"id": user.id, "nombre": user.nombre, "email": user.email, "empresa": user.empresa}
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
    }