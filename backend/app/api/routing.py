from fastapi import APIRouter, HTTPException
from ..models.schemas import RouteRequest, RouteResponse
from .analysis import analysis_store
from ..services.routing_service import RoutingService
from ..services.demo_data import DEMO_AOIS

router = APIRouter(prefix="/api/route", tags=["Routing"])

@router.post("", response_model=RouteResponse)
def calculate_emergency_route(req: RouteRequest):
    """
    Computes both Shortest (distance-only) and Least-Risk (MCDM-hazard-penalized) routes.
    """
    # Look up analysis session
    if req.analysis_id not in analysis_store:
        # Fallback to default chennai road network if unknown or test
        demo_spec = DEMO_AOIS["chennai"]
        road_network = demo_spec["road_network"]
    else:
        session = analysis_store[req.analysis_id]
        aoi_id = session["result"].aoi_id
        road_network = session["result"].layers.get("road_network", DEMO_AOIS[aoi_id]["road_network"])

    try:
        routing_service = RoutingService(road_network)
        result = routing_service.calculate_routes(
            origin=req.origin,
            destination=req.destination,
            risk_weight=req.risk_weight
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Route calculation could not complete: {str(e)}"
        )
