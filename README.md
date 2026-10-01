# MULTIHAZARD — Geospatial Decision Support & Emergency Routing System

> **Hackathon MVP** — Production-quality multi-hazard risk analysis and risk-aware emergency routing platform powered by Google Earth Engine, FastAPI, and React.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Datasets Used](#4-datasets-used)
5. [Hazard Indicators](#5-hazard-indicators)
6. [MCDM Engine](#6-mcdm-engine)
7. [Emergency Routing](#7-emergency-routing)
8. [Risk Classification](#8-risk-classification)
9. [API Reference](#9-api-reference)
10. [Setup Instructions](#10-setup-instructions)
11. [Running the Application](#11-running-the-application)
12. [Demo AOIs](#12-demo-aois)
13. [Project Structure](#13-project-structure)

---

## 1. Overview

MULTIHAZARD is an interactive web-based geospatial decision-support platform for disaster management. It:

- Ingests satellite imagery (Sentinel-1/2), terrain data (SRTM), rainfall (CHIRPS), and land cover (Dynamic World) via Google Earth Engine.
- Computes individual hazard indicators (flood, terrain/slope, rainfall, exposure).
- Normalizes all indicators to a common 0–1 scale.
- Combines them using a configurable Weighted Sum Model (MCDM).
- Generates a multi-hazard composite risk surface.
- Identifies critical hotspots and nearby hospitals/shelters.
- Calculates an emergency route that **minimizes disaster risk**, not just distance, using NetworkX-powered graph routing.
- Provides a full Decision Intelligence panel with actionable recommendations.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend (Vite)               │
│  Left Panel   │  Leaflet Map   │  Right Panel        │
│  (AOI/MCDM)   │  (TacticalMap) │  (Decision Intel)   │
└────────┬───────────────────────────────┬────────────┘
         │ REST API / HTTP Fetch          │
         ▼                               ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                │
│  /api/analysis   /api/route   /api/facilities        │
│  HazardService   MCDMService  RoutingService         │
│  GEEService      OSMService   RecommendationService  │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────┐  ┌──────────────────────┐
│  Google Earth Engine   │  │  OpenStreetMap / OSM  │
│  Sentinel-1, S-2, SRTM │  │  Roads, Hospitals,    │
│  CHIRPS, Dynamic World │  │  Shelters             │
└────────────────────────┘  └──────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Mapping | Leaflet / React-Leaflet |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python FastAPI + Uvicorn |
| GEE Integration | `earthengine-api` |
| Geospatial | GeoPandas, Shapely, NumPy |
| Routing | NetworkX |
| Data Validation | Pydantic v2 |

---

## 4. Datasets Used

| Dataset | Platform | Purpose |
|---------|----------|---------|
| Sentinel-2 MSI (`COPERNICUS/S2_SR_HARMONIZED`) | GEE | NDVI, land cover, flood support |
| Sentinel-1 GRD (`COPERNICUS/S1_GRD`) | GEE | SAR flood detection (cloud-penetrating) |
| SRTM (`USGS/SRTMGL1_003`) | GEE | Elevation, slope / terrain risk |
| CHIRPS Daily (`UCSB-CHG/CHIRPS/DAILY`) | GEE | Rainfall accumulation / intensity |
| Dynamic World (`GOOGLE/DYNAMICWORLD/V1`) | GEE | Land cover, built-up exposure |
| JRC Global Surface Water | GEE | Historical water / permanent water masking |
| OpenStreetMap | Overpass API | Roads, hospitals, shelters |

---

## 5. Hazard Indicators

### 5.1 Flood Risk
Uses Sentinel-1 SAR backscatter change detection. Pre-event vs. post-event VV polarization difference identifies newly inundated areas. Permanent water bodies (from JRC) are masked out.

```
Flood Risk = normalize(post_VV - pre_VV) * (1 - permanent_water_mask)
```

### 5.2 Terrain / Slope Risk
Derived from SRTM DEM. Higher slope → higher terrain-related hazard contribution.

```
Slope = arctan(gradient(DEM))
Terrain Risk = normalize(slope, 0°, 45°)
```

### 5.3 Rainfall Risk
CHIRPS daily data accumulated over the analysis period.

```
Rainfall Risk = normalize(accumulated_rainfall, 0, 200mm)
```

### 5.4 Exposure
Dynamic World built-up fraction combined with settlement density from OSM.

```
Exposure = normalize(built_fraction + settlement_density)
```

### 5.5 Normalization
All indicators use min-max normalization:

$$\text{normalized} = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$$

Safe for edge cases: when $x_{\max} = x_{\min}$, returns 0.5.

---

## 6. MCDM Engine

Weighted Sum Model (WSM):

$$\text{Risk} = w_1 \cdot \text{Flood} + w_2 \cdot \text{Terrain} + w_3 \cdot \text{Rainfall} + w_4 \cdot \text{Exposure}$$

**Default weights:**

| Indicator | Default Weight |
|-----------|---------------|
| Flood | 40% |
| Terrain | 25% |
| Rainfall | 20% |
| Exposure | 15% |

Weights are automatically normalized to sum to 1.0.

---

## 7. Emergency Routing

A road-network graph is built from OSM road data using NetworkX. Each road segment receives a `risk_cost` weight proportional to the MCDM composite risk score at that segment.

- **Shortest Route**: Dijkstra on distance weight
- **Least-Risk Route**: Dijkstra on `risk_cost` weight

The system reports: distance (km), ETA, risk score, and a percentage risk reduction between routes.

---

## 8. Risk Classification

| Score | Class |
|-------|-------|
| 0.00 – 0.20 | LOW |
| 0.20 – 0.40 | MODERATE |
| 0.40 – 0.60 | HIGH |
| 0.60 – 0.80 | VERY HIGH |
| 0.80 – 1.00 | EXTREME |

---

## 9. API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/analysis` | POST | Start analysis (async) |
| `/api/analysis/{id}/status` | GET | Poll status |
| `/api/analysis/{id}/results` | GET | Get results |
| `/api/analysis/aois` | GET | List available AOIs |
| `/api/route` | POST | Generate routing pair |
| `/api/facilities/{aoi_id}` | GET | List hospitals + shelters |
| `/api/datasets/status` | GET | GEE dataset availability |

---

## 10. Setup Instructions

### Prerequisites

- Python 3.10+ (3.14 confirmed working)
- Node.js 18+ (v24 confirmed working)
- Google Earth Engine account (optional — app runs in demo mode without it)

### Backend Setup

```powershell
cd E:\GEOIMPATHON\DAY2\backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**For GEE integration** (optional):
```powershell
# Authenticate Earth Engine
earthengine authenticate --auth_mode=notebook
```
Set `EARTHENGINE_PROJECT` in a `.env` file (copy from `.env.example`).

### Frontend Setup

```powershell
cd E:\GEOIMPATHON\DAY2\frontend
npm install
```

---

## 11. Running the Application

### Option A — Scripts (Windows)

```powershell
# Terminal 1 — Backend
.\scripts\start_backend.bat

# Terminal 2 — Frontend
.\scripts\start_frontend.bat
```

### Option B — Manual

```powershell
# Backend
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (separate terminal)
cd frontend
npm run dev
```

Open: **http://localhost:5173**

### Option C — Docker

```powershell
docker-compose up
```

---

## 12. Demo AOIs

| ID | Name | Center | Notes |
|----|------|--------|-------|
| `chennai` | Chennai, Tamil Nadu | 13.08°N, 80.27°E | Coastal flood + rainfall risk |
| `siliguri` | Siliguri, West Bengal | 26.72°N, 88.43°E | Teesta river flooding |
| `guwahati` | Guwahati, Assam | 26.14°N, 91.74°E | Brahmaputra floodplains |
| `bengaluru` | Bengaluru, Karnataka | 12.97°N, 77.59°E | Urban stormwater / lake flooding |

---

## 13. Project Structure

```
E:\GEOIMPATHON\DAY2\
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI route handlers
│   │   ├── models/        # Pydantic schemas
│   │   └── services/      # Business logic + GEE calls
│   ├── tests/             # pytest tests (15/15 passing)
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   └── types/         # TypeScript interfaces
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── scripts/
│   ├── start_backend.bat
│   └── start_frontend.bat
├── UIUX/
│   └── code.html          # Reference prototype
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## Authors

Built for **GEOIMPATHON 2026 — Day 2 Challenge**  
Stack: GEE + FastAPI + React + Leaflet + NetworkX
