import numpy as np
from typing import Dict, Any, List, Optional

def normalize(val: float, min_val: float, max_val: float, invert: bool = False) -> float:
    """
    Standard normalization to [0.0, 1.0] range.
    Handles max_val == min_val, NaN, Inf, and applies clipping.
    """
    if np.isnan(val) or np.isinf(val):
        return 0.0
    
    if max_val == min_val:
        return 0.5 if not invert else 0.5
    
    norm = (val - min_val) / (max_val - min_val)
    if invert:
        norm = 1.0 - norm
        
    return float(np.clip(norm, 0.0, 1.0))

class HazardService:
    @staticmethod
    def calculate_flood_risk(backscatter_diff_db: float, is_water_body: bool = False) -> float:
        """
        Calculates flood risk based on Sentinel-1 SAR backscatter decrease.
        Permanent water bodies are masked out (not classified as disaster flood).
        """
        if is_water_body:
            return 0.0
        # A drop of 3dB to 12dB typically indicates newly inundated specular surfaces
        # Range: -12 dB (high inundation probability) to 0 dB (no change)
        if backscatter_diff_db >= 0:
            return 0.0
        # drop is negative
        drop = abs(backscatter_diff_db)
        return normalize(drop, min_val=1.0, max_val=10.0)

    @staticmethod
    def calculate_slope_risk(slope_degrees: float) -> float:
        """
        Calculates terrain slope hazard (0.0 to 1.0).
        Labeled strictly as 'Terrain/Slope Risk'.
        Slope > 35 degrees indicates extreme gravitational instability/runoff velocity.
        """
        return normalize(slope_degrees, min_val=0.0, max_val=40.0)

    @staticmethod
    def calculate_rainfall_risk(accumulated_mm_30d: float, normal_accumulated_mm: float = 150.0) -> float:
        """
        Calculates extreme rainfall anomaly and intensity indicator (0.0 to 1.0).
        """
        # Anomaly ratio
        ratio = accumulated_mm_30d / max(1.0, normal_accumulated_mm)
        # 0.5 ratio is low, 2.5+ ratio is extreme monsoon anomaly
        return normalize(ratio, min_val=0.5, max_val=2.5)

    @staticmethod
    def calculate_exposure_risk(built_up_fraction: float, population_density_sqkm: float) -> float:
        """
        Calculates human exposure from Dynamic World built-up and OSM settlement density.
        """
        norm_built = normalize(built_up_fraction, min_val=0.0, max_val=1.0)
        norm_pop = normalize(population_density_sqkm, min_val=500.0, max_val=25000.0)
        return float(np.clip(0.6 * norm_built + 0.4 * norm_pop, 0.0, 1.0))
