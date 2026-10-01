# Quick Deployment Guide (Under 10 Minutes)

This document provides step-by-step instructions to deploy MULTIHAZARD to popular cloud platforms.

---

## 1. Quickest: Deploy via Docker Compose (Any VPS / Cloud VM)

Requirements: Docker & Docker Compose installed.

```bash
git clone <your-repo-url>
cd DAY2
docker-compose up -d --build
```
- Frontend will be live on: `http://<your-ip>:5173`
- Backend API will be live on: `http://<your-ip>:8000`
- API documentation (Swagger): `http://<your-ip>:8000/docs`

---

## 2. Deploy Free to Render.com

### Backend (Web Service):
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variable (Optional):
   - `EARTHENGINE_PROJECT`: your-gee-project-id (if GEE enabled)

### Frontend (Static Site):
1. Create a new **Static Site** on Render.
2. Configure settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: URL of your Render backend web service (e.g. `https://multihazard-backend.onrender.com`)

---

## 3. Deploy Free to Vercel (Frontend) + Railway (Backend)

### Backend on Railway:
1. New Project on [Railway.app](https://railway.app).
2. Select GitHub repo, set root directory to `/backend`.
3. Railway automatically detects `requirements.txt` and runs Uvicorn.
4. Copy the public Railway URL.

### Frontend on Vercel:
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Environment Variables:
   - `VITE_API_URL`: Your Railway backend URL.
5. Click **Deploy**.

---

## 4. Local Quick Start (For Hackathon Demonstration)

Run both scripts simultaneously:

```powershell
# Terminal 1:
.\scripts\start_backend.bat

# Terminal 2:
.\scripts\start_frontend.bat
```

Access at `http://localhost:5173`.
