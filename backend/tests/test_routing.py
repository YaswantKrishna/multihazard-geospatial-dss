import pytest
from app.models.schemas import Coordinate
from app.services.routing_service import RoutingService
from app.services.demo_data import DEMO_AOIS

def test_routing_shortest_vs_least_risk():
    road_network = DEMO_AOIS["chennai"]["road_network"]
    service = RoutingService(road_network)

    origin = Coordinate(lat=13.0235, lng=80.2415) # Kotturpuram
    dest = Coordinate(lat=13.0604, lng=80.2505)   # Apollo Greams

    response = service.calculate_routes(origin=origin, destination=dest, risk_weight=5.0)

    # Least-risk route should have lower or equal risk than shortest route
    assert response.least_risk_route.risk_score <= response.shortest_route.risk_score
    # Shortest route should have shorter or equal distance than least-risk route
    assert response.shortest_route.distance_km <= response.least_risk_route.distance_km
    # Coordinates should be returned
    assert len(response.shortest_route.coordinates) > 0
    assert len(response.least_risk_route.coordinates) > 0
    # Recommendation string generated
    assert len(response.recommendation) > 0

def test_routing_disconnected_graph():
    # Construct a disconnected graph
    disconnected_geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"risk": 0.1},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[80.1, 13.1], [80.2, 13.2]]
                }
            },
            {
                "type": "Feature",
                "properties": {"risk": 0.1},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[80.8, 13.8], [80.9, 13.9]]
                }
            }
        ]
    }
    service = RoutingService(disconnected_geojson)
    with pytest.raises(ValueError, match="No viable road route was found"):
        service.calculate_routes(
            origin=Coordinate(lat=13.1, lng=80.1),
            destination=Coordinate(lat=13.8, lng=80.8)
        )
