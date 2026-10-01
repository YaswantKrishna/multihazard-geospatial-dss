from typing import List
from ..models.schemas import AnalysisResultResponse, RouteResponse

class RecommendationService:
    @staticmethod
    def generate_analysis_recommendations(
        aoi_name: str,
        overall_risk_score: float,
        dominant_hazard: str,
        hotspots_count: int,
        top_hotspot_name: str,
        hospitals_count: int,
        shelters_count: int,
        dominant_pct: float
    ) -> List[str]:
        """
        Generates metric-grounded factual recommendations for disaster decision-makers.
        """
        recommendations = []

        # 1. Threat severity statement
        if overall_risk_score >= 0.60:
            recommendations.append(
                f"CRITICAL ALERT: Modeled sector risk in {aoi_name} is elevated at {overall_risk_score:.2f} (HIGH HAZARD). Immediate evacuation priority should be assigned to vulnerable low-lying zones."
            )
        else:
            recommendations.append(
                f"Modeled sector risk in {aoi_name} is currently {overall_risk_score:.2f}. Incident commanders should maintain monitoring of critical corridors."
            )

        # 2. Dominant hazard factor
        recommendations.append(
            f"{dominant_hazard} represents the primary driver of aggregate threat, accounting for {dominant_pct:.1f}% of total weighted multi-hazard attribution."
        )

        # 3. Hotspot containment
        if hotspots_count > 0:
            recommendations.append(
                f"{hotspots_count} priority hazard clusters detected. Focus immediate pumping and barricading operations on the {top_hotspot_name} sector."
            )

        # 4. Critical facility readiness
        recommendations.append(
            f"Command network verified {hospitals_count} designated emergency trauma facilities and {shelters_count} operational relief shelters with active road accessibility."
        )

        # 5. Operational routing doctrine
        recommendations.append(
            "Adopt least-risk routing protocols for all logistics convoys and ambulances to prevent vehicle inundation along submerged river corridors."
        )

        return recommendations

    @staticmethod
    def generate_route_recommendation(route_res: RouteResponse) -> str:
        s = route_res.shortest_route
        lr = route_res.least_risk_route
        diff_km = route_res.additional_distance_km
        reduction = route_res.risk_reduction_pct

        return (
            f"The least-risk route bypasses {s.high_risk_segments_count} active inundation/hazard points, "
            f"reducing hazard exposure by {reduction:.0f}% while adding only {diff_km} km ({lr.eta_minutes - s.eta_minutes:.1f} min). "
            f"Recommended for emergency dispatch."
        )
