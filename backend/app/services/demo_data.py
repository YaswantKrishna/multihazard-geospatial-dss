from typing import Dict, Any

DEMO_AOIS: Dict[str, Dict[str, Any]] = {
    "chennai": {
        "id": "chennai",
        "name": "Chennai Metropolitan Region",
        "state_country": "Tamil Nadu, India",
        "center": [13.0827, 80.2707],
        "zoom": 12,
        "area_sqkm": 1189,
        "elevation_msl": 6.4,
        "population_est": "8.94 M",
        "context": "Dense Coastal Estuary • Monsoonal Flooding",
        "overall_risk_score": 0.67,
        "overall_risk_class": "HIGH",
        "dominant_hazard": "Flood Inundation",
        "dominant_pct": 40.0,
        "risk_distribution": {
            "low": 24.5,
            "moderate": 32.0,
            "high": 26.5,
            "very_high": 12.0,
            "extreme": 5.0
        },
        "hotspots": [
            {
                "id": "HZ-04",
                "name": "#HZ-04 Adyar River Basin",
                "risk_score": 0.88,
                "dominant_hazard": "Flood Inundation",
                "depth_or_intensity": "Depth: 1.4m • Impassable corridor",
                "nearest_hospital": "Apollo Speciality Greams Rd",
                "nearest_shelter": "Kotturpuram Relief Hall",
                "lat": 13.0230,
                "lng": 80.2390,
                "polygon": [
                    [13.018, 80.228], [13.032, 80.231], [13.035, 80.252],
                    [13.022, 80.258], [13.015, 80.245]
                ]
            },
            {
                "id": "HZ-02",
                "name": "Velachery Lowlands Inundation",
                "risk_score": 0.82,
                "dominant_hazard": "Residential Waterlogging",
                "depth_or_intensity": "Depth: 0.9m • Storm Drain Surcharged",
                "nearest_hospital": "Fortis Malar Adyar",
                "nearest_shelter": "Velachery Flood Camp",
                "lat": 12.9810,
                "lng": 80.2190,
                "polygon": [
                    [12.975, 80.210], [12.990, 80.212], [12.992, 80.229],
                    [12.978, 80.231], [12.972, 80.218]
                ]
            },
            {
                "id": "HZ-01",
                "name": "Manapakkam Flash Surge",
                "risk_score": 0.74,
                "dominant_hazard": "Surface Runoff",
                "depth_or_intensity": "Water Depth: 0.6m",
                "nearest_hospital": "MIOT International",
                "nearest_shelter": "Guindy Industrial Shelter",
                "lat": 13.0189,
                "lng": 80.1832,
                "polygon": [
                    [13.012, 80.175], [13.025, 80.178], [13.027, 80.192],
                    [13.014, 80.195]
                ]
            },
            {
                "id": "HZ-03",
                "name": "North Basin Cooum Overflow",
                "risk_score": 0.69,
                "dominant_hazard": "Riverine Overflow",
                "depth_or_intensity": "Depth: 0.5m",
                "nearest_hospital": "Stanley Medical College",
                "nearest_shelter": "Jawaharlal Camp",
                "lat": 13.0860,
                "lng": 80.2720,
                "polygon": [
                    [13.080, 80.262], [13.092, 80.265], [13.094, 80.280],
                    [13.082, 80.281]
                ]
            }
        ],
        "facilities": [
            {"id": "h1", "name": "Apollo Speciality Hospital (Greams)", "type": "hospital", "lat": 13.0604, "lng": 80.2505, "capacity": "450 Beds", "status": "Active / Trauma Ready"},
            {"id": "h2", "name": "Stanley Medical College Hospital", "type": "hospital", "lat": 13.1075, "lng": 80.2872, "capacity": "1200 Beds", "status": "Active"},
            {"id": "h3", "name": "Rajiv Gandhi Govt General Hospital", "type": "hospital", "lat": 13.0805, "lng": 80.2798, "capacity": "2000 Beds", "status": "Active / Critical Hub"},
            {"id": "h4", "name": "Fortis Malar Hospital Adyar", "type": "hospital", "lat": 13.0067, "lng": 80.2575, "capacity": "180 Beds", "status": "Active"},
            {"id": "h5", "name": "MIOT International Manapakkam", "type": "hospital", "lat": 13.0189, "lng": 80.1832, "capacity": "500 Beds", "status": "Caution (Peripheral Water)"},
            {"id": "h6", "name": "Govt Kilpauk Medical College", "type": "hospital", "lat": 13.0782, "lng": 80.2415, "capacity": "650 Beds", "status": "Active"},
            {"id": "h7", "name": "SIMS Hospital Vadapalani", "type": "hospital", "lat": 13.0514, "lng": 80.2104, "capacity": "350 Beds", "status": "Active"},
            {"id": "h8", "name": "Billroth Hospitals Shenoy Nagar", "type": "hospital", "lat": 13.0821, "lng": 80.2285, "capacity": "250 Beds", "status": "Active"},
            {"id": "s1", "name": "Jawaharlal Camp Relief Center", "type": "shelter", "lat": 13.0850, "lng": 80.2150, "capacity": "1.5k Cap", "status": "Operational"},
            {"id": "s2", "name": "Marina Beach Relief Complex", "type": "shelter", "lat": 13.0550, "lng": 80.2820, "capacity": "2.0k Cap", "status": "Open / Supplies Stocked"},
            {"id": "s3", "name": "Kotturpuram Community Center", "type": "shelter", "lat": 13.0210, "lng": 80.2410, "capacity": "800 Cap", "status": "Open"},
            {"id": "s4", "name": "Velachery Relief Camp", "type": "shelter", "lat": 12.9810, "lng": 80.2190, "capacity": "1.2k Cap", "status": "Active"},
            {"id": "s5", "name": "Guindy Industrial Shelter Hall", "type": "shelter", "lat": 13.0080, "lng": 80.2110, "capacity": "1.0k Cap", "status": "Standby"}
        ],
        "default_origin": {"name": "Kotturpuram Residential Sector", "lat": 13.0235, "lng": 80.2415},
        "default_destination": {"name": "Apollo Speciality Hospital (Greams)", "lat": 13.0604, "lng": 80.2505},
        "road_network": {
            "type": "FeatureCollection",
            "features": [
                # Arterial 1: Direct path from Kotturpuram crossing Adyar flooded corridor (High Risk 0.85)
                {
                    "type": "Feature",
                    "properties": {"name": "Turnbulls Rd / Cenotaph Rd", "highway": "primary", "risk": 0.85},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [80.2415, 13.0235],
                            [80.2430, 13.0310],
                            [80.2460, 13.0390],
                            [80.2480, 13.0490],
                            [80.2505, 13.0604]
                        ]
                    }
                },
                # Arterial 2: Elevated Bypass via Sardar Patel / Anna Salai Upper Ridge (Safe Corridor Risk 0.15)
                {
                    "type": "Feature",
                    "properties": {"name": "Sardar Patel Bypass", "highway": "trunk", "risk": 0.15},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [80.2415, 13.0235],
                            [80.2310, 13.0210],
                            [80.2220, 13.0290],
                            [80.2240, 13.0420],
                            [80.2320, 13.0540],
                            [80.2420, 13.0590],
                            [80.2505, 13.0604]
                        ]
                    }
                },
                # Arterial 3: Northern Corridor to Stanley & Harbor (Risk 0.25)
                {
                    "type": "Feature",
                    "properties": {"name": "North Radial", "highway": "secondary", "risk": 0.25},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [80.2505, 13.0604],
                            [80.2620, 13.0720],
                            [80.2750, 13.0850],
                            [80.2872, 13.1075]
                        ]
                    }
                },
                # Arterial 4: Outer Ring Road west connector (Risk 0.35)
                {
                    "type": "Feature",
                    "properties": {"name": "West Arterial Connector", "highway": "primary", "risk": 0.35},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [80.2220, 13.0290],
                            [80.2050, 13.0380],
                            [80.2104, 13.0514],
                            [80.2285, 13.0821]
                        ]
                    }
                },
                # Arterial 5: Coastal Marina Expressway (Risk 0.20)
                {
                    "type": "Feature",
                    "properties": {"name": "Kamarajar Promenade (Coastal)", "highway": "primary", "risk": 0.20},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [80.2575, 13.0067],
                            [80.2720, 13.0310],
                            [80.2820, 13.0550],
                            [80.2798, 13.0805]
                        ]
                    }
                }
            ]
        }
    },
    "siliguri": {
        "id": "siliguri",
        "name": "Siliguri Sub-Himalayan Corridor",
        "state_country": "West Bengal, India",
        "center": [26.7271, 88.3953],
        "zoom": 12,
        "area_sqkm": 840,
        "elevation_msl": 122.0,
        "population_est": "1.12 M",
        "context": "Foothills Flood & Landslide Gateway",
        "overall_risk_score": 0.58,
        "overall_risk_class": "HIGH",
        "dominant_hazard": "Terrain Slope & Drainage",
        "dominant_pct": 38.0,
        "risk_distribution": {
            "low": 30.0,
            "moderate": 34.0,
            "high": 22.0,
            "very_high": 10.0,
            "extreme": 4.0
        },
        "hotspots": [
            {
                "id": "SG-01",
                "name": "Mahananda River Floodplain",
                "risk_score": 0.81,
                "dominant_hazard": "Riverine Surge",
                "depth_or_intensity": "Water Velocity: 2.1 m/s",
                "nearest_hospital": "Siliguri District Hospital",
                "nearest_shelter": "Mahananda Relief Complex",
                "lat": 26.7210,
                "lng": 88.4210
            },
            {
                "id": "SG-02",
                "name": "Sukna Hill Slope Instability",
                "risk_score": 0.77,
                "dominant_hazard": "Slope Failure",
                "depth_or_intensity": "Slope: 32°",
                "nearest_hospital": "North Bengal Medical College",
                "nearest_shelter": "Sukna Army Camp",
                "lat": 26.7900,
                "lng": 88.3600
            }
        ],
        "facilities": [
            {"id": "sgh1", "name": "North Bengal Medical College Hospital", "type": "hospital", "lat": 26.6850, "lng": 88.3750, "capacity": "900 Beds", "status": "Active"},
            {"id": "sgh2", "name": "Siliguri District Hospital", "type": "hospital", "lat": 26.7150, "lng": 88.4280, "capacity": "400 Beds", "status": "Active"},
            {"id": "sgs1", "name": "Mahananda Relief Complex", "type": "shelter", "lat": 26.7250, "lng": 88.4150, "capacity": "1.2k Cap", "status": "Open"},
            {"id": "sgs2", "name": "Sukna Disaster Hall", "type": "shelter", "lat": 26.7800, "lng": 88.3700, "capacity": "800 Cap", "status": "Active"}
        ],
        "default_origin": {"name": "Sukna Foothills Settlement", "lat": 26.7850, "lng": 88.3650},
        "default_destination": {"name": "North Bengal Medical College", "lat": 26.6850, "lng": 88.3750},
        "road_network": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"name": "Hill Cart Rd (Valley cut)", "highway": "primary", "risk": 0.75},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [88.3650, 26.7850],
                            [88.3850, 26.7550],
                            [88.4050, 26.7200],
                            [88.3750, 26.6850]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {"name": "Western Bypass Ridge", "highway": "trunk", "risk": 0.20},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [88.3650, 26.7850],
                            [88.3500, 26.7500],
                            [88.3480, 26.7100],
                            [88.3750, 26.6850]
                        ]
                    }
                }
            ]
        }
    },
    "guwahati": {
        "id": "guwahati",
        "name": "Guwahati Brahmaputra Basin",
        "state_country": "Assam, India",
        "center": [26.1445, 91.7362],
        "zoom": 12,
        "area_sqkm": 920,
        "elevation_msl": 55.0,
        "population_est": "1.35 M",
        "context": "Major Riverine Floodplain & Landslide Ridges",
        "overall_risk_score": 0.71,
        "overall_risk_class": "HIGH",
        "dominant_hazard": "Flood Inundation",
        "dominant_pct": 42.0,
        "risk_distribution": {
            "low": 20.0,
            "moderate": 28.0,
            "high": 32.0,
            "very_high": 14.0,
            "extreme": 6.0
        },
        "hotspots": [
            {
                "id": "GW-01",
                "name": "Brahmaputra South Embankment",
                "risk_score": 0.91,
                "dominant_hazard": "River Spillage",
                "depth_or_intensity": "Water Depth: 1.8m",
                "nearest_hospital": "Gauhati Medical College",
                "nearest_shelter": "Fancy Bazar Relief Camp",
                "lat": 26.1820,
                "lng": 91.7450
            },
            {
                "id": "GW-02",
                "name": "Narakasur Hill Slope Slip",
                "risk_score": 0.84,
                "dominant_hazard": "Slope Failure",
                "depth_or_intensity": "Debris Flow Risk",
                "nearest_hospital": "Gauhati Medical College",
                "nearest_shelter": "Dispur Relief Hub",
                "lat": 26.1550,
                "lng": 91.7750
            }
        ],
        "facilities": [
            {"id": "gwh1", "name": "Gauhati Medical College & Hospital (GMCH)", "type": "hospital", "lat": 26.1550, "lng": 91.7750, "capacity": "1500 Beds", "status": "Active"},
            {"id": "gwh2", "name": "Mahendra Mohan Choudhury Hospital", "type": "hospital", "lat": 26.1850, "lng": 91.7380, "capacity": "450 Beds", "status": "Active"},
            {"id": "gws1", "name": "Fancy Bazar Multi-Purpose Camp", "type": "shelter", "lat": 26.1800, "lng": 91.7420, "capacity": "2.5k Cap", "status": "Open"},
            {"id": "gws2", "name": "Dispur Stadium Shelter", "type": "shelter", "lat": 26.1400, "lng": 91.7900, "capacity": "1.8k Cap", "status": "Operational"}
        ],
        "default_origin": {"name": "Uzan Bazar Riverside", "lat": 26.1870, "lng": 91.7550},
        "default_destination": {"name": "GMCH Bhangagarh", "lat": 26.1550, "lng": 91.7750},
        "road_network": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"name": "MG Road Riverfront", "highway": "primary", "risk": 0.88},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [91.7550, 26.1870],
                            [91.7650, 26.1750],
                            [91.7750, 26.1550]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {"name": "GS Road High Ridge", "highway": "trunk", "risk": 0.18},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [91.7550, 26.1870],
                            [91.7400, 26.1700],
                            [91.7500, 26.1500],
                            [91.7750, 26.1550]
                        ]
                    }
                }
            ]
        }
    },
    "bengaluru": {
        "id": "bengaluru",
        "name": "Bengaluru Urban Lake Basins",
        "state_country": "Karnataka, India",
        "center": [12.9716, 77.5946],
        "zoom": 12,
        "area_sqkm": 741,
        "elevation_msl": 920.0,
        "population_est": "13.2 M",
        "context": "Urban Stormwater Flash Flood Vulnerability",
        "overall_risk_score": 0.61,
        "overall_risk_class": "HIGH",
        "dominant_hazard": "Extreme Rainfall Anomaly",
        "dominant_pct": 35.0,
        "risk_distribution": {
            "low": 28.0,
            "moderate": 33.0,
            "high": 25.0,
            "very_high": 10.0,
            "extreme": 4.0
        },
        "hotspots": [
            {
                "id": "BLR-01",
                "name": "Bellandur Outer Ring Road Corridor",
                "risk_score": 0.86,
                "dominant_hazard": "Lake Overflow",
                "depth_or_intensity": "Water Stagnation: 1.1m",
                "nearest_hospital": "Manipal Hospital Old Airport Rd",
                "nearest_shelter": "HAL Sports Club Relief Hall",
                "lat": 12.9350,
                "lng": 77.6750
            },
            {
                "id": "BLR-02",
                "name": "Koramangala Lowland Drain Basin",
                "risk_score": 0.79,
                "dominant_hazard": "Drain Backflow",
                "depth_or_intensity": "Depth: 0.8m",
                "nearest_hospital": "St. John's Medical College",
                "nearest_shelter": "Koramangala Indoor Stadium",
                "lat": 12.9320,
                "lng": 77.6250
            }
        ],
        "facilities": [
            {"id": "blrh1", "name": "Manipal Hospital (Old Airport Rd)", "type": "hospital", "lat": 12.9580, "lng": 77.6480, "capacity": "600 Beds", "status": "Active"},
            {"id": "blrh2", "name": "St. John's Medical College Hospital", "type": "hospital", "lat": 12.9320, "lng": 77.6180, "capacity": "1350 Beds", "status": "Active"},
            {"id": "blrh3", "name": "Bowring & Lady Curzon Hospital", "type": "hospital", "lat": 12.9820, "lng": 77.6040, "capacity": "700 Beds", "status": "Active"},
            {"id": "blrs1", "name": "Koramangala Indoor Stadium Camp", "type": "shelter", "lat": 12.9360, "lng": 77.6210, "capacity": "2.0k Cap", "status": "Open"},
            {"id": "blrs2", "name": "HAL Sports Complex", "type": "shelter", "lat": 12.9600, "lng": 77.6650, "capacity": "1.5k Cap", "status": "Operational"}
        ],
        "default_origin": {"name": "Ecospace Business Park (Bellandur)", "lat": 12.9280, "lng": 77.6850},
        "default_destination": {"name": "Manipal Hospital Old Airport Rd", "lat": 12.9580, "lng": 77.6480},
        "road_network": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {"name": "Outer Ring Road (Submerged Section)", "highway": "primary", "risk": 0.82},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [77.6850, 12.9280],
                            [77.6750, 12.9350],
                            [77.6600, 12.9480],
                            [77.6480, 12.9580]
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {"name": "Wind Tunnel Road Elevated Cut", "highway": "secondary", "risk": 0.16},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [77.6850, 12.9280],
                            [77.6700, 12.9200],
                            [77.6400, 12.9380],
                            [77.6480, 12.9580]
                        ]
                    }
                }
            ]
        }
    }
}
