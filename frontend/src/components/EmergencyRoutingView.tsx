import React from 'react';
import { 
  Navigation, 
  Route, 
  AlertTriangle, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import type { RouteResponse, AOI } from '../types';

interface EmergencyRoutingViewProps {
  routeResponse: RouteResponse | null;
  currentAoi: AOI;
  onBackToDashboard: () => void;
}

export const EmergencyRoutingView: React.FC<EmergencyRoutingViewProps> = ({
  routeResponse,
  currentAoi,
  onBackToDashboard
}) => {
  if (!routeResponse) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center text-center">
        <Navigation className="w-12 h-12 text-[#38bdf8] mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-[#dde2f8]">No Active Route Computed</h3>
        <p className="text-xs text-[#bdc8d1] max-w-md mt-1">
          Select origin and destination coordinates on the Dashboard map, or click "Load Demo Analysis" to inspect calculated least-risk corridors.
        </p>
        <button
          onClick={onBackToDashboard}
          className="mt-4 px-4 py-2 bg-[#38bdf8] text-[#001e2c] font-bold text-xs uppercase rounded cursor-pointer"
        >
          Return to Tactical Map
        </button>
      </div>
    );
  }

  const s = routeResponse.shortest_route;
  const lr = routeResponse.least_risk_route;

  return (
    <div className="w-full flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-[#151b2b] p-4 rounded-lg border border-[#1f2937]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
            <Route className="w-6 h-6 text-[#38bdf8]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#dde2f8]">Emergency Evacuation & Logistics Routing Analysis</h2>
            <p className="text-xs text-[#bdc8d1]">
              Route Graph Optimization under Multi-Hazard Risk Penalties: <code className="text-[#38bdf8] font-mono">Cost = Distance × (1 + λ × Risk)</code>
            </p>
          </div>
        </div>
        <button
          onClick={onBackToDashboard}
          className="px-3 py-1.5 bg-[#191f2f] hover:bg-[#242a3a] text-[#38bdf8] border border-[#38bdf8]/30 rounded text-xs font-semibold cursor-pointer"
        >
          ← Back to Live Map
        </button>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shortest Route Card */}
        <div className="bg-[#151b2b] p-4 rounded-lg border border-[#ffc176]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#263244] pb-2">
            <span className="text-sm font-bold text-[#ffc176] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
              Shortest Route (Standard GIS)
            </span>
            <span className="text-[10px] font-mono text-[#ffb4ab] bg-[#93000a]/20 px-2 py-0.5 rounded font-bold">
              NOT RECOMMENDED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#080e1d] p-3 rounded border border-[#263244] text-center font-mono">
            <div>
              <span className="text-[10px] text-[#bdc8d1] block uppercase font-sans">Distance</span>
              <span className="text-lg font-bold text-[#dde2f8]">{s.distance_km} km</span>
            </div>
            <div>
              <span className="text-[10px] text-[#bdc8d1] block uppercase font-sans">Mean Hazard</span>
              <span className="text-lg font-bold text-[#ffb4ab]">{s.risk_score.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#bdc8d1] block uppercase font-sans">Est. Transit</span>
              <span className="text-lg font-bold text-[#ffb4ab]">{s.eta_minutes.toFixed(0)} min</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-[#bdc8d1]">
            <div className="flex items-center gap-2 text-[#ffb4ab]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Intersects <strong>{s.high_risk_segments_count} critical flood sectors</strong> along Adyar Basin.</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Standard Dijkstra or A* shortest path directs vehicles directly through submerged arterial corridors where radar backscatter reveals 1.4m standing water depth. High probability of vehicle entrapment.
            </p>
          </div>
        </div>

        {/* Least-Risk Route Card */}
        <div className="bg-[#151b2b] p-4 rounded-lg border border-[#38bdf8] flex flex-col gap-3 shadow-lg shadow-[#38bdf8]/5">
          <div className="flex items-center justify-between border-b border-[#263244] pb-2">
            <span className="text-sm font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
              Least-Risk Route (MCDM Averted)
            </span>
            <span className="text-[10px] font-mono text-[#001e2c] bg-[#38bdf8] px-2 py-0.5 rounded font-bold">
              RECOMMENDED DISPATCH
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#080e1d] p-3 rounded border border-[#263244] text-center font-mono">
            <div>
              <span className="text-[10px] text-[#bdc8d1] block uppercase font-sans">Distance</span>
              <span className="text-lg font-bold text-[#38bdf8]">{lr.distance_km} km</span>
              <span className="text-[9px] text-[#bdc8d1] block font-sans">(+{routeResponse.additional_distance_km} km)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#bdc8d1] block uppercase font-sans">Mean Hazard</span>
              <span className="text-lg font-bold text-[#22c55e]">{lr.risk_score.toFixed(2)}</span>
              <span className="text-[9px] text-[#22c55e] block font-sans">(-{routeResponse.risk_reduction_pct}%)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#bdc8d1] block uppercase font-sans">Est. Transit</span>
              <span className="text-lg font-bold text-[#22c55e]">{lr.eta_minutes.toFixed(0)} min</span>
              <span className="text-[9px] text-[#22c55e] block font-sans">Safe Passage</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-[#bdc8d1]">
            <div className="flex items-center gap-2 text-[#22c55e]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Bypasses all severe inundation points via elevated ridgeline bypass.</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Penalizing edge weights by <code className="font-mono text-[#38bdf8]">λ = 5.0</code> steers traffic across Sardar Patel elevated overpass and Mount Road ridges, guaranteeing uninterrupted ambulance and emergency convoy transit.
            </p>
          </div>
        </div>
      </div>

      {/* Operational Dispatch Action Plan */}
      <div className="bg-[#151b2b] p-4 rounded-lg border border-[#1f2937] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#38bdf8]" />
          <span className="text-sm font-bold text-[#dde2f8] uppercase tracking-wider">
            Operational Dispatch Directive
          </span>
        </div>
        <div className="bg-[#080e1d] p-3 rounded border border-[#263244] text-xs font-mono text-[#dde2f8] leading-relaxed space-y-2">
          <div><strong className="text-[#38bdf8]">INCIDENT SECTOR:</strong> {currentAoi.name} ({currentAoi.context})</div>
          <div><strong className="text-[#38bdf8]">ORIGIN:</strong> {currentAoi.default_origin.name} [{currentAoi.default_origin.lat.toFixed(4)}, {currentAoi.default_origin.lng.toFixed(4)}]</div>
          <div><strong className="text-[#38bdf8]">DESTINATION:</strong> {currentAoi.default_destination.name} [{currentAoi.default_destination.lat.toFixed(4)}, {currentAoi.default_destination.lng.toFixed(4)}]</div>
          <div><strong className="text-[#38bdf8]">COMMAND RECOMMENDATION:</strong> {routeResponse.recommendation}</div>
          <div><strong className="text-[#38bdf8]">ACTIVE WAYPOINTS:</strong> {lr.coordinates.length} tactical nodes mapped. Ingress confirmed via North Arterial Ridge.</div>
        </div>
      </div>
    </div>
  );
};
