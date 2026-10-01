import pytest
import numpy as np
from app.services.hazard_service import normalize, HazardService

def test_normalization_standard():
    assert normalize(5.0, 0.0, 10.0) == 0.5
    assert normalize(10.0, 0.0, 10.0) == 1.0
    assert normalize(0.0, 0.0, 10.0) == 0.0

def test_normalization_clipping():
    # Below min
    assert normalize(-5.0, 0.0, 10.0) == 0.0
    # Above max
    assert normalize(15.0, 0.0, 10.0) == 1.0

def test_normalization_identical_min_max():
    # Should not produce division by zero or NaN
    res = normalize(5.0, 5.0, 5.0)
    assert res == 0.5
    assert not np.isnan(res)

def test_normalization_nan_and_inf():
    assert normalize(float('nan'), 0.0, 10.0) == 0.0
    assert normalize(float('inf'), 0.0, 10.0) == 0.0
    assert normalize(float('-inf'), 0.0, 10.0) == 0.0

def test_hazard_indicators():
    # Flood risk
    f_risk = HazardService.calculate_flood_risk(-5.5, is_water_body=False)
    assert 0.0 <= f_risk <= 1.0
    assert HazardService.calculate_flood_risk(-5.5, is_water_body=True) == 0.0

    # Slope risk
    s_risk = HazardService.calculate_slope_risk(20.0)
    assert 0.0 <= s_risk <= 1.0

    # Rainfall risk
    r_risk = HazardService.calculate_rainfall_risk(250.0, normal_accumulated_mm=150.0)
    assert 0.0 <= r_risk <= 1.0
