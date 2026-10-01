from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_api_list_aois():
    res = client.get("/api/analysis/aois")
    assert res.status_code == 200
    aois = res.json()
    assert len(aois) >= 4
    ids = [a["id"] for a in aois]
    assert "chennai" in ids
    assert "siliguri" in ids
    assert "guwahati" in ids
    assert "bengaluru" in ids

def test_api_start_analysis_and_results():
    payload = {
        "aoi_id": "chennai",
        "aoi_name": "Chennai Metropolitan Region",
        "start_date": "2026-09-01",
        "end_date": "2026-09-30",
        "weights": {
            "flood": 0.40,
            "terrain": 0.25,
            "rainfall": 0.20,
            "exposure": 0.15
        },
        "preset": "humanitarian"
    }
    start_res = client.post("/api/analysis", json=payload)
    assert start_res.status_code == 200
    analysis_id = start_res.json()["analysis_id"]

    status_res = client.get(f"/api/analysis/{analysis_id}/status")
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "completed"

    results_res = client.get(f"/api/analysis/{analysis_id}/results")
    assert results_res.status_code == 200
    data = results_res.json()
    assert data["aoi_id"] == "chennai"
    assert data["overall_risk_score"] > 0.0
    assert len(data["hotspots"]) > 0
    assert len(data["facilities"]) > 0

def test_api_emergency_route():
    payload = {
        "analysis_id": "demo",
        "origin": {"lat": 13.0235, "lng": 80.2415},
        "destination": {"lat": 13.0604, "lng": 80.2505},
        "risk_weight": 5.0
    }
    res = client.post("/api/route", json=payload)
    assert res.status_code == 200
    route_data = res.json()
    assert "shortest_route" in route_data
    assert "least_risk_route" in route_data
    assert route_data["least_risk_route"]["risk_score"] <= route_data["shortest_route"]["risk_score"]
