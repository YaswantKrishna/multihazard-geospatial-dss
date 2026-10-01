from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator

class MCDMWeights(BaseModel):
    flood: float = Field(0.40, ge=0.0, description="Flood weight")
    terrain: float = Field(0.25, ge=0.0, description="Terrain/Slope weight")
    rainfall: float = Field(0.20, ge=0.0, description="Extreme Rainfall weight")
    exposure: float = Field(0.15, ge=0.0, description="Human Exposure weight")

    def normalized(self) -> "MCDMWeights":
        total = self.flood + self.terrain + self.rainfall + self.exposure
        if total <= 0:
            raise ValueError("Total MCDM weight cannot be zero.")
        return MCDMWeights(
            flood=round(self.flood / total, 4),
            terrain=round(self.terrain / total, 4),
            rainfall=round(self.rainfall / total, 4),
            exposure=round(self.exposure / total, 4)
        )

class Coordinate(BaseModel):
    lat: float
    lng: float

class AnalysisRequest(BaseModel):
    aoi_id: Optional[str] = "chennai"
    aoi_name: Optional[str] = "Chennai Metropolitan Region"
    geometry: Optional[Dict[str, Any]] = None
    start_date: str = "2026-09-01"
    end_date: str = "2026-09-30"
    weights: MCDMWeights = Field(default_factory=MCDMWeights)
    preset: Optional[str] = "humanitarian"

class AnalysisStatusResponse(BaseModel):
    analysis_id: str
    status: str # "queued", "processing", "completed", "failed"
    progress: int
    stage: str
    message: Optional[str] = None

class HazardContribution(BaseModel):
    flood: float
    terrain: float
    rainfall: float
    exposure: float

class RiskDistribution(BaseModel):
    low: float
    moderate: float
    high: float
    very_high: float
    extreme: float

class Facility(BaseModel):
    id: str
    name: str
    type: str # "hospital" or "shelter"
    lat: float
    lng: float
    capacity: Optional[str] = None
    status: Optional[str] = "Active"

class HotspotCluster(BaseModel):
    id: str
    name: str
    risk_score: float
    dominant_hazard: str
    depth_or_intensity: Optional[str] = None
    nearest_hospital: str
    nearest_shelter: str
    lat: float
    lng: float
    polygon: Optional[List[List[float]]] = None

class AnalysisResultResponse(BaseModel):
    analysis_id: str
    aoi_id: str
    aoi_name: str
    overall_risk_score: float
    overall_risk_class: str
    dominant_hazard: str
    weights: MCDMWeights
    contributions: HazardContribution
    risk_distribution: RiskDistribution
    hotspots: List[HotspotCluster]
    facilities: List[Facility]
    layers: Dict[str, Any]
    recommendations: List[str]
    data_sources_status: Dict[str, str]
    is_demo: bool = True
    elevation_msl: Optional[float] = 6.4
    population_est: Optional[str] = "8.94 M"

class RouteRequest(BaseModel):
    analysis_id: str
    origin: Coordinate
    destination: Coordinate
    origin_name: Optional[str] = "Origin"
    destination_name: Optional[str] = "Destination"
    risk_weight: float = Field(5.0, ge=0.0)

class RouteDetail(BaseModel):
    route_type: str # "shortest" or "least_risk"
    distance_km: float
    eta_minutes: float
    risk_score: float
    risk_class: str
    high_risk_segments_count: int
    coordinates: List[List[float]] # [[lat, lng], ...]
    status_label: str

class RouteResponse(BaseModel):
    shortest_route: RouteDetail
    least_risk_route: RouteDetail
    additional_distance_km: float
    risk_reduction_pct: float
    recommendation: str
