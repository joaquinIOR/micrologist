from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date
from typing import Optional
from app.database import get_db
from app.models.bus import Bus
from app.models.conductor import Conductor
from app.models.usuario import Usuario
from app.dependencies import get_current_user
from twilio.rest import Client
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/alertas", tags=["Alertas"])

TWILIO_SID   = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM  = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")

MULTAS_ESTIMADAS = {
    "revision_tecnica":    230000,
    "soap":                150000,
    "permiso_circulacion": 100000,
    "licencia":            200000,
}

def dias_hasta(fecha: Optional[date]) -> Optional[int]:
    if not fecha:
        return None
    return (fecha - date.today()).days

def nivel_alerta(dias: Optional[int]) -> str:
    if dias is None:
        return "sin_fecha"
    if dias < 0:
        return "critico"
    if dias <= 30:
        return "alerta"
    return "ok"

def construir_alertas_bus(bus: Bus) -> list[dict]:
    alertas = []
    campos = {
        "revision_tecnica":    ("Revisión Técnica", bus.revision_tecnica),
        "soap":                ("SOAP",              bus.soap),
        "permiso_circulacion": ("Permiso de Circulación", bus.permiso_circulacion),
    }
    for key, (nombre, fecha) in campos.items():
        dias  = dias_hasta(fecha)
        nivel = nivel_alerta(dias)
        if nivel in ("alerta", "critico"):
            alertas.append({
                "tipo":    "bus",
                "subtipo": key,
                "entidad": f"Bus {bus.patente}",
                "nombre":  nombre,
                "fecha":   fecha,
                "dias":    dias,
                "nivel":   nivel,
                "multa_estimada": MULTAS_ESTIMADAS.get(key, 0),
                "mensaje": (
                    f"🚨 {nombre} VENCIDA hace {abs(dias)} días"
                    if nivel == "critico"
                    else f"⚠️ {nombre} vence en {dias} días"
                )
            })
    return alertas

def construir_alertas_conductor(c: Conductor) -> list[dict]:
    alertas = []
    dias  = dias_hasta(c.vencimiento_licencia)
    nivel = nivel_alerta(dias)
    if nivel in ("alerta", "critico"):
        alertas.append({
            "tipo":    "conductor",
            "subtipo": "licencia",
            "entidad": c.nombre,
            "nombre":  "Licencia de conducir",
            "fecha":   c.vencimiento_licencia,
            "dias":    dias,
            "nivel":   nivel,
            "multa_estimada": MULTAS_ESTIMADAS["licencia"],
            "mensaje": (
                f"🚨 Licencia de {c.nombre} VENCIDA hace {abs(dias)} días"
                if nivel == "critico"
                else f"⚠️ Licencia de {c.nombre} vence en {dias} días"
            )
        })
    return alertas

def enviar_whatsapp(telefono: str, mensaje: str):
    """Envía mensaje WhatsApp via Twilio."""
    if not TWILIO_SID or not TWILIO_TOKEN:
        print(f"[WhatsApp simulado] → {telefono}: {mensaje}")
        return
    try:
        client = Client(TWILIO_SID, TWILIO_TOKEN)
        client.messages.create(
            body=mensaje,
            from_=TWILIO_FROM,
            to=f"whatsapp:{telefono}"
        )
    except Exception as e:
        print(f"Error enviando WhatsApp: {e}")

# --- Endpoints ---
@router.get("/")
async def obtener_alertas(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    """Retorna todas las alertas activas del usuario."""
    buses_r = await db.execute(select(Bus).where(Bus.owner_id == current.id))
    cond_r  = await db.execute(select(Conductor).where(Conductor.owner_id == current.id))

    alertas = []
    for bus in buses_r.scalars().all():
        alertas.extend(construir_alertas_bus(bus))
    for conductor in cond_r.scalars().all():
        alertas.extend(construir_alertas_conductor(conductor))

    # Ordenar: críticos primero
    alertas.sort(key=lambda a: (0 if a["nivel"] == "critico" else 1))

    return {
        "total":    len(alertas),
        "criticos": sum(1 for a in alertas if a["nivel"] == "critico"),
        "alertas":  sum(1 for a in alertas if a["nivel"] == "alerta"),
        "items":    alertas,
    }

@router.post("/enviar-automatico")
async def enviar_alertas_automatico(
    background_tasks: BackgroundTasks,
    db:               AsyncSession = Depends(get_db),
    x_cron_secret:    str | None   = Header(default=None),
):
    """Endpoint para cron job diario. Protegido por CRON_SECRET en header X-Cron-Secret."""
    cron_secret = os.getenv("CRON_SECRET")
    if not cron_secret or x_cron_secret != cron_secret:
        raise HTTPException(status_code=403, detail="No autorizado")

    from app.models.usuario import Usuario
    usuarios_r = await db.execute(
        select(Usuario).where(Usuario.activo == True, Usuario.telefono.isnot(None))
    )
    usuarios = usuarios_r.scalars().all()

    enviados = 0
    for usuario in usuarios:
        buses_r = await db.execute(select(Bus).where(Bus.owner_id == usuario.id))
        cond_r  = await db.execute(select(Conductor).where(Conductor.owner_id == usuario.id))

        alertas = []
        for bus in buses_r.scalars().all():
            alertas.extend(construir_alertas_bus(bus))
        for conductor in cond_r.scalars().all():
            alertas.extend(construir_alertas_conductor(conductor))

        if not alertas:
            continue

        resumen  = f"🚌 *MicroLogist — Alertas del día*\nHola {usuario.nombre},\n\n"
        for a in alertas:
            resumen += f"{a['mensaje']}\n"
            if a.get("multa_estimada"):
                resumen += f"   💸 Multa estimada: ${a['multa_estimada']:,} CLP\n"
        resumen += "\nIngresa a tu dashboard para más detalles."

        background_tasks.add_task(enviar_whatsapp, usuario.telefono, resumen)
        enviados += 1

    return {"ok": True, "usuarios_notificados": enviados}

@router.post("/enviar-whatsapp")
async def enviar_alertas_whatsapp(
    background_tasks: BackgroundTasks,
    db:               AsyncSession = Depends(get_db),
    current:          Usuario      = Depends(get_current_user),
):
    """Envía todas las alertas críticas y de alerta por WhatsApp al dueño."""
    if not current.telefono:
        return {"ok": False, "mensaje": "No tienes teléfono registrado en tu perfil"}

    buses_r = await db.execute(select(Bus).where(Bus.owner_id == current.id))
    cond_r  = await db.execute(select(Conductor).where(Conductor.owner_id == current.id))

    alertas = []
    for bus in buses_r.scalars().all():
        alertas.extend(construir_alertas_bus(bus))
    for conductor in cond_r.scalars().all():
        alertas.extend(construir_alertas_conductor(conductor))

    if not alertas:
        return {"ok": True, "mensaje": "No hay alertas activas, tu flota está al día ✅"}

    resumen = f"🚌 *MicroLogist — Resumen de Alertas*\n\n"
    for a in alertas:
        resumen += f"{a['mensaje']}\n"
        if a.get("multa_estimada"):
            resumen += f"   💸 Multa estimada: ${a['multa_estimada']:,} CLP\n"
    resumen += f"\nIngresa a tu dashboard para más detalles."

    background_tasks.add_task(enviar_whatsapp, current.telefono, resumen)
    return {"ok": True, "mensaje": f"Alertas enviadas a {current.telefono}", "total": len(alertas)}
