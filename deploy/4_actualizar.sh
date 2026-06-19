#!/bin/bash
# MicroLogist — Actualiza la app con los últimos cambios del repo
# Ejecutar como root: bash 4_actualizar.sh
set -e

APP_DIR=/opt/micrologist

echo "Actualizando MicroLogist..."

cd $APP_DIR
git pull origin main

cd backend
sudo -u micrologist .venv/bin/pip install -q -r requirements.txt

systemctl restart micrologist
sleep 2

if systemctl is-active --quiet micrologist; then
    echo "✅ Actualización completada. App corriendo."
else
    echo "❌ Error al reiniciar. Ver logs:"
    journalctl -u micrologist -n 20
    exit 1
fi
