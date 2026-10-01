import os
import json
import logging
from typing import Dict, Any, List
from ..models.schemas import Facility

logger = logging.getLogger(__name__)

class OSMService:
    @staticmethod
    def get_facilities_for_aoi(aoi_id: str, demo_data: Dict[str, Any]) -> List[Facility]:
        """
        Retrieves hospitals and shelters for the AOI.
        """
        facilities_raw = demo_data.get("facilities", [])
        facilities = []
        for f in facilities_raw:
            facilities.append(Facility(
                id=f.get("id"),
                name=f.get("name"),
                type=f.get("type"),
                lat=f.get("lat"),
                lng=f.get("lng"),
                capacity=f.get("capacity"),
                status=f.get("status", "Active")
            ))
        return facilities

    @staticmethod
    def get_road_network(aoi_id: str, demo_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retrieves road network FeatureCollection with risk attributes.
        """
        return demo_data.get("road_network", {"type": "FeatureCollection", "features": []})
