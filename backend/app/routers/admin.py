from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from pydantic import BaseModel
from app.database import get_db
from app.dependencies import get_current_user
from app.models.usuario import Usuario, PLAN_LIMITES
from app.models.bus import Bus
from app.models.conductor import Conductor
from app.models.ingreso import Ingreso
from app.models.audit_log import AuditLog
import os

router = APIRouter(prefix="/admin", tags=["Admin"])

PLANES_VALIDOS = list(PLAN_LIMITES.keys())

def _verificar_admin(current: Usuario):
    admin_emails = [e.strip() for e in os.getenv("ADMIN_EMAIL", "").split(",") if e.strip()]
    if current.email not in admin_emails:
        raise HTTPException(status_code=403, detail="No autorizado")

async def _log(db: AsyncSession, admin_email: str, accion: str, detalle: str, request: Request = None):
    ip = request.client.host if request and request.client else None
    db.add(AuditLog(admin_email=admin_email, accion=accion, detalle=detalle, ip=ip))
    await db.commit()

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
            "ciudad":      u.ciudad,
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
    request:    Request,
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
    plan_anterior = usuario.plan
    usuario.plan  = data.plan
    await db.commit()
    await _log(db, current.email, "cambiar_plan",
               f"{usuario.email}: {plan_anterior} → {data.plan}", request)
    return {"ok": True, "mensaje": f"Plan actualizado a {data.plan}"}

@router.delete("/usuarios/{usuario_id}")
async def eliminar_usuario(
    usuario_id: int,
    request:    Request,
    db:         AsyncSession = Depends(get_db),
    current:    Usuario      = Depends(get_current_user),
):
    _verificar_admin(current)
    if usuario_id == current.id:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propia cuenta")
    result  = await db.execute(select(Usuario).where(Usuario.id == usuario_id))
    usuario = result.scalar_one_or_none()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    email_eliminado = usuario.email
    nombre_eliminado = usuario.nombre
    await db.execute(delete(Ingreso).where(Ingreso.owner_id == usuario_id))
    await db.delete(usuario)
    await db.commit()
    await _log(db, current.email, "eliminar_usuario",
               f"{nombre_eliminado} ({email_eliminado})", request)
    return {"ok": True, "mensaje": f"Usuario {email_eliminado} eliminado"}

@router.get("/audit")
async def listar_audit(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    _verificar_admin(current)
    logs = (await db.execute(
        select(AuditLog).order_by(AuditLog.created_at.desc()).limit(100)
    )).scalars().all()
    return [
        {
            "id":          l.id,
            "admin_email": l.admin_email,
            "accion":      l.accion,
            "detalle":     l.detalle,
            "ip":          l.ip,
            "created_at":  l.created_at.isoformat() if l.created_at else None,
        }
        for l in logs
    ]
