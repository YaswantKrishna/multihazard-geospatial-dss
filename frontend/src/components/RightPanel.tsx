import React from 'react';
import { 
  BarChart3, 
  Hospital, 
  Home, 
  MapPin, 
  ShieldCheck, 
  Route
} from 'lucide-react';
import type { AnalysisResult, RouteResponse, Facility } from '../types';

interface RightPanelProps {
  analysis: AnalysisResult;
  routeResponse: RouteResponse | null;
  activeRouteMode: 'shortest' | 'least_risk';
  setActiveRouteMode: (mode: 'shortest' | 'least_risk') => void;
  onCalculateRoute: () => void;
  isRoutingLoading: boolean;
  selectedFacility: Facility | null;
  onSelectFacility: (fac: Facility) => void;
  onFocusHotspot: (hotspotId: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  analysis,
  routeResponse,
  activeRouteMode,
  setActiveRouteMode,
  onCalculateRoute,
  isRoutingLoading,
  selectedFacility: _selectedFacility,
  onSelectFacility,
  onFocusHotspot
}) => {
  const hospitals = analysis.facilities.filter(f => f.type === 'hospital');
  const shelters = analysis.facilities.filter(f => f.type === 'shelter');

  const riskColor = analysis.overall_risk_score >= 0.60 
    ? 'text-[#ffb4ab] border-[#93000a] bg-[#93000a]/20' 
    : analysis.overall_risk_score >= 0.40 
    ? 'text-[#ffc176] border-[#f1a02b] bg-[#f1a02b]/20'
    : 'text-[#38bdf8] border-[#38bdf8] bg-[#38bdf8]/20';

  return (
    <aside className="xl:col-span-3 flex flex-col gap-3">
      <div className="bg-[#151b2b] rounded-lg p-3.5 border border-[#1f2937] shadow-md flex flex-col gap-3.5 overflow-y-auto max-h-[820px]">
        
        {/* Header: Decision Intelligence */}
        <div className="flex items-center justify-between border-b border-[#263244] pb-2">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs font-bold tracking-widest text-[#dde2f8] uppercase">
              Decision Intelligence
            </span>
          </div>
          <span className="text-[10px] text-[#38bdf8] font-mono bg-[#191f2f] px-1.5 py-0.5 rounded border border-[#38bdf8]/30 font-bold">
            LIVE UPDATE
          </span>
        </div>

        {/* Top KPI Card: Modeled Composite Threat */}
        <div className="bg-[#080e1d] p-3 rounded-lg border border-[#263244] flex flex-col gap-1.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#bdc8d1] font-semibold">
              Modeled Sector Risk
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${riskColor}`}>
              {analysis.overall_risk_class} HAZARD
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-bold font-mono text-[#ffb4ab]">
              {analysis.overall_risk_score.toFixed(2)}
            </span>
            <span className="text-xs text-[#bdc8d1] font-mono">/ 1.00 max</span>
          </div>
          <span className="text-[11px] text-[#bdc8d1] leading-tight">
            Dominant Factor: <strong className="text-[#dde2f8] font-semibold">{analysis.dominant_hazard} ({analysis.contributions.flood}%)</strong> coupled with topographical drainage constraints.
          </span>
        </div>

        {/* Risk Factor Attribution */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#bdc8d1] font-semibold">
            Risk Factor Attribution
          </span>
          <div className="flex flex-col gap-1.5">
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-[#dde2f8] font-medium">Flood Inundation Index</span>
                <span className="font-mono text-[#ffb4ab] font-bold">{analysis.contributions.flood}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#191f2f] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ef4444] rounded-full transition-all duration-500" 
                  style={{ width: `${analysis.contributions.flood}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-[#dde2f8] font-medium">Terrain Slope & Drainage</span>
                <span className="font-mono text-[#ffc176] font-bold">{analysis.contributions.terrain}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#191f2f] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ffc176] rounded-full transition-all duration-500" 
                  style={{ width: `${analysis.contributions.terrain}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-[#dde2f8] font-medium">Precipitation Anomaly</span>
                <span className="font-mono text-[#38bdf8] font-bold">{analysis.contributions.rainfall}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#191f2f] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#38bdf8] rounded-full transition-all duration-500" 
                  style={{ width: `${analysis.contributions.rainfall}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-[#dde2f8] font-medium">Population Exposure Density</span>
                <span className="font-mono text-[#bbc7de] font-bold">{analysis.contributions.exposure}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#191f2f] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#bbc7de] rounded-full transition-all duration-500" 
                  style={{ width: `${analysis.contributions.exposure}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot Clusters */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#bdc8d1] font-semibold">
              Hotspot Clusters
            </span>
            <span className="text-[10px] text-[#38bdf8] font-bold font-mono">
              {analysis.hotspots.length} Zones Detected
            </span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-0.5">
            {analysis.hotspots.map((h) => (
              <div
                key={h.id}
                onClick={() => onFocusHotspot(h.id)}
                className="bg-[#191f2f] hover:bg-[#242a3a] p-2 rounded border border-[#263244] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-7 rounded-full ${h.risk_score >= 0.8 ? 'bg-[#ef4444]' : 'bg-[#ffc176]'}`} />
                  <div className="flex flex-col">
                    <span className="text-xs text-[#dde2f8] font-semibold truncate max-w-[170px]">
                      {h.name}
                    </span>
                    <span className="text-[10px] text-[#bdc8d1] truncate max-w-[170px]">
                      {h.depth_or_intensity || h.dominant_hazard}
                    </span>
                  </div>
                </div>
                <span className={`font-mono font-bold text-xs ${h.risk_score >= 0.8 ? 'text-[#ffb4ab]' : 'text-[#ffc176]'}`}>
                  {h.risk_score.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Facilities Summary Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div 
            onClick={() => onSelectFacility(hospitals[0])}
            className="bg-[#191f2f] hover:bg-[#242a3a] p-2.5 rounded-lg border border-[#263244] flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <div className="p-1.5 rounded bg-[#38bdf8]/20 text-[#38bdf8]">
              <Hospital className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base text-[#dde2f8] font-mono font-bold">
                {hospitals.length}
              </span>
              <span className="text-[10px] text-[#bdc8d1] uppercase tracking-wider font-semibold">
                Hospitals
              </span>
            </div>
          </div>

          <div 
            onClick={() => onSelectFacility(shelters[0])}
            className="bg-[#191f2f] hover:bg-[#242a3a] p-2.5 rounded-lg border border-[#263244] flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <div className="p-1.5 rounded bg-[#f1a02b]/20 text-[#ffc176]">
              <Home className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base text-[#dde2f8] font-mono font-bold">
                {shelters.length}
              </span>
              <span className="text-[10px] text-[#bdc8d1] uppercase tracking-wider font-semibold">
                Shelters
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Routing Input Section */}
        <div className="flex flex-col gap-1.5 bg-[#080e1d]/70 p-2.5 rounded-lg border border-[#263244]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#dde2f8] font-bold">
              Least-Risk Routing
            </span>
            <span className="text-[10px] text-[#38bdf8] font-mono font-bold">
              DIJKSTRA+MCDA
            </span>
          </div>

          <div className="flex flex-col gap-1 text-[#dde2f8]">
            <div className="bg-[#191f2f] px-2.5 py-1.5 rounded text-[11px] flex items-center gap-1.5 border border-[#263244]">
              <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="truncate">ORIGIN: Kotturpuram Residential Sector</span>
            </div>
            <div className="bg-[#191f2f] px-2.5 py-1.5 rounded text-[11px] flex items-center gap-1.5 border border-[#263244]">
              <MapPin className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
              <span className="truncate">DEST: Apollo Speciality Hospital (Greams)</span>
            </div>
          </div>

          {/* Mode Toggle Pills */}
          <div className="grid grid-cols-2 gap-1 mt-1 bg-[#191f2f] p-0.5 rounded border border-[#263244]">
            <button
              onClick={() => setActiveRouteMode('shortest')}
              className={`py-1 px-2 rounded text-[11px] font-semibold text-center transition-colors cursor-pointer ${
                activeRouteMode === 'shortest'
                  ? 'bg-[#242a3a] text-[#ffc176] shadow-sm font-bold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f8]'
              }`}
            >
              Shortest Route
            </button>
            <button
              onClick={() => setActiveRouteMode('least_risk')}
              className={`py-1 px-2 rounded text-[11px] font-semibold text-center transition-colors cursor-pointer ${
                activeRouteMode === 'least_risk'
                  ? 'bg-[#38bdf8] text-[#001e2c] shadow-sm font-bold'
                  : 'text-[#bdc8d1] hover:text-[#dde2f8]'
              }`}
            >
              Least-Risk (Rec)
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={onCalculateRoute}
            disabled={isRoutingLoading}
            className="w-full mt-1 py-2 px-3 rounded bg-[#242a3a] hover:bg-[#2f3445] text-[#38bdf8] border border-[#38bdf8]/40 hover:border-[#38bdf8] text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Route className="w-4 h-4 text-[#38bdf8]" />
            {isRoutingLoading ? 'Calculating Network...' : 'Calculate Optimal Path'}
          </button>
        </div>

        {/* Route Comparison Metrics Card */}
        {routeResponse && (
          <div className="bg-[#080e1d] p-2.5 rounded-lg border border-[#263244] flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between text-[#bdc8d1] text-[10px] uppercase font-bold border-b border-[#1f2937] pb-1">
              <span>Metric</span>
              <span className="text-[#ffc176]">Shortest</span>
              <span className="text-[#38bdf8] font-bold">Least-Risk</span>
            </div>
            
            <div className="flex items-center justify-between font-mono text-[11px] py-0.5">
              <span className="text-[#bdc8d1] font-sans">Distance</span>
              <span className="text-[#bdc8d1]">{routeResponse.shortest_route.distance_km} km</span>
              <span className="text-[#38bdf8] font-bold">
                {routeResponse.least_risk_route.distance_km} km (+{routeResponse.additional_distance_km})
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] py-0.5">
              <span className="text-[#bdc8d1] font-sans">Risk Factor</span>
              <span className="text-[#ffb4ab] font-bold">
                {routeResponse.shortest_route.risk_score.toFixed(2)} (High)
              </span>
              <span className="text-[#38bdf8] font-bold">
                {routeResponse.least_risk_route.risk_score.toFixed(2)} (-{routeResponse.risk_reduction_pct}%)
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] py-0.5">
              <span className="text-[#bdc8d1] font-sans">Transit ETA</span>
              <span className="text-[#ffb4ab]">
                {routeResponse.shortest_route.eta_minutes.toFixed(0)}m (Impassable)
              </span>
              <span className="text-[#22c55e] font-bold">
                {routeResponse.least_risk_route.eta_minutes.toFixed(0)}m (Safe)
              </span>
            </div>
          </div>
        )}

        {/* Natural Language Decision Recommendation Callout */}
        <div className="bg-[#191f2f] p-3 rounded-lg border border-[#38bdf8]/30 flex items-start gap-2 shadow-md">
          <ShieldCheck className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-[#dde2f8]">Decision Recommendation</span>
            <p className="text-[11px] text-[#bdc8d1] leading-snug">
              {routeResponse?.recommendation || 
                "The least-risk route bypasses 3 active inundation points along Adyar corridor, reducing hazard exposure by 59% while adding only 1.4 km (2 min). Recommended for emergency dispatch."}
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
};
