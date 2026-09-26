# Deployment Guide: TravelUZ B2B SaaS Platform

This guide explains how to deploy the TravelUZ B2B SaaS platform to a single Virtual Private Server (VPS) such as **Hetzner Cloud** (e.g. CX22 / CPX21) or **DigitalOcean Droplet** (e.g. 2 GB RAM / 2 vCPU).

---

## Architecture Overview

- **Frontend**: React + TypeScript (Vite static build served by Nginx)
- **Backend API**: FastAPI (Python 3.12) running via Uvicorn (ASGI)
- **Database**: PostgreSQL 16 with async SQLAlchemy 2.0 & Alembic migrations
- **Telegram Worker**: Async Python background worker for Telegram bot notifications
- **Reverse Proxy / HTTPS**: Caddy or Nginx with automated Let's Encrypt TLS certificates

---

## Step 1: Server Preparation

1. **Provision VPS**:
   - OS: Ubuntu 22.04 LTS or Debian 12
   - Minimum Specifications: 2 GB RAM, 2 vCPUs, 20 GB SSD

2. **Connect via SSH**:
   ```bash
   ssh root@<your-vps-ip>
   ```

3. **Install Docker & Docker Compose Plugin**:
   ```bash
   sudo apt update && sudo apt install -y curl git
   curl -fsSL https://get.docker.com | sh
   sudo systemctl enable --now docker
   ```

---

## Step 2: Clone Codebase & Configure Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/travel-uz.git /var/www/traveluz
   cd /var/www/traveluz
   ```

2. **Configure Backend Environment**:
   ```bash
   cat << 'EOF' > backend/.env
   DATABASE_URL=postgresql+asyncpg://postgres:secure_db_password_here@postgres:5432/traveluz
   JWT_SECRET_KEY=generate_a_random_32_character_secret_key_here
   ANTHROPIC_API_KEY=sk-ant-api03-...
   TELEGRAM_ENCRYPTION_KEY=your_fernet_encryption_key_32bytes!
   CORS_ORIGINS=https://yourdomain.com
   EOF
   ```

3. **Configure Frontend Environment**:
   ```bash
   cat << 'EOF' > .env
   VITE_API_BASE_URL=https://yourdomain.com/api/v1
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   EOF
   ```

---

## Step 3: SSL & HTTPS Reverse Proxy with Caddy

Install Caddy on the host system to manage automatic HTTPS certificates via Let's Encrypt:

1. **Install Caddy**:
   ```bash
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update && sudo apt install caddy
   ```

2. **Configure `/etc/caddy/Caddyfile`**:
   ```caddy
   yourdomain.com {
       # API Reverse Proxy
       handle /api/* {
           reverse_proxy localhost:8000
       }

       # OpenAPI Docs
       handle /docs {
           reverse_proxy localhost:8000
       }

       handle /openapi.json {
           reverse_proxy localhost:8000
       }

       # Frontend SPA
       handle {
           reverse_proxy localhost:80
       }
   }
   ```

3. **Reload Caddy**:
   ```bash
   sudo systemctl reload caddy
   ```

---

## Step 4: Launch Application with Docker Compose

Run the entire multi-container stack in detached mode:

```bash
docker compose up -d --build
```

Verify service health:
```bash
docker compose ps
docker compose logs -f backend
```

---

## Step 5: Database Migrations & Verification

Alembic migrations run automatically on backend startup. To run migrations manually at any time:

```bash
docker compose exec backend alembic upgrade head
```

Verify backend health:
```bash
curl -I https://yourdomain.com/api/v1/health
```

---

## Maintenance & Zero-Downtime Updates

To deploy new updates:

```bash
git pull origin main
docker compose up -d --build
```
