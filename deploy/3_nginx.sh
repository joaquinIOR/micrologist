#!/bin/bash
# MicroLogist — Configura Nginx como reverse proxy
# Uso: bash 3_nginx.sh TU_DOMINIO_O_IP
# Ejemplo con IP:     bash 3_nginx.sh 152.67.XX.XX
# Ejemplo con dominio: bash 3_nginx.sh api.midominio.cl
set -e

DOMINIO=${1:-"_"}

cat > /etc/nginx/sites-available/micrologist << EOF
server {
    listen 80;
    server_name $DOMINIO;

    # ── Security headers ──────────────────────────────────────────
    add_header X-Frame-Options          "SAMEORIGIN"                       always;
    add_header X-Content-Type-Options   "nosniff"                          always;
    add_header X-XSS-Protection         "1; mode=block"                   always;
    add_header Referrer-Policy          "strict-origin-when-cross-origin"  always;
    add_header Permissions-Policy       "geolocation=(), microphone=(), camera=()" always;
    # HSTS se activa solo después de instalar SSL (Certbot lo agrega)

    # Logs
    access_log /var/log/nginx/micrologist_access.log;
    error_log  /var/log/nginx/micrologist_error.log;

    location / {
        proxy_pass         http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;

        # Timeouts generosos para uploads CSV
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;

        # CORS ya lo maneja FastAPI, Nginx no lo toca
        # Repetir headers aquí porque add_header en location overridea el bloque server
        add_header X-Frame-Options          "SAMEORIGIN"                       always;
        add_header X-Content-Type-Options   "nosniff"                          always;
        add_header X-XSS-Protection         "1; mode=block"                   always;
        add_header Referrer-Policy          "strict-origin-when-cross-origin"  always;
        add_header Permissions-Policy       "geolocation=(), microphone=(), camera=()" always;
    }

    # Health check de Nginx
    location /nginx-health {
        return 200 'ok';
        add_header Content-Type text/plain;
    }
}
EOF

ln -sf /etc/nginx/sites-available/micrologist /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
echo "✅ Nginx configurado para $DOMINIO"

# ── SSL CON CERTBOT (solo si es dominio, no IP) ───────────────
if [[ "$DOMINIO" =~ \. ]] && [[ ! "$DOMINIO" =~ ^[0-9] ]]; then
    echo ""
    read -p "¿Quieres activar SSL con Let's Encrypt para $DOMINIO? [s/N] " resp
    if [[ "$resp" =~ ^[sS]$ ]]; then
        read -p "Ingresa tu email para Let's Encrypt: " EMAIL
        certbot --nginx -d $DOMINIO --non-interactive --agree-tos -m $EMAIL
        echo "✅ SSL activado. Certificado auto-renovable."
    fi
else
    echo ""
    echo "ℹ️  Usando IP directa — SSL no disponible sin dominio."
    echo "   Para SSL gratis: apunta un dominio a esta IP y vuelve a ejecutar:"
    echo "   bash 3_nginx.sh tu.dominio.cl"
fi

echo ""
echo "API disponible en: http://$DOMINIO"
