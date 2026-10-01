import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.analysis import router as analysis_router
from .api.routing import router as routing_router
from .api.facilities import router as facilities_router
from .api.datasets import router as datasets_router
from .services.gee_service import GEEService

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Non-blocking GEE check / initialization
    GEEService.initialize()
    yield

app = FastAPI(
    title="MULTIHAZARD Geospatial Decision Support & Emergency Routing System",
    description="Production-grade decision-support platform integrating Sentinel-1, Sentinel-2, SRTM, CHIRPS, Dynamic World, and OSM for multi-hazard risk modeling and risk-minimized emergency routing.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for modern web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(analysis_router)
app.include_router(routing_router)
app.include_router(facilities_router)
app.include_router(datasets_router)

@app.get("/")
def root():
    return {
        "system": "MULTIHAZARD Geospatial Decision Support System",
        "version": "1.0.0",
        "status": "operational",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "datasets": GEEService.get_dataset_status()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
