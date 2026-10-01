export interface MCDMWeights {
  flood: number;
  terrain: number;
  rainfall: number;
  exposure: number;
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'shelter';
  lat: number;
  lng: number;
  capacity?: string;
  status?: string;
}

export interface Hotspot {
  id: string;
  name: string;
  risk_score: number;
  dominant_hazard: string;
  depth_or_intensity?: string;
  nearest_hospital: string;
  nearest_shelter: string;
  lat: number;
  lng: number;
  polygon?: [number, number][];
}

export interface RiskDistribution {
  low: number;
  moderate: number;
  high: number;
  very_high: number;
  extreme: number;
}

export interface HazardContribution {
  flood: number;
  terrain: number;
  rainfall: number;
  exposure: number;
}

export interface AnalysisResult {
  analysis_id: string;
  aoi_id: string;
  aoi_name: string;
  overall_risk_score: number;
  overall_risk_class: string;
  dominant_hazard: string;
  weights: MCDMWeights;
  contributions: HazardContribution;
  risk_distribution: RiskDistribution;
  hotspots: Hotspot[];
  facilities: Facility[];
  layers: any;
  recommendations: string[];
  data_sources_status: Record<string, string>;
  is_demo: boolean;
  elevation_msl?: number;
  population_est?: string;
}

export interface RouteDetail {
  route_type: string;
  distance_km: number;
  eta_minutes: number;
  risk_score: number;
  risk_class: string;
  high_risk_segments_count: number;
  coordinates: [number, number][];
  status_label: string;
}

export interface RouteResponse {
  shortest_route: RouteDetail;
  least_risk_route: RouteDetail;
  additional_distance_km: number;
  risk_reduction_pct: number;
  recommendation: string;
}

export interface AOI {
  id: string;
  name: string;
  state_country: string;
  center: [number, number];
  zoom: number;
  area_sqkm: number;
  elevation_msl: number;
  population_est: string;
  context: string;
  default_origin: { name: string; lat: number; lng: number };
  default_destination: { name: string; lat: number; lng: number };
}
