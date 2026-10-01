import React from 'react';
import { 
  BookOpen, 
  Database, 
  Calculator, 
  Route, 
  ShieldAlert
} from 'lucide-react';

export const AboutMethodologyView: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      {/* Overview Card */}
      <div className="bg-[#151b2b] p-5 rounded-lg border border-[#1f2937] flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
            <BookOpen className="w-6 h-6 text-[#38bdf8]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#dde2f8]">MULTIHAZARD Geospatial Decision Support & Emergency Routing System</h1>
            <p className="text-xs text-[#bdc8d1]">
              Mission-critical disaster risk quantification, multi-criteria decision modeling, and hazard-penalized evacuation routing.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Table (Section 52 Requirements) */}
      <div className="bg-[#151b2b] p-5 rounded-lg border border-[#1f2937] flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-[#263244] pb-2">
          <Database className="w-5 h-5 text-[#38bdf8]" />
          <h2 className="text-base font-bold text-[#dde2f8] uppercase tracking-wider">
            Earth Engine & Geospatial Data Sources
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#263244] text-[#87929a] font-mono uppercase text-[10px]">
                <th className="py-2 px-3">Dataset</th>
                <th className="py-2 px-3">Source / Collection</th>
                <th className="py-2 px-3">Resolution</th>
                <th className="py-2 px-3">Operational Role</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937] font-mono text-[#dde2f8]">
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">Sentinel-1 SAR</td>
                <td className="py-2.5 px-3">COPERNICUS/S1_GRD (VV/VH)</td>
                <td className="py-2.5 px-3">10 m</td>
                <td className="py-2.5 px-3 font-sans">Flood/radar backscatter change detection (all-weather radar)</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">Sentinel-2 MSI</td>
                <td className="py-2.5 px-3">COPERNICUS/S2_SR_HARMONIZED</td>
                <td className="py-2.5 px-3">10–20 m</td>
                <td className="py-2.5 px-3 font-sans">NDVI vegetation health, cloud-masked optical reflectance</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">Landsat 8/9</td>
                <td className="py-2.5 px-3">LANDSAT/LC08/C02/T1_L2</td>
                <td className="py-2.5 px-3">30 m</td>
                <td className="py-2.5 px-3 font-sans">Multi-decadal historical environmental baseline</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">SRTM DEM</td>
                <td className="py-2.5 px-3">USGS/SRTMGL1_003</td>
                <td className="py-2.5 px-3">30 m</td>
                <td className="py-2.5 px-3 font-sans">Elevation & slope derivation (Terrain/Slope hazard index)</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">Dynamic World</td>
                <td className="py-2.5 px-3">GOOGLE/DYNAMICWORLD/V1</td>
                <td className="py-2.5 px-3">10 m</td>
                <td className="py-2.5 px-3 font-sans">Near-real-time built-up, water, vegetation land cover exposure</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">CHIRPS Daily</td>
                <td className="py-2.5 px-3">UCSB-CHG/CHIRPS/DAILY</td>
                <td className="py-2.5 px-3">0.05° (~5 km)</td>
                <td className="py-2.5 px-3 font-sans">30-day cumulative precipitation & monsoon anomaly</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">JRC Surface Water</td>
                <td className="py-2.5 px-3">JRC/GSW1_4/GlobalSurfaceWater</td>
                <td className="py-2.5 px-3">30 m</td>
                <td className="py-2.5 px-3 font-sans">Historical permanent water occurrence masking</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#38bdf8]">OpenStreetMap</td>
                <td className="py-2.5 px-3">Overpass API / Geofabrik</td>
                <td className="py-2.5 px-3">Vector</td>
                <td className="py-2.5 px-3 font-sans">Road network graphs, trauma hospitals, relief shelters</td>
                <td className="py-2.5 px-3 text-[#22c55e]">● Available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mathematical & Analytical Formulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Normalization & MCDM */}
        <div className="bg-[#151b2b] p-5 rounded-lg border border-[#1f2937] flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-[#263244] pb-2">
            <Calculator className="w-5 h-5 text-[#ffc176]" />
            <h3 className="text-sm font-bold text-[#dde2f8] uppercase tracking-wider">
              1. Normalization & MCDM Model
            </h3>
          </div>
          <div className="text-xs text-[#bdc8d1] space-y-2 leading-relaxed font-sans">
            <p>
              Each numerical hazard layer is scaled onto an invariant <code className="text-[#38bdf8] font-mono">[0.0, 1.0]</code> interval using robust clipping:
            </p>
            <div className="bg-[#080e1d] p-3 rounded font-mono text-[#38bdf8] text-center border border-[#263244]">
              Normalized = (Value - Min) / (Max - Min)
            </div>
            <p>
              When <code className="font-mono text-[#dde2f8]">Max == Min</code>, or when encountering <code className="font-mono text-[#dde2f8]">NaN/Inf</code>, the engine falls back to 0.0 or neutral 0.5 without exception.
            </p>
            <p>
              The composite Multi-Hazard Risk Index is computed using a Weighted Sum Model:
            </p>
            <div className="bg-[#080e1d] p-3 rounded font-mono text-[#ffc176] text-center border border-[#263244]">
              Risk = w₁·Flood + w₂·Terrain + w₃·Rainfall + w₄·Exposure
            </div>
            <p>where weights automatically re-normalize such that <code className="font-mono text-[#dde2f8]">∑ wᵢ = 1.0</code>.</p>
          </div>
        </div>

        {/* Emergency Routing Optimization */}
        <div className="bg-[#151b2b] p-5 rounded-lg border border-[#1f2937] flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-[#263244] pb-2">
            <Route className="w-5 h-5 text-[#38bdf8]" />
            <h3 className="text-sm font-bold text-[#dde2f8] uppercase tracking-wider">
              2. Emergency Routing Cost Formulation
            </h3>
          </div>
          <div className="text-xs text-[#bdc8d1] space-y-2 leading-relaxed font-sans">
            <p>
              Emergency evacuation routing strictly rejects simple distance minimization. Instead, the road graph edge impedance is dynamically weighted by intersecting disaster hazard:
            </p>
            <div className="bg-[#080e1d] p-3 rounded font-mono text-[#38bdf8] text-center border border-[#263244]">
              Edge Cost = Distance × (1 + λ × Risk)
            </div>
            <p>
              Where:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-sans">
              <li><strong className="text-[#dde2f8]">Distance:</strong> Great-circle haversine segment length in km.</li>
              <li><strong className="text-[#dde2f8]">Risk:</strong> Mean multi-hazard score intersecting the road segment.</li>
              <li><strong className="text-[#dde2f8]">λ (Risk Aversion Factor):</strong> Default 5.0, penalizing inundated or hazardous roads so Dijkstra search routes around danger.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Limitations and Disclaimers (Section 53 Requirements) */}
      <div className="bg-[#151b2b] p-5 rounded-lg border border-[#ef4444]/40 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-[#263244] pb-2">
          <ShieldAlert className="w-5 h-5 text-[#ef4444]" />
          <h3 className="text-sm font-bold text-[#ffb4ab] uppercase tracking-wider">
            Operational Limitations & System Disclaimers
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#bdc8d1] leading-relaxed">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Satellite Availability:</strong> Synthetic Aperture Radar (Sentinel-1) passes occur on a 6-to-12 day revisit cadence; live cloud coverage may delay optical Sentinel-2 observations.</li>
            <li><strong>SAR Indicator Semantics:</strong> Radar backscatter drop indicates newly inundated specular surfaces, not field-verified ground truth.</li>
            <li><strong>Slope vs. Landslides:</strong> Steep topography is labeled strictly as "Terrain/Slope Risk", avoiding overstating landslide certainty without geotechnical boreholes.</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>OpenStreetMap Completeness:</strong> Facility and shelter metadata depend on OpenStreetMap volunteer coverage and municipal data feeds.</li>
            <li><strong>Model Sensitivity:</strong> Composite risk ratings directly reflect selected MCDM weights and should be calibrated with incident commanders.</li>
            <li><strong>Life-Safety Notice:</strong> This system assists emergency decision-makers; field dispatchers must verify local road impassability warnings.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
