from typing import Dict, Tuple
from ..models.schemas import MCDMWeights, RiskDistribution, HazardContribution

class MCDMService:
    @staticmethod
    def classify_risk(score: float) -> str:
        """
        Classify risk score into standard 5 categories:
        0.00–0.20: LOW
        0.20–0.40: MODERATE
        0.40–0.60: HIGH
        0.60–0.80: VERY HIGH
        0.80–1.00: EXTREME
        """
        if score < 0.20:
            return "LOW"
        elif score < 0.40:
            return "MODERATE"
        elif score < 0.60:
            return "HIGH"
        elif score < 0.80:
            return "VERY HIGH"
        else:
            return "EXTREME"

    @staticmethod
    def calculate_composite_risk(
        flood: float,
        terrain: float,
        rainfall: float,
        exposure: float,
        weights: MCDMWeights
    ) -> float:
        """
        Calculates Multi-Criteria Weighted Sum Model:
        Risk = w_flood * Flood + w_terrain * Terrain + w_rain * Rainfall + w_exposure * Exposure
        """
        norm_weights = weights.normalized()
        composite = (
            norm_weights.flood * flood +
            norm_weights.terrain * terrain +
            norm_weights.rainfall * rainfall +
            norm_weights.exposure * exposure
        )
        return round(float(min(max(composite, 0.0), 1.0)), 4)

    @staticmethod
    def calculate_attribution(
        avg_flood: float,
        avg_terrain: float,
        avg_rainfall: float,
        avg_exposure: float,
        weights: MCDMWeights
    ) -> Tuple[HazardContribution, str]:
        """
        Calculates proportional contribution of each hazard indicator to overall risk
        and determines dominant hazard.
        """
        w = weights.normalized()
        c_flood = w.flood * avg_flood
        c_terrain = w.terrain * avg_terrain
        c_rainfall = w.rainfall * avg_rainfall
        c_exposure = w.exposure * avg_exposure

        total_contrib = c_flood + c_terrain + c_rainfall + c_exposure
        if total_contrib <= 0:
            # Fallback to weights directly
            total_w = w.flood + w.terrain + w.rainfall + w.exposure
            pct_flood = round((w.flood / total_w) * 100, 1)
            pct_terrain = round((w.terrain / total_w) * 100, 1)
            pct_rainfall = round((w.rainfall / total_w) * 100, 1)
            pct_exposure = round((w.exposure / total_w) * 100, 1)
        else:
            pct_flood = round((c_flood / total_contrib) * 100, 1)
            pct_terrain = round((c_terrain / total_contrib) * 100, 1)
            pct_rainfall = round((c_rainfall / total_contrib) * 100, 1)
            pct_exposure = round((c_exposure / total_contrib) * 100, 1)

        # Determine dominant hazard
        scores = {
            "Flood Inundation": c_flood,
            "Terrain Slope": c_terrain,
            "Extreme Rainfall": c_rainfall,
            "Population Exposure": c_exposure
        }
        dominant = max(scores, key=scores.get)

        contributions = HazardContribution(
            flood=pct_flood,
            terrain=pct_terrain,
            rainfall=pct_rainfall,
            exposure=pct_exposure
        )
        return contributions, dominant
