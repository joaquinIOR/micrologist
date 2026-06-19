# Deploy MicroLogist — Oracle Cloud A1 (ARM)

Migración del backend desde Railway a una instancia ARM gratuita de Oracle Cloud.

## Arquitectura final

```
[Usuario]
    │
    ├──► Vercel (Next.js frontend)  →  micrologist.vercel.app
    │
    └──► Oracle Cloud A1 ARM
             Nginx :80/:443
                │
             FastAPI :8000  (systemd)
                │
             PostgreSQL 15  (localhost)
                │
             crontab → alertas WhatsApp diarias (08:00)
```

---

## Paso 1 — Crear la instancia en Oracle Cloud

1. Entra a **cloud.oracle.com** → Compute → Instances → **Create Instance**
2. Configura:
   - **Name:** `micrologist-api`
   - **Image:** Ubuntu 22.04 (Minimal)
   - **Shape:** `VM.Standard.A1.Flex` → **4 OCPUs, 24 GB RAM** (Always Free)
   - **SSH keys:** sube tu clave pública (`~/.ssh/id_rsa.pub`) o genera una nueva
3. En **Networking**: deja la VCN por defecto
4. Click **Create**

### Abrir puertos en Oracle (Security List)

Ve a **Networking → Virtual Cloud Networks → tu VCN → Security Lists → Default Security List** y agrega:

| Dirección | Protocolo | Puerto | Descripción |
|-----------|-----------|--------|-------------|
| Ingress   | TCP       | 80     | HTTP        |
| Ingress   | TCP       | 443    | HTTPS       |

---

## Paso 2 — Conectarse al servidor

```bash
ssh ubuntu@TU_IP_PUBLICA
```

---

## Paso 3 — Setup inicial (una sola vez)

```bash
# Descargar y ejecutar el script de setup
curl -O https://raw.githubusercontent.com/joaquinIOR/micrologist/main/deploy/1_setup.sh
sudo bash 1_setup.sh
```

El script instala Python 3.11, PostgreSQL 15, Nginx, Certbot y clona el repo.
**Guarda la contraseña de PostgreSQL que muestra al final.**

---

## Paso 4 — Crear el archivo .env

```bash
sudo nano /opt/micrologist/backend/.env
```

Pega este contenido y completa los valores:

```env
DATABASE_URL=postgresql+asyncpg://micrologist:TU_CONTRASEÑA_BD@localhost:5432/micrologist
SECRET_KEY=     # openssl rand -hex 32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
FRONTEND_URL=https://micrologist.vercel.app
CRON_SECRET=    # openssl rand -hex 24
DEBUG=false
```

Genera las claves aleatorias:
```bash
openssl rand -hex 32   # para SECRET_KEY
openssl rand -hex 24   # para CRON_SECRET
```

---

## Paso 5 — Instalar servicio y cron

```bash
sudo bash /opt/micrologist/deploy/2_servicio.sh
```

Esto inicia FastAPI como servicio systemd y configura el cron de alertas a las 08:00.

---

## Paso 6 — Configurar Nginx

**Con IP directa (sin dominio):**
```bash
sudo bash /opt/micrologist/deploy/3_nginx.sh TU_IP_PUBLICA
```

**Con dominio propio (recomendado, incluye SSL gratis):**
```bash
# Primero apunta tu dominio a la IP en tu DNS
sudo bash /opt/micrologist/deploy/3_nginx.sh api.tudominio.cl
```

---

## Paso 7 — Actualizar el frontend en Vercel

En Vercel → Settings → Environment Variables, cambia:

```
NEXT_PUBLIC_API_URL = http://TU_IP_PUBLICA
# o con dominio:
NEXT_PUBLIC_API_URL = https://api.tudominio.cl
```

Redeploy el frontend para que tome el nuevo valor.

---

## Comandos útiles

```bash
# Ver logs en vivo
journalctl -u micrologist -f

# Reiniciar la app
sudo systemctl restart micrologist

# Ver estado
sudo systemctl status micrologist

# Actualizar con los últimos cambios del repo
sudo bash /opt/micrologist/deploy/4_actualizar.sh

# Ver log del cron de alertas
cat /var/log/micrologist-cron.log

# Verificar que la API responde
curl http://localhost:8000/health
```

---

## Verificar que todo funciona

```bash
# Health check local
curl http://localhost:8000/health
# → {"status":"ok"}

# Health check desde internet
curl http://TU_IP/health
# → {"status":"ok"}
```

Si el health check responde, el deploy está completo.
