from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.database import get_db
from app.models.conductor import Conductor, EstadoConductor
from app.models.usuario import Usuario
from app.dependencies import get_current_user

router = APIRouter(prefix="/conductores", tags=["Conductores"])

# --- Schemas ---
class ConductorCreate(BaseModel):
    nombre:               str
    rut:                  Optional[str] = None
    telefono:             Optional[str] = None
    email:                Optional[str] = None
    whatsapp:             Optional[str] = None
    tipo_licencia:        Optional[str] = None
    vencimiento_licencia: Optional[date] = None
    notas:                Optional[str] = None

class ConductorUpdate(ConductorCreate):
    nombre: Optional[str] = None
    estado: Optional[EstadoConductor] = None

class ConductorResponse(BaseModel):
    id:                   int
    nombre:               str
    rut:                  Optional[str]
    telefono:             Optional[str]
    email:                Optional[str]
    whatsapp:             Optional[str]
    tipo_licencia:        Optional[str]
    vencimiento_licencia: Optional[date]
    estado:               EstadoConductor
    notas:                Optional[str]
    semaforo_licencia:    str  # ok | alerta | critico | sin_fecha

    class Config:
        from_attributes = True

def calcular_semaforo_licencia(fecha: Optional[date]) -> str:
    if not fecha:
        return "sin_fecha"
    from datetime import date as d
    dias = (fecha - d.today()).days
    if dias < 0:
        return "critico"
    elif dias <= 30:
        return "alerta"
    return "ok"

def conductor_to_response(c: Conductor) -> dict:
    return {**c.__dict__, "semaforo_licencia": calcular_semaforo_licencia(c.vencimiento_licencia)}

# --- Endpoints ---
@router.get("/", response_model=list[ConductorResponse])
async def listar_conductores(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    result = await db.execute(select(Conductor).where(Conductor.owner_id == current.id))
    return [conductor_to_response(c) for c in result.scalars().all()]

@router.post("/", response_model=ConductorResponse, status_code=status.HTTP_201_CREATED)
async def crear_conductor(
    data:    ConductorCreate,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    conductor = Conductor(**data.model_dump(), owner_id=current.id)
    db.add(conductor)
    await db.commit()
    await db.refresh(conductor)
    return conductor_to_response(conductor)

@router.get("/{conductor_id}", response_model=ConductorResponse)
async def obtener_conductor(
    conductor_id: int,
    db:           AsyncSession = Depends(get_db),
    current:      Usuario      = Depends(get_current_user),
):
    result = await db.execute(
        select(Conductor).where(Conductor.id == conductor_id, Conductor.owner_id == current.id)
    )
    conductor = result.scalar_one_or_none()
    if not conductor:
        raise HTTPException(status_code=404, detail="Conductor no encontrado")
    return conductor_to_response(conductor)

@router.put("/{conductor_id}", response_model=ConductorResponse)
async def actualizar_conductor(
    conductor_id: int,
    data:         ConductorUpdate,
    db:           AsyncSession = Depends(get_db),
    current:      Usuario      = Depends(get_current_user),
):
    result = await db.execute(
        select(Conductor).where(Conductor.id == conductor_id, Conductor.owner_id == current.id)
    )
    conductor = result.scalar_one_or_none()
    if not conductor:
        raise HTTPException(status_code=404, detail="Conductor no encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(conductor, field, value)

    await db.commit()
    await db.refresh(conductor)
    return conductor_to_response(conductor)

@router.delete("/{conductor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_conductor(
    conductor_id: int,
    db:           AsyncSession = Depends(get_db),
    current:      Usuario      = Depends(get_current_user),
):
    result = await db.execute(
        select(Conductor).where(Conductor.id == conductor_id, Conductor.owner_id == current.id)
    )
    conductor = result.scalar_one_or_none()
    if not conductor:
        raise HTTPException(status_code=404, detail="Conductor no encontrado")
    await db.delete(conductor)
    await db.commit()
