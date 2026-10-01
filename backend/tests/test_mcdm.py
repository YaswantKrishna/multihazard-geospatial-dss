import pytest
from app.models.schemas import MCDMWeights
from app.services.mcdm_service import MCDMService

def test_mcdm_weights_normalization():
    # Weights summing to 100
    w = MCDMWeights(flood=40, terrain=25, rainfall=20, exposure=15)
    norm = w.normalized()
    assert norm.flood == 0.40
    assert norm.terrain == 0.25
    assert norm.rainfall == 0.20
    assert norm.exposure == 0.15
    assert round(norm.flood + norm.terrain + norm.rainfall + norm.exposure, 2) == 1.0

def test_mcdm_zero_total_weight():
    w = MCDMWeights(flood=0, terrain=0, rainfall=0, exposure=0)
    with pytest.raises(ValueError, match="Total MCDM weight cannot be zero"):
        w.normalized()

def test_mcdm_composite_risk_calculation():
    weights = MCDMWeights(flood=0.40, terrain=0.25, rainfall=0.20, exposure=0.15)
    risk = MCDMService.calculate_composite_risk(
        flood=0.88,
        terrain=0.20,
        rainfall=0.70,
        exposure=0.85,
        weights=weights
    )
    # Expected: 0.40*0.88 + 0.25*0.20 + 0.20*0.70 + 0.15*0.85 = 0.352 + 0.05 + 0.14 + 0.1275 = 0.6695 -> ~0.67
    assert 0.65 <= risk <= 0.68
    assert MCDMService.classify_risk(risk) == "VERY HIGH"

def test_risk_classification_brackets():
    assert MCDMService.classify_risk(0.15) == "LOW"
    assert MCDMService.classify_risk(0.35) == "MODERATE"
    assert MCDMService.classify_risk(0.55) == "HIGH"
    assert MCDMService.classify_risk(0.75) == "VERY HIGH"
    assert MCDMService.classify_risk(0.95) == "EXTREME"
