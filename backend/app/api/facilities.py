from fastapi import APIRouter, HTTPException
from typing import List
from ..models.schemas import Facility
from ..services.demo_data import DEMO_AOIS
from ..services.osm_service import OSMService

router = APIRouter(prefix="/api/facilities", tags=["Facilities"])

@router.get("/{aoi_id}", response_model=List[Facility])
def get_facilities(aoi_id: str):
    aoi_key = aoi_id.lower()
    if aoi_key not in DEMO_AOIS:
        raise HTTPException(status_code=404, detail="AOI not found.")
    return OSMService.get_facilities_for_aoi(aoi_key, DEMO_AOIS[aoi_key])
