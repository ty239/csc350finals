# DOCKER SETUP GUIDE - Sports Shop E-Commerce

## 🚀 Quick Start with Docker

The easiest way to run this application is with Docker! It automatically sets up the database and everything.

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Gmail account (for order email notifications)

### Setup Steps

**1. Configure Email Settings**

Edit the `.env.docker` file and add your Gmail credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=your-email@gmail.com
```

**How to get Gmail App Password:**
1. Go to your Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Copy and paste it in `EMAIL_PASS`

**2. Start the Application**

Open PowerShell in the project folder and run:

```powershell
docker-compose up -d
```

This command will:
- Download and set up PostgreSQL database
- Create and populate the database with sample products
- Build and start the Node.js application
- Everything runs in containers!

**3. Access the Application**

Open your browser and go to:
```
http://localhost:3000
```

### Useful Docker Commands

```powershell
# View logs (see what's happening)
docker-compose logs -f

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Stop and remove everything (including database data)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build
```

### Troubleshooting

**Port already in use:**
```powershell
# Stop existing containers
docker-compose down

# Or change the port in docker-compose.yml
# Change "3000:3000" to "3001:3000" under app > ports
```

**Database not initializing:**
```powershell
# Remove everything and start fresh
docker-compose down -v
docker-compose up -d
```

**Can't connect to email:**
- Make sure you're using Gmail App Password, not your regular password
- Check that 2-Step Verification is enabled on your Google Account

### What's Running?

When you start with `docker-compose up -d`, two containers run:
1. **PostgreSQL Database** (port 5432)
   - Automatically creates the `sports_shop` database
   - Imports all tables and sample products
   
2. **Node.js Application** (port 3000)
   - Serves your HTML/JS website
   - Connects to the database
   - Handles all API requests

### Default Database Credentials (inside Docker)
- **Host:** postgres (container name)
- **Port:** 5432
- **User:** postgres
- **Password:** postgres123
- **Database:** sports_shop

These are only accessible from within Docker containers, not from your local machine (unless you change the config).

### Making Code Changes

If you edit your HTML/JS files:
```powershell
# Just refresh your browser - changes are live!
```

If you edit server.js or package.json:
```powershell
# Rebuild and restart
docker-compose up -d --build
```

## 📦 Without Docker (Manual Setup)

If you prefer not to use Docker, see the main README.md for manual setup instructions.

## 🌐 Deploying to Production

For free hosting with Docker support:
- **Railway.app** - Easy deployment, free tier available
- **Render.com** - Supports Docker containers
- **Fly.io** - Free tier for small apps

All of these services can deploy directly from your GitHub repository using the Dockerfile!
