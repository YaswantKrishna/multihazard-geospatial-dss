from fastapi import APIRouter
from typing import Dict
from ..services.gee_service import GEEService

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("/status")
def get_sensor_availability() -> Dict[str, str]:
    """
    Returns verified availability and telemetry status for Sentinel-1, Sentinel-2, CHIRPS, SRTM, Dynamic World, and OSM.
    """
    return GEEService.get_dataset_status()
