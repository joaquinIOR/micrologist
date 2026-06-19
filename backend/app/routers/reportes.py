from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, datetime
from io import BytesIO
from fpdf import FPDF
from app.database import get_db
from app.dependencies import get_current_user
from app.models.usuario import Usuario
from app.models.bus import Bus
from app.models.conductor import Conductor
from app.models.ingreso import Ingreso

router = APIRouter(prefix="/reportes", tags=["Reportes"])

def _semaforo_bus(b: Bus) -> str:
    hoy = date.today()
    estados = []
    for f in [b.revision_tecnica, b.soap, b.permiso_circulacion]:
        if not f:
            continue
        dias = (f - hoy).days
        if dias < 0:
            estados.append("CRITICO")
        elif dias <= 30:
            estados.append("ALERTA")
        else:
            estados.append("OK")
    if "CRITICO" in estados:
        return "CRITICO"
    if "ALERTA" in estados:
        return "ALERTA"
    return "OK"

@router.get("/pdf")
async def generar_pdf(
    db:      AsyncSession = Depends(get_db),
    current: Usuario      = Depends(get_current_user),
):
    buses       = (await db.execute(select(Bus).where(Bus.owner_id == current.id))).scalars().all()
    conductores = (await db.execute(select(Conductor).where(Conductor.owner_id == current.id))).scalars().all()

    mes_inicio = date.today().replace(day=1)
    ingresos_mes = (await db.execute(
        select(func.sum(Ingreso.monto)).where(Ingreso.owner_id == current.id, Ingreso.fecha >= mes_inicio)
    )).scalar() or 0

    criticos = [b for b in buses if _semaforo_bus(b) == "CRITICO"]
    alertas  = [b for b in buses if _semaforo_bus(b) == "ALERTA"]

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Encabezado
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(249, 115, 22)
    pdf.cell(0, 10, "MicroLogist", ln=True, align="C")
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, "Reporte de Flota", ln=True, align="C")
    pdf.cell(0, 6, f"Generado: {datetime.now().strftime('%d/%m/%Y %H:%M')}", ln=True, align="C")
    pdf.ln(8)

    # Info empresa
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 8, current.empresa or current.nombre, ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 6, f"Plan: {(current.plan or 'estandar').upper()}", ln=True)
    pdf.ln(4)

    # Resumen
    pdf.set_fill_color(249, 250, 251)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 8, "Resumen", ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(95, 7, f"Total buses: {len(buses)}", border=1, fill=True)
    pdf.cell(95, 7, f"Total conductores: {len(conductores)}", border=1, fill=True, ln=True)
    pdf.cell(95, 7, f"Buses criticos: {len(criticos)}", border=1, fill=True)
    pdf.cell(95, 7, f"Buses en alerta: {len(alertas)}", border=1, fill=True, ln=True)
    pdf.cell(95, 7, f"Ingresos del mes: ${int(ingresos_mes):,}", border=1, fill=True)
    pdf.ln(8)

    # Tabla de buses
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 8, "Estado de la Flota", ln=True)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_fill_color(230, 230, 230)
    pdf.cell(30, 7, "Patente", border=1, fill=True)
    pdf.cell(40, 7, "Marca/Modelo", border=1, fill=True)
    pdf.cell(40, 7, "Rev. Tecnica", border=1, fill=True)
    pdf.cell(40, 7, "SOAP", border=1, fill=True)
    pdf.cell(40, 7, "Estado", border=1, fill=True, ln=True)
    pdf.set_font("Helvetica", "", 9)
    for b in buses:
        sem = _semaforo_bus(b)
        if sem == "CRITICO":
            pdf.set_text_color(185, 28, 28)
        elif sem == "ALERTA":
            pdf.set_text_color(161, 83, 0)
        else:
            pdf.set_text_color(21, 128, 61)
        pdf.cell(30, 6, b.patente or "-", border=1)
        pdf.set_text_color(60, 60, 60)
        pdf.cell(40, 6, f"{b.marca or ''} {b.modelo or ''}".strip() or "-", border=1)
        pdf.cell(40, 6, b.revision_tecnica.strftime("%d/%m/%Y") if b.revision_tecnica else "-", border=1)
        pdf.cell(40, 6, b.soap.strftime("%d/%m/%Y") if b.soap else "-", border=1)
        if sem == "CRITICO":
            pdf.set_text_color(185, 28, 28)
        elif sem == "ALERTA":
            pdf.set_text_color(161, 83, 0)
        else:
            pdf.set_text_color(21, 128, 61)
        pdf.cell(40, 6, sem, border=1, ln=True)
    pdf.set_text_color(60, 60, 60)
    pdf.ln(6)

    # Tabla conductores
    if conductores:
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(30, 30, 30)
        pdf.cell(0, 8, "Conductores", ln=True)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_fill_color(230, 230, 230)
        pdf.cell(70, 7, "Nombre", border=1, fill=True)
        pdf.cell(40, 7, "RUT", border=1, fill=True)
        pdf.cell(50, 7, "Licencia", border=1, fill=True)
        pdf.cell(30, 7, "Estado", border=1, fill=True, ln=True)
        pdf.set_font("Helvetica", "", 9)
        for c in conductores:
            pdf.set_text_color(60, 60, 60)
            pdf.cell(70, 6, c.nombre[:30], border=1)
            pdf.cell(40, 6, c.rut or "-", border=1)
            pdf.cell(50, 6, c.vencimiento_licencia.strftime("%d/%m/%Y") if c.vencimiento_licencia else "-", border=1)
            pdf.cell(30, 6, c.estado.value if hasattr(c.estado, "value") else str(c.estado), border=1, ln=True)

    # Footer
    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(0, 6, "MicroLogist - Plataforma de gestion de flotas urbanas", ln=True, align="C")

    buf = BytesIO(pdf.output())
    nombre = f"reporte-{datetime.now().strftime('%Y-%m-%d')}.pdf"
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={nombre}"},
    )
