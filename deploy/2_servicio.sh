#!/bin/bash
# MicroLogist — Instala el servicio systemd y cron de alertas
# Ejecutar como root: bash 2_servicio.sh
set -e

APP_DIR=/opt/micrologist

# ── SYSTEMD SERVICE ───────────────────────────────────────────
cat > /etc/systemd/system/micrologist.service << 'EOF'
[Unit]
Description=MicroLogist FastAPI Backend
After=network.target postgresql.service

[Service]
Type=simple
User=micrologist
WorkingDirectory=/opt/micrologist/backend
EnvironmentFile=/opt/micrologist/backend/.env
ExecStart=/opt/micrologist/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable micrologist
systemctl restart micrologist

sleep 2
if systemctl is-active --quiet micrologist; then
    echo "✅ Servicio micrologist corriendo en puerto 8000"
else
    echo "❌ Error al iniciar el servicio. Ver logs:"
    echo "   journalctl -u micrologist -n 30"
    exit 1
fi

# ── CRON DE ALERTAS AUTOMÁTICAS ──────────────────────────────
# Lee el CRON_SECRET del .env
CRON_SECRET=$(grep CRON_SECRET $APP_DIR/backend/.env | cut -d= -f2)

if [ -n "$CRON_SECRET" ]; then
    CRON_JOB="0 8 * * * curl -s -X POST http://localhost:8000/alertas/enviar-automatico -H 'X-Cron-Secret: $CRON_SECRET' >> /var/log/micrologist-cron.log 2>&1"
    (crontab -u micrologist -l 2>/dev/null | grep -v "enviar-automatico"; echo "$CRON_JOB") | crontab -u micrologist -
    echo "✅ Cron de alertas configurado (lunes a domingo a las 08:00)"
else
    echo "⚠️  CRON_SECRET no encontrado en .env — cron de alertas NO configurado"
    echo "   Agrega CRON_SECRET al .env y vuelve a ejecutar este script"
fi

echo ""
echo "Comandos útiles:"
echo "  Ver logs en vivo:  journalctl -u micrologist -f"
echo "  Reiniciar:         systemctl restart micrologist"
echo "  Ver estado:        systemctl status micrologist"
