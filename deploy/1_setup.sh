#!/bin/bash
# MicroLogist — Setup inicial Oracle Cloud A1 (Ubuntu 22.04 ARM)
# Ejecutar como root o con sudo: bash 1_setup.sh
set -e

echo "========================================"
echo "  MicroLogist — Setup Oracle Cloud A1"
echo "========================================"

# ── 1. SISTEMA ────────────────────────────────────────────────
echo "[1/8] Actualizando sistema..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. FIREWALL (Oracle tiene iptables además de Security Lists) ──
echo "[2/8] Abriendo puertos 80 y 443 en iptables..."
iptables  -I INPUT  6 -m state --state NEW -p tcp --dport 80  -j ACCEPT
iptables  -I INPUT  7 -m state --state NEW -p tcp --dport 443 -j ACCEPT
netfilter-persistent save 2>/dev/null || iptables-save > /etc/iptables/rules.v4

# ── 3. PYTHON 3.11 ────────────────────────────────────────────
echo "[3/8] Instalando Python 3.11..."
apt-get install -y -qq software-properties-common
add-apt-repository -y ppa:deadsnakes/ppa
apt-get update -qq
apt-get install -y -qq python3.11 python3.11-venv python3.11-dev python3-pip build-essential

# ── 4. POSTGRESQL 15 ──────────────────────────────────────────
echo "[4/8] Instalando PostgreSQL 15..."
apt-get install -y -qq postgresql postgresql-contrib

systemctl enable postgresql
systemctl start  postgresql

# Crear usuario y base de datos
DB_PASS=$(openssl rand -hex 16)
sudo -u postgres psql -c "CREATE USER micrologist WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE micrologist OWNER micrologist;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE micrologist TO micrologist;" 2>/dev/null || true

echo ""
echo ">>> PostgreSQL creado:"
echo "    Usuario:    micrologist"
echo "    Contraseña: $DB_PASS"
echo "    Base de datos: micrologist"
echo "    Guarda esto para el .env"
echo ""

# ── 5. NGINX ──────────────────────────────────────────────────
echo "[5/8] Instalando Nginx..."
apt-get install -y -qq nginx
systemctl enable nginx
systemctl start  nginx

# ── 6. CERTBOT (SSL) ──────────────────────────────────────────
echo "[6/8] Instalando Certbot..."
apt-get install -y -qq certbot python3-certbot-nginx

# ── 7. USUARIO Y DIRECTORIO DE LA APP ────────────────────────
echo "[7/8] Creando usuario de la aplicación..."
id -u micrologist &>/dev/null || useradd -r -m -s /bin/bash micrologist

APP_DIR=/opt/micrologist

if [ -d "$APP_DIR/.git" ]; then
    echo "Repositorio ya existe, haciendo pull..."
    cd $APP_DIR && git pull
else
    echo "Clonando repositorio..."
    git clone https://github.com/joaquinIOR/micrologist.git $APP_DIR
fi

chown -R micrologist:micrologist $APP_DIR

# ── 8. VIRTUALENV Y DEPENDENCIAS ─────────────────────────────
echo "[8/8] Instalando dependencias Python..."
cd $APP_DIR/backend

sudo -u micrologist python3.11 -m venv .venv
sudo -u micrologist .venv/bin/pip install -q --upgrade pip
sudo -u micrologist .venv/bin/pip install -q -r requirements.txt

echo ""
echo "========================================"
echo "  Setup completado."
echo ""
echo "  PRÓXIMOS PASOS:"
echo "  1. Crear el archivo .env:"
echo "     nano /opt/micrologist/backend/.env"
echo ""
echo "  2. Instalar el servicio:"
echo "     bash /opt/micrologist/deploy/2_servicio.sh"
echo ""
echo "  3. Configurar Nginx:"
echo "     bash /opt/micrologist/deploy/3_nginx.sh TU_IP_O_DOMINIO"
echo "========================================"
echo "  Contraseña BD generada: $DB_PASS"
echo "========================================"
