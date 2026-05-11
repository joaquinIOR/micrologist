from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from datetime import date
from typing import Optional
import csv
import io

from app.database import get_db
from app.models.ingreso import Ingreso, TipoTarifa, FuenteIngreso
from app.models.bus import Bus
from app.models.usuario import Usuario
from app.dependencies import get_current_user

router = APIRouter(prefix="/ingresos", tags=["Ingresos"])

# --- Schemas ---
class IngresoCreate(BaseModel):
    bus_id:          Optional[int]  = None
    fecha:           date
    recorrido:       Optional[str]  = None
    total_pasajeros: Optional[int]  = None
    monto:           float
    tipo_tarifa:     TipoTarifa     = TipoTarifa.completa
    notas:           Optional[str]  = None

class IngresoResponse(BaseModel):
    id:              int
    bus_id:          Optional[int]
    fecha:           date
    recorrido:       Optional[str]
    total_pasajeros: Optional[int]
    monto:           float
    tipo_tarifa:     TipoTarifa
    fuente:          str
    notas:           Optional[str]
    bus_patente:     Optional[str] = None

    class Config:
        from_attributes = True

# --- Helpers ---
async def get_bus_patente(db: AsyncSession, bus_id: Optional[int]) -> Optional[str]:
    if not bus_id:
        return None
    result = await db.execute(select(Bus).where(Bus.id == bus_id))
    bus = result.scalar_one_or_none()
    return bus.patente if bus else None

# --- Endpoints ---
@router.get("/", response_model=list[IngresoResponse])
async def listar_ingresos(
    fecha_desde: Optional[date] = None,
    fecha_hasta: Optional[date] = None,
    bus_id:      Optional[int]  = None,
    db:          AsyncSession   = Depends(get_db),
    current:     Usuario        = Depends(get_current_user),
):
    query = select(Ingreso).where(Ingreso.owner_id == current.id)
    if fecha_desde:
        query = query.where(Ingreso.fecha >= fecha_desde)
    if fecha_hasta:
        query = query.where(Ingreso.fecha <= fecha_hasta)
    if bus_id:
        query = query.where(Ingreso.bus_id == bus_id)
    query = query.order_by(Ingreso.fecha.desc())
    result = await db.execute(query)
    ingresos = result.scalars().all()
    items = []
    for i in ingresos:
        patente = await get_bus_patente(db, i.bus_id)
        items.append({**i.__dict__, "bus_patente": patente})
    return items

@router.get("/resumen")
async def resumen_ingresos(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    from datetime import datetime, timedelta
    hoy      = date.today()
    inicio_semana = hoy - timedelta(days=hoy.weekday())
    inicio_mes    = hoy.replace(day=1)

    async def total(desde, hasta):
        r = await db.execute(
            select(func.sum(Ingreso.monto), func.sum(Ingreso.total_pasajeros))
            .where(Ingreso.owner_id == current.id)
            .where(Ingreso.fecha >= desde)
            .where(Ingreso.fecha <= hasta)
        )
        row = r.first()
        return {"monto": row[0] or 0, "pasajeros": row[1] or 0}

    # Por bus
    buses_r = await db.execute(
        select(Bus.id, Bus.patente).where(Bus.owner_id == current.id)
    )
    buses = buses_r.all()
    por_bus = []
    for bus_id, patente in buses:
        r = await db.execute(
            select(func.sum(Ingreso.monto), func.sum(Ingreso.total_pasajeros))
            .where(Ingreso.owner_id == current.id)
            .where(Ingreso.bus_id == bus_id)
            .where(Ingreso.fecha >= inicio_mes)
        )
        row = r.first()
        por_bus.append({
            "bus_id":   bus_id,
            "patente":  patente,
            "monto":    row[0] or 0,
            "pasajeros": row[1] or 0,
        })

    return {
        "hoy":    await total(hoy, hoy),
        "semana": await total(inicio_semana, hoy),
        "mes":    await total(inicio_mes, hoy),
        "por_bus": sorted(por_bus, key=lambda x: x["monto"], reverse=True),
    }

@router.post("/", response_model=IngresoResponse, status_code=status.HTTP_201_CREATED)
async def crear_ingreso(
    data:    IngresoCreate,
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    ingreso = Ingreso(**data.model_dump(), owner_id=current.id, fuente=FuenteIngreso.manual)
    db.add(ingreso)
    await db.commit()
    await db.refresh(ingreso)
    patente = await get_bus_patente(db, ingreso.bus_id)
    return {**ingreso.__dict__, "bus_patente": patente}

@router.post("/importar-csv")
async def importar_csv(
    file:         UploadFile = File(...),
    col_fecha:    str = "fecha",
    col_monto:    str = "monto",
    col_patente:  str = "patente",
    col_pasajeros:str = "pasajeros",
    col_recorrido:str = "recorrido",
    db:           AsyncSession = Depends(get_db),
    current:      Usuario      = Depends(get_current_user),
):
    contenido = await file.read()
    texto     = contenido.decode("utf-8-sig")
    reader    = csv.DictReader(io.StringIO(texto))

    # Cargar buses del usuario para mapear patente → id
    buses_r = await db.execute(select(Bus).where(Bus.owner_id == current.id))
    buses   = {b.patente.upper(): b.id for b in buses_r.scalars().all()}

    importados = 0
    errores    = []

    for i, row in enumerate(reader, 1):
        try:
            # Fecha
            fecha_str = row.get(col_fecha, "").strip()
            fecha     = date.fromisoformat(fecha_str)

            # Monto
            monto_str = row.get(col_monto, "0").strip().replace("$", "").replace(".", "").replace(",", ".")
            monto     = float(monto_str)

            # Bus (opcional)
            patente = row.get(col_patente, "").strip().upper()
            bus_id  = buses.get(patente)

            # Pasajeros (opcional)
            pas_str   = row.get(col_pasajeros, "").strip()
            pasajeros = int(pas_str) if pas_str.isdigit() else None

            # Recorrido (opcional)
            recorrido = row.get(col_recorrido, "").strip() or None

            ingreso = Ingreso(
                owner_id        = current.id,
                bus_id          = bus_id,
                fecha           = fecha,
                monto           = monto,
                total_pasajeros = pasajeros,
                recorrido       = recorrido,
                fuente          = FuenteIngreso.importado,
            )
            db.add(ingreso)
            importados += 1
        except Exception as e:
            errores.append({"fila": i, "error": str(e)})

    await db.commit()
    return {
        "ok":         True,
        "importados": importados,
        "errores":    errores,
        "mensaje":    f"{importados} registros importados correctamente"
    }

@router.delete("/{ingreso_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_ingreso(
    ingreso_id: int,
    db:         AsyncSession = Depends(get_db),
    current:    Usuario      = Depends(get_current_user),
):
    result = await db.execute(
        select(Ingreso).where(Ingreso.id == ingreso_id, Ingreso.owner_id == current.id)
    )
    ingreso = result.scalar_one_or_none()
    if not ingreso:
        raise HTTPException(status_code=404, detail="Ingreso no encontrado")
    await db.delete(ingreso)
    await db.commit()