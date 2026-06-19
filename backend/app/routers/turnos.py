from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from app.database import get_db
from app.models.turno import Turno, TipoTurno
from app.models.bus import Bus
from app.models.conductor import Conductor
from app.models.usuario import Usuario
from app.dependencies import get_current_user

router = APIRouter(prefix="/turnos", tags=["Turnos"])

# --- Schemas ---
class TurnoCreate(BaseModel):
    bus_id:       int
    conductor_id: int
    fecha:        date
    tipo:         TipoTurno = TipoTurno.manana
    hora_inicio:  Optional[time] = None
    hora_fin:     Optional[time] = None
    notas:        Optional[str] = None

class TurnoResponse(BaseModel):
    id:           int
    bus_id:       int
    conductor_id: int
    fecha:        date
    tipo:         TipoTurno
    hora_inicio:  Optional[time]
    hora_fin:     Optional[time]
    notas:        Optional[str]
    bus_patente:  Optional[str] = None
    conductor_nombre: Optional[str] = None

    class Config:
        from_attributes = True

async def validate_ownership(db: AsyncSession, owner_id: int, bus_id: int, conductor_id: int):
    """Verifica que el bus y conductor pertenezcan al usuario."""
    bus_r = await db.execute(select(Bus).where(Bus.id == bus_id, Bus.owner_id == owner_id))
    if not bus_r.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Bus no encontrado o no te pertenece")

    cond_r = await db.execute(select(Conductor).where(Conductor.id == conductor_id, Conductor.owner_id == owner_id))
    if not cond_r.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Conductor no encontrado o no te pertenece")

# --- Endpoints ---
@router.get("/", response_model=list[TurnoResponse])
async def listar_turnos(
    fecha:   Optional[date] = None,
    db:      AsyncSession   = Depends(get_db),
    current: Usuario        = Depends(get_current_user),
):
    # Obtener IDs de buses del usuario
    buses_r = await db.execute(select(Bus.id).where(Bus.owner_id == current.id))
    bus_ids = [r[0] for r in buses_r.all()]

    query = select(Turno).where(Turno.bus_id.in_(bus_ids))
    if fecha:
        query = query.where(Turno.fecha == fecha)

    query = query.options(selectinload(Turno.bus), selectinload(Turno.conductor))
    result = await db.execute(query)
    turnos = result.scalars().all()

    return [
        {**t.__dict__, "bus_patente": t.bus.patente, "conductor_nombre": t.conductor.nombre}
        for t in turnos
    ]

@router.post("/", response_model=TurnoResponse, status_code=status.HTTP_201_CREATED)
async def crear_turno(
    data:    TurnoCreate,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    await validate_ownership(db, current.id, data.bus_id, data.conductor_id)

    bus_dup = await db.execute(
        select(Turno).where(Turno.bus_id == data.bus_id, Turno.fecha == data.fecha, Turno.tipo == data.tipo)
    )
    if bus_dup.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Este bus ya tiene un turno asignado en esa fecha y tipo")

    cond_dup = await db.execute(
        select(Turno).where(Turno.conductor_id == data.conductor_id, Turno.fecha == data.fecha, Turno.tipo == data.tipo)
    )
    if cond_dup.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Este conductor ya tiene un turno asignado en esa fecha y tipo")

    turno = Turno(**data.model_dump())
    db.add(turno)
    await db.commit()
    await db.refresh(turno)

    # Recargar con relaciones
    result = await db.execute(
        select(Turno).where(Turno.id == turno.id)
        .options(selectinload(Turno.bus), selectinload(Turno.conductor))
    )
    turno = result.scalar_one()
    return {**turno.__dict__, "bus_patente": turno.bus.patente, "conductor_nombre": turno.conductor.nombre}

@router.delete("/{turno_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_turno(
    turno_id: int,
    db:       AsyncSession = Depends(get_db),
    current:  Usuario      = Depends(get_current_user),
):
    buses_r = await db.execute(select(Bus.id).where(Bus.owner_id == current.id))
    bus_ids = [r[0] for r in buses_r.all()]

    result = await db.execute(select(Turno).where(Turno.id == turno_id, Turno.bus_id.in_(bus_ids)))
    turno  = result.scalar_one_or_none()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    await db.delete(turno)
    await db.commit()
