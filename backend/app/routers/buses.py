from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from datetime import date, datetime, timedelta
from typing import Optional
from app.database import get_db
from app.models.bus import Bus, EstadoBus
from app.models.usuario import Usuario
from app.dependencies import get_current_user

router = APIRouter(prefix="/buses", tags=["Buses"])

# --- Schemas ---
class BusCreate(BaseModel):
    patente:             str
    marca:               Optional[str] = None
    modelo:              Optional[str] = None
    anio:                Optional[int] = None
    color:               Optional[str] = None
    recorrido:           Optional[str] = None
    revision_tecnica:    Optional[date] = None
    soap:                Optional[date] = None
    permiso_circulacion: Optional[date] = None
    notas:               Optional[str] = None

class BusUpdate(BusCreate):
    patente: Optional[str] = None
    estado:  Optional[EstadoBus] = None

class BusResponse(BaseModel):
    id:                  int
    patente:             str
    marca:               Optional[str]
    modelo:              Optional[str]
    anio:                Optional[int]
    color:               Optional[str]
    recorrido:           Optional[str]
    revision_tecnica:    Optional[date]
    soap:                Optional[date]
    permiso_circulacion: Optional[date]
    estado:              EstadoBus
    notas:               Optional[str]
    semaforo:            str

    class Config:
        from_attributes = True

class BusListResponse(BaseModel):
    total: int
    items: list[BusResponse]

def calcular_semaforo(fecha: Optional[date]) -> str:
    """Calcula el estado semáforo según días hasta el vencimiento."""
    if not fecha:
        return "sin_fecha"
    hoy = date.today()
    dias = (fecha - hoy).days
    if dias < 0:
        return "critico"
    elif dias <= 30:
        return "alerta"
    return "ok"

def bus_to_response(bus: Bus) -> dict:
    estados = [
        calcular_semaforo(bus.revision_tecnica),
        calcular_semaforo(bus.soap),
        calcular_semaforo(bus.permiso_circulacion),
    ]
    if "critico" in estados:
        semaforo = "critico"
    elif "alerta" in estados:
        semaforo = "alerta"
    else:
        semaforo = "ok"
    return {**bus.__dict__, "semaforo": semaforo}

# --- Endpoints ---
@router.get("/", response_model=BusListResponse)
async def listar_buses(
    skip:    int          = Query(0, ge=0),
    limit:   int          = Query(50, ge=1, le=200),
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    base  = select(Bus).where(Bus.owner_id == current.id)
    total = (await db.execute(select(func.count()).select_from(base.subquery()))).scalar()
    buses = (await db.execute(base.offset(skip).limit(limit))).scalars().all()
    return {"total": total, "items": [bus_to_response(b) for b in buses]}

@router.post("/", response_model=BusResponse, status_code=status.HTTP_201_CREATED)
async def crear_bus(
    data:    BusCreate,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    bus = Bus(**data.model_dump(), owner_id=current.id)
    db.add(bus)
    await db.commit()
    await db.refresh(bus)
    return bus_to_response(bus)

@router.get("/{bus_id}", response_model=BusResponse)
async def obtener_bus(
    bus_id:  int,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    result = await db.execute(select(Bus).where(Bus.id == bus_id, Bus.owner_id == current.id))
    bus    = result.scalar_one_or_none()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus no encontrado")
    return bus_to_response(bus)

@router.put("/{bus_id}", response_model=BusResponse)
async def actualizar_bus(
    bus_id:  int,
    data:    BusUpdate,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    result = await db.execute(select(Bus).where(Bus.id == bus_id, Bus.owner_id == current.id))
    bus    = result.scalar_one_or_none()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus no encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(bus, field, value)

    await db.commit()
    await db.refresh(bus)
    return bus_to_response(bus)

@router.delete("/{bus_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_bus(
    bus_id:  int,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    result = await db.execute(select(Bus).where(Bus.id == bus_id, Bus.owner_id == current.id))
    bus    = result.scalar_one_or_none()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus no encontrado")
    await db.delete(bus)
    await db.commit()
