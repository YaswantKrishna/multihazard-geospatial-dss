import uuid
import time
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..models.schemas import (
    AnalysisRequest,
    AnalysisStatusResponse,
    AnalysisResultResponse,
    MCDMWeights,
    HazardContribution,
    RiskDistribution
)
from ..services.demo_data import DEMO_AOIS
from ..services.mcdm_service import MCDMService
from ..services.gee_service import GEEService
from ..services.osm_service import OSMService
from ..services.recommendation_service import RecommendationService

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

# In-memory storage for analysis sessions
analysis_store: Dict[str, Dict[str, Any]] = {}

@router.get("/aois")
def list_aois() -> List[Dict[str, Any]]:
    """
    Returns list of predefined demonstration areas.
    """
    return [
        {
            "id": aoi["id"],
            "name": aoi["name"],
            "state_country": aoi["state_country"],
            "center": aoi["center"],
            "zoom": aoi["zoom"],
            "area_sqkm": aoi["area_sqkm"],
            "elevation_msl": aoi["elevation_msl"],
            "population_est": aoi["population_est"],
            "context": aoi["context"],
            "default_origin": aoi["default_origin"],
            "default_destination": aoi["default_destination"]
        }
        for aoi in DEMO_AOIS.values()
    ]

@router.post("", response_model=AnalysisStatusResponse)
def start_analysis(req: AnalysisRequest):
    """
    Initiates multi-hazard geospatial analysis for the given AOI and MCDM weights.
    """
    analysis_id = str(uuid.uuid4())
    aoi_id = (req.aoi_id or "chennai").lower()
    
    if aoi_id not in DEMO_AOIS:
        # Fallback to chennai if unknown
        aoi_id = "chennai"
        
    demo_spec = DEMO_AOIS[aoi_id]
    weights = req.weights.normalized()

    # Calculate customized risk based on weights
    # Default baseline scores for indicators in this AOI
    flood_val = 0.88 if aoi_id == "chennai" else 0.75
    slope_val = 0.20 if aoi_id == "chennai" else (0.80 if aoi_id == "siliguri" else 0.50)
    rain_val = 0.70
    exposure_val = 0.85 if aoi_id in ["chennai", "bengaluru"] else 0.60

    composite_risk = MCDMService.calculate_composite_risk(
        flood=flood_val,
        terrain=slope_val,
        rainfall=rain_val,
        exposure=exposure_val,
        weights=weights
    )
    risk_class = MCDMService.classify_risk(composite_risk)
    contributions, dominant_hazard = MCDMService.calculate_attribution(
        avg_flood=flood_val,
        avg_terrain=slope_val,
        avg_rainfall=rain_val,
        avg_exposure=exposure_val,
        weights=weights
    )

    hotspots = demo_spec["hotspots"]
    facilities = OSMService.get_facilities_for_aoi(aoi_id, demo_spec)
    road_network = OSMService.get_road_network(aoi_id, demo_spec)

    recommendations = RecommendationService.generate_analysis_recommendations(
        aoi_name=demo_spec["name"],
        overall_risk_score=composite_risk,
        dominant_hazard=dominant_hazard,
        hotspots_count=len(hotspots),
        top_hotspot_name=hotspots[0]["name"] if hotspots else "Sector Alpha",
        hospitals_count=len([f for f in facilities if f.type == "hospital"]),
        shelters_count=len([f for f in facilities if f.type == "shelter"]),
        dominant_pct=getattr(contributions, dominant_hazard.lower().split()[0], 40.0) if hasattr(contributions, dominant_hazard.lower().split()[0]) else 40.0
    )

    # Store full analysis state
    analysis_store[analysis_id] = {
        "status": "completed",
        "progress": 100,
        "stage": "Risk map generated",
        "created_at": time.time(),
        "result": AnalysisResultResponse(
            analysis_id=analysis_id,
            aoi_id=aoi_id,
            aoi_name=demo_spec["name"],
            overall_risk_score=composite_risk,
            overall_risk_class=risk_class,
            dominant_hazard=dominant_hazard,
            weights=weights,
            contributions=contributions,
            risk_distribution=RiskDistribution(**demo_spec["risk_distribution"]),
            hotspots=hotspots,
            facilities=facilities,
            layers={
                "road_network": road_network,
                "hotspots": hotspots,
                "center": demo_spec["center"],
                "zoom": demo_spec["zoom"]
            },
            recommendations=recommendations,
            data_sources_status=GEEService.get_dataset_status(),
            is_demo=True,
            elevation_msl=demo_spec.get("elevation_msl", 6.4),
            population_est=demo_spec.get("population_est", "8.94 M")
        )
    }

    return AnalysisStatusResponse(
        analysis_id=analysis_id,
        status="completed",
        progress=100,
        stage="Risk map generated",
        message="Analysis completed successfully."
    )

@router.get("/{analysis_id}/status", response_model=AnalysisStatusResponse)
def get_status(analysis_id: str):
    if analysis_id not in analysis_store:
        raise HTTPException(status_code=404, detail="Analysis session not found.")
    data = analysis_store[analysis_id]
    return AnalysisStatusResponse(
        analysis_id=analysis_id,
        status=data["status"],
        progress=data["progress"],
        stage=data["stage"]
    )

@router.get("/{analysis_id}/results", response_model=AnalysisResultResponse)
def get_results(analysis_id: str):
    if analysis_id not in analysis_store:
        raise HTTPException(status_code=404, detail="Analysis session not found.")
    data = analysis_store[analysis_id]
    return data["result"]
