import math
import networkx as nx
from typing import Dict, Any, List, Optional, Tuple
from ..models.schemas import RouteDetail, RouteResponse, Coordinate

def haversine_distance_km(coord1: List[float], coord2: List[float]) -> float:
    """
    Calculates great-circle distance between two [lat, lng] coordinates in kilometers.
    """
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return 6371.0 * c

class RoutingService:
    def __init__(self, road_network: Optional[Dict[str, Any]] = None):
        self.graph = nx.Graph()
        self.nodes_coords = {}
        if road_network:
            self.build_graph_from_geojson(road_network)

    def build_graph_from_geojson(self, geojson_data: Dict[str, Any]):
        """
        Builds a NetworkX graph from GeoJSON LineStrings with risk annotations.
        """
        features = geojson_data.get("features", [])
        node_id_counter = 0
        coord_to_node = {}

        for feat in features:
            geom = feat.get("geometry", {})
            props = feat.get("properties", {})
            if geom.get("type") == "LineString":
                coords = geom.get("coordinates", [])
                risk = float(props.get("risk", 0.15))
                road_type = props.get("highway", "primary")

                for i in range(len(coords) - 1):
                    # GeoJSON is [lng, lat], convert to [lat, lng]
                    p1 = (round(coords[i][1], 5), round(coords[i][0], 5))
                    p2 = (round(coords[i+1][1], 5), round(coords[i+1][0], 5))

                    if p1 not in coord_to_node:
                        coord_to_node[p1] = f"n_{node_id_counter}"
                        self.nodes_coords[f"n_{node_id_counter}"] = [p1[0], p1[1]]
                        node_id_counter += 1
                    if p2 not in coord_to_node:
                        coord_to_node[p2] = f"n_{node_id_counter}"
                        self.nodes_coords[f"n_{node_id_counter}"] = [p2[0], p2[1]]
                        node_id_counter += 1

                    u = coord_to_node[p1]
                    v = coord_to_node[p2]
                    dist_km = haversine_distance_km(list(p1), list(p2))
                    if dist_km == 0:
                        dist_km = 0.05 # minimum segment length 50m

                    self.graph.add_edge(
                        u, v,
                        distance=dist_km,
                        risk=risk,
                        highway=road_type
                    )

    def find_nearest_node(self, target_lat: float, target_lng: float) -> str:
        """
        Finds the closest node in the road graph to the given target coordinate.
        """
        if not self.nodes_coords:
            raise ValueError("Road network is empty.")
            
        best_node = None
        min_dist = float("inf")
        target = [target_lat, target_lng]

        for node, coord in self.nodes_coords.items():
            d = haversine_distance_km(target, coord)
            if d < min_dist:
                min_dist = d
                best_node = node
        return best_node

    def calculate_routes(
        self,
        origin: Coordinate,
        destination: Coordinate,
        risk_weight: float = 5.0
    ) -> RouteResponse:
        """
        Calculates both the Shortest Route (distance only) and
        Least-Risk Route (Edge Cost = Distance * (1 + risk_weight * Risk)).
        """
        if self.graph.number_of_nodes() == 0:
            raise ValueError("Road network graph is uninitialized.")

        start_node = self.find_nearest_node(origin.lat, origin.lng)
        end_node = self.find_nearest_node(destination.lat, destination.lng)

        if not nx.has_path(self.graph, start_node, end_node):
            raise ValueError("No viable road route was found between the selected locations.")

        # 1. Shortest Route: weight = 'distance'
        shortest_path = nx.shortest_path(self.graph, start_node, end_node, weight="distance")
        shortest_metrics = self._evaluate_path_metrics(shortest_path, is_least_risk=False)

        # 2. Least-Risk Route: weight = distance * (1 + risk_weight * risk)
        # Assign risk-weighted cost to edges
        for u, v, data in self.graph.edges(data=True):
            dist = data.get("distance", 1.0)
            risk = data.get("risk", 0.1)
            # Edge Cost = Distance * (1 + lambda * Risk)
            data["risk_cost"] = dist * (1.0 + risk_weight * (risk ** 1.5))

        least_risk_path = nx.shortest_path(self.graph, start_node, end_node, weight="risk_cost")
        least_risk_metrics = self._evaluate_path_metrics(least_risk_path, is_least_risk=True)

        additional_dist = round(max(0.0, least_risk_metrics.distance_km - shortest_metrics.distance_km), 2)
        
        # Risk reduction %
        if shortest_metrics.risk_score > 0:
            reduction = round(((shortest_metrics.risk_score - least_risk_metrics.risk_score) / shortest_metrics.risk_score) * 100.0, 1)
            reduction = max(0.0, reduction)
        else:
            reduction = 0.0

        recommendation = (
            f"The least-risk route reduces modeled route hazard exposure by {reduction}% "
            f"while adding {additional_dist} km compared to the shortest route. "
            f"Recommended for emergency dispatch and evacuation convoys."
        )

        return RouteResponse(
            shortest_route=shortest_metrics,
            least_risk_route=least_risk_metrics,
            additional_distance_km=additional_dist,
            risk_reduction_pct=reduction,
            recommendation=recommendation
        )

    def _evaluate_path_metrics(self, path: List[str], is_least_risk: bool) -> RouteDetail:
        total_dist = 0.0
        weighted_risk_sum = 0.0
        high_risk_count = 0
        coords = []

        for i in range(len(path)):
            coords.append(self.nodes_coords[path[i]])
            if i < len(path) - 1:
                u, v = path[i], path[i+1]
                edge_data = self.graph[u][v]
                d = edge_data.get("distance", 0.5)
                r = edge_data.get("risk", 0.2)
                total_dist += d
                weighted_risk_sum += d * r
                if r >= 0.60:
                    high_risk_count += 1

        avg_risk = round(weighted_risk_sum / max(0.001, total_dist), 2)
        avg_risk = min(max(avg_risk, 0.0), 1.0)
        
        # Base speed 40 km/h in urban emergency conditions
        # Speed slows down drastically in high risk flooded areas
        speed_factor = max(0.3, 1.0 - (avg_risk * 0.7))
        effective_speed_kmh = 45.0 * speed_factor
        eta_minutes = round((total_dist / effective_speed_kmh) * 60.0, 1)

        if avg_risk >= 0.60:
            status_label = "Impassable / Hazardous"
            risk_class = "HIGH HAZARD"
        elif avg_risk >= 0.40:
            status_label = "Caution Required"
            risk_class = "MODERATE"
        else:
            status_label = "Safe Passage"
            risk_class = "LOW RISK"

        return RouteDetail(
            route_type="least_risk" if is_least_risk else "shortest",
            distance_km=round(total_dist, 2),
            eta_minutes=eta_minutes,
            risk_score=avg_risk,
            risk_class=risk_class,
            high_risk_segments_count=high_risk_count,
            coordinates=coords,
            status_label=status_label
        )
