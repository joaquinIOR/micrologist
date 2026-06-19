from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.database import get_db
from app.dependencies import get_current_user
from app.models.usuario import Usuario, PLAN_LIMITES
from app.models.bus import Bus
from app.models.conductor import Conductor
from app.models.ingreso import Ingreso
import os

router = APIRouter(prefix="/admin", tags=["Admin"])

PLANES_VALIDOS = list(PLAN_LIMITES.keys())

def _verificar_admin(current: Usuario):
    admin_emails = [e.strip() for e in os.getenv("ADMIN_EMAIL", "").split(",") if e.strip()]
    if current.email not in admin_emails:
        raise HTTPException(status_code=403, detail="No autorizado")

@router.get("/stats")
async def stats(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    _verificar_admin(current)
    total_usuarios    = (await db.execute(select(func.count()).select_from(Usuario))).scalar()
    total_buses       = (await db.execute(select(func.count()).select_from(Bus))).scalar()
    total_conductores = (await db.execute(select(func.count()).select_from(Conductor))).scalar()
    total_ingresos    = (await db.execute(select(func.count()).select_from(Ingreso))).scalar()
    return {
        "usuarios":    total_usuarios,
        "buses":       total_buses,
        "conductores": total_conductores,
        "ingresos":    total_ingresos,
    }

@router.get("/usuarios")
async def listar_usuarios(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    _verificar_admin(current)
    usuarios = (await db.execute(select(Usuario).order_by(Usuario.created_at.desc()))).scalars().all()
    resultado = []
    for u in usuarios:
        buses_count = (await db.execute(select(func.count()).select_from(Bus).where(Bus.owner_id == u.id))).scalar()
        cond_count  = (await db.execute(select(func.count()).select_from(Conductor).where(Conductor.owner_id == u.id))).scalar()
        resultado.append({
            "id":          u.id,
            "nombre":      u.nombre,
            "email":       u.email,
            "empresa":     u.empresa,
            "plan":        u.plan,
            "activo":      u.activo,
            "buses":       buses_count,
            "conductores": cond_count,
            "created_at":  u.created_at.isoformat() if u.created_at else None,
        })
    return resultado

class CambiarPlanSchema(BaseModel):
    plan: str

@router.put("/usuarios/{usuario_id}/plan")
async def cambiar_plan(
    usuario_id: int,
    data:       CambiarPlanSchema,
    db:         AsyncSession = Depends(get_db),
    current:    Usuario      = Depends(get_current_user),
):
    _verificar_admin(current)
    if data.plan not in PLANES_VALIDOS:
        raise HTTPException(status_code=400, detail=f"Plan inválido. Opciones: {PLANES_VALIDOS}")
    result  = await db.execute(select(Usuario).where(Usuario.id == usuario_id))
    usuario = result.scalar_one_or_none()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.plan = data.plan
    await db.commit()
    return {"ok": True, "mensaje": f"Plan actualizado a {data.plan}"}
