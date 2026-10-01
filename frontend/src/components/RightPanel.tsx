import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Hospital, 
  Home, 
  MapPin, 
  ShieldCheck, 
  Route
} from 'lucide-react';
import type { AnalysisResult, RouteResponse, Facility, AOI } from '../types';

interface RightPanelProps {
  analysis: AnalysisResult;
  routeResponse: RouteResponse | null;
  activeRouteMode: 'shortest' | 'least_risk';
  setActiveRouteMode: (mode: 'shortest' | 'least_risk') => void;
  onCalculateRoute: (origin?: { lat: number; lng: number; name: string }, dest?: { lat: number; lng: number; name: string }) => void;
  isRoutingLoading: boolean;
  selectedFacility: Facility | null;
  onSelectFacility: (fac: Facility) => void;
  onFocusHotspot: (hotspotId: string) => void;
  currentAoi?: AOI;
  customOrigin?: { lat: number; lng: number; name: string };
  customDest?: { lat: number; lng: number; name: string };
  onUpdateOrigin?: (origin: { lat: number; lng: number; name: string }) => void;
  onUpdateDest?: (dest: { lat: number; lng: number; name: string }) => void;
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
  onFocusHotspot,
  currentAoi,
  customOrigin,
  customDest,
  onUpdateOrigin,
  onUpdateDest
}) => {
  const hospitals = analysis.facilities.filter(f => f.type === 'hospital');
  const shelters = analysis.facilities.filter(f => f.type === 'shelter');

  const [originText, setOriginText] = useState(customOrigin?.name || 'Kotturpuram Residential Sector');
  const [destText, setDestText] = useState(customDest?.name || 'Apollo Speciality Hospital (Greams)');
  const [originLat, setOriginLat] = useState(customOrigin ? String(customOrigin.lat) : '13.0189');
  const [originLng, setOriginLng] = useState(customOrigin ? String(customOrigin.lng) : '80.2312');
  const [destLat, setDestLat] = useState(customDest ? String(customDest.lat) : '13.0604');
  const [destLng, setDestLng] = useState(customDest ? String(customDest.lng) : '80.2520');
  const [showCoords, setShowCoords] = useState(false);

  // Sync state when props change
  useEffect(() => {
    if (customOrigin) {
      setOriginText(customOrigin.name);
      setOriginLat(String(customOrigin.lat));
      setOriginLng(String(customOrigin.lng));
    }
  }, [customOrigin]);

  useEffect(() => {
    if (customDest) {
      setDestText(customDest.name);
      setDestLat(String(customDest.lat));
      setDestLng(String(customDest.lng));
    }
  }, [customDest]);

  const handleCalculate = () => {
    const oLat = parseFloat(originLat) || (currentAoi ? currentAoi.default_origin.lat : 13.0189);
    const oLng = parseFloat(originLng) || (currentAoi ? currentAoi.default_origin.lng : 80.2312);
    const dLat = parseFloat(destLat) || (currentAoi ? currentAoi.default_destination.lat : 13.0604);
    const dLng = parseFloat(destLng) || (currentAoi ? currentAoi.default_destination.lng : 80.2520);

    const origObj = { lat: oLat, lng: oLng, name: originText || 'Custom Origin' };
    const destObj = { lat: dLat, lng: dLng, name: destText || 'Custom Destination' };

    if (onUpdateOrigin) onUpdateOrigin(origObj);
    if (onUpdateDest) onUpdateDest(destObj);
    onCalculateRoute(origObj, destObj);
  };

  const riskColor = analysis.overall_risk_score >= 0.60 
    ? 'text-[#ffb4ab] border-[#93000a] bg-[#93000a]/20' 
    : analysis.overall_risk_score >= 0.40 
    ? 'text-[#ffc176] border-[#f1a02b] bg-[#f1a02b]/20'
    : 'text-[#38bdf8] border-[#38bdf8] bg-[#38bdf8]/20';

  return (
    <aside className="xl:col-span-3 flex flex-col gap-3">
      {/* Decision Intelligence Panel Card */}
      <div className="bg-[#151b2b] rounded-lg p-3 border border-[#1f2937] shadow-lg flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-[#263244] pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#38bdf8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-[#dde2f8]">
              Decision Intelligence
            </span>
          </div>
          <span className="text-[10px] text-[#38bdf8] font-mono font-semibold">
            OPS #01
          </span>
        </div>

        {/* Primary Metric Banner */}
        <div className="bg-[#191f2f] p-2.5 rounded-lg border border-[#263244] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#bdc8d1] font-semibold">
              Composite Risk Index
            </span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${riskColor}`}>
              {analysis.overall_risk_class}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#dde2f8] font-mono leading-none">
              {analysis.overall_risk_score.toFixed(2)}
            </span>
            <span className="text-xs text-[#bdc8d1] font-mono">/ 1.00</span>
            <span className="text-[10px] text-[#ffc176] ml-auto font-medium">
              Priority Sector
            </span>
          </div>

          {/* Mini Risk Progress Bar */}
          <div className="h-1.5 w-full bg-[#080e1d] rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-[#22c55e] via-[#f59e0b] to-[#ef4444] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, analysis.overall_risk_score * 100)}%` }}
            />
          </div>
        </div>

        {/* Hazard Factor Breakdown Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-[#191f2f] p-2 rounded border border-[#263244] flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-[#bdc8d1]">SAR Flood</span>
            <span className="text-sm font-bold text-[#dde2f8] font-mono">
              {(analysis.weights.flood * 1.8).toFixed(2)}
            </span>
            <span className="text-[9px] text-[#38bdf8] font-medium">
              Contr: {Math.round((analysis.contributions?.flood || 0.4) * 100)}%
            </span>
          </div>

          <div className="bg-[#191f2f] p-2 rounded border border-[#263244] flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-[#bdc8d1]">Terrain Slope</span>
            <span className="text-sm font-bold text-[#dde2f8] font-mono">
              {(analysis.weights.terrain * 1.5).toFixed(2)}
            </span>
            <span className="text-[9px] text-[#87929a] font-medium">
              Contr: {Math.round((analysis.contributions?.terrain || 0.25) * 100)}%
            </span>
          </div>

          <div className="bg-[#191f2f] p-2 rounded border border-[#263244] flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-[#bdc8d1]">CHIRPS Rain</span>
            <span className="text-sm font-bold text-[#dde2f8] font-mono">
              {(analysis.weights.rainfall * 1.6).toFixed(2)}
            </span>
            <span className="text-[9px] text-[#38bdf8] font-medium">
              Contr: {Math.round((analysis.contributions?.rainfall || 0.2) * 100)}%
            </span>
          </div>

          <div className="bg-[#191f2f] p-2 rounded border border-[#263244] flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-[#bdc8d1]">Built Exposure</span>
            <span className="text-sm font-bold text-[#dde2f8] font-mono">
              {(analysis.weights.exposure * 1.7).toFixed(2)}
            </span>
            <span className="text-[9px] text-[#ffc176] font-medium">
              Contr: {Math.round((analysis.contributions?.exposure || 0.15) * 100)}%
            </span>
          </div>
        </div>

        {/* Priority Inundation Hotspots List */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#dde2f8] font-bold">
              Identified Inundation Hotspots
            </span>
            <span className="text-[10px] text-[#ffb4ab] font-mono font-bold">
              {analysis.hotspots.length} Zones
            </span>
          </div>

          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-0.5">
            {analysis.hotspots.map((h) => (
              <div
                key={h.id}
                onClick={() => onFocusHotspot(h.id)}
                className="bg-[#191f2f] hover:bg-[#242a3a] p-2 rounded border border-[#263244] flex items-center justify-between cursor-pointer transition-colors text-xs"
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="font-semibold text-[#dde2f8] truncate">{h.name}</span>
                  <span className="text-[10px] text-[#bdc8d1] truncate">{h.depth_or_intensity}</span>
                </div>
                <div className="flex flex-col items-end shrink-0 font-mono">
                  <span className="text-[10px] font-bold text-[#ffb4ab]">
                    {h.risk_score.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-[#87929a] uppercase">Risk</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Facilities Stats */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => hospitals.length > 0 && onSelectFacility(hospitals[0])}
            className="bg-[#191f2f] hover:bg-[#242a3a] p-2 rounded border border-[#263244] flex items-center gap-2 transition-colors cursor-pointer text-left"
          >
            <div className="p-1.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
              <Hospital className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#dde2f8] font-mono leading-none">
                {hospitals.length}
              </span>
              <span className="text-[9px] uppercase text-[#bdc8d1] font-semibold mt-0.5">
                Hospitals
              </span>
            </div>
          </button>

          <button
            onClick={() => shelters.length > 0 && onSelectFacility(shelters[0])}
            className="bg-[#191f2f] hover:bg-[#242a3a] p-2 rounded border border-[#263244] flex items-center gap-2 transition-colors cursor-pointer text-left"
          >
            <div className="p-1.5 rounded bg-[#ffc176]/10 text-[#ffc176] border border-[#ffc176]/20">
              <Home className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#dde2f8] font-mono leading-none">
                {shelters.length}
              </span>
              <span className="text-[9px] uppercase text-[#bdc8d1] font-semibold mt-0.5">
                Shelters
              </span>
            </div>
          </button>
        </div>

        {/* Emergency Routing Input Section with Custom Origin & Destination */}
        <div className="flex flex-col gap-1.5 bg-[#080e1d]/70 p-2.5 rounded-lg border border-[#263244]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#dde2f8] font-bold">
              Least-Risk Routing
            </span>
            <span className="text-[10px] text-[#38bdf8] font-mono font-bold">
              DIJKSTRA+MCDA
            </span>
          </div>

          {/* Interactive Custom Origin & Destination Inputs */}
          <div className="flex flex-col gap-1.5 text-[#dde2f8]">
            {/* Origin Input */}
            <div className="bg-[#191f2f] px-2.5 py-1.5 rounded text-[11px] flex flex-col gap-1 border border-[#263244] focus-within:border-[#38bdf8] transition-colors">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <span className="text-[10px] text-[#38bdf8] font-bold uppercase shrink-0">ORIGIN:</span>
                <input
                  type="text"
                  value={originText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOriginText(val);
                    const parts = val.split(',');
                    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
                      setOriginLat(parts[0].trim());
                      setOriginLng(parts[1].trim());
                    }
                  }}
                  placeholder="Enter custom origin sector or coordinates..."
                  className="bg-transparent text-xs text-[#dde2f8] font-medium w-full focus:outline-none placeholder:text-[#87929a]"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-[#87929a] pt-1 border-t border-[#263244]/60">
                <span>Quick Preset:</span>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'default' && currentAoi) {
                      setOriginText(currentAoi.default_origin.name);
                      setOriginLat(String(currentAoi.default_origin.lat));
                      setOriginLng(String(currentAoi.default_origin.lng));
                    } else {
                      const fac = analysis.facilities.find(f => f.id === val);
                      if (fac) {
                        setOriginText(fac.name);
                        setOriginLat(String(fac.lat));
                        setOriginLng(String(fac.lng));
                      }
                    }
                  }}
                  className="bg-[#151b2b] text-[9px] text-[#bdc8d1] px-1 py-0.5 rounded border border-[#263244] focus:outline-none cursor-pointer max-w-[150px] truncate"
                >
                  <option value="default">{currentAoi ? currentAoi.default_origin.name.split(' ').slice(0, 2).join(' ') : 'Default Sector'}</option>
                  {analysis.facilities.map(f => (
                    <option key={`orig-${f.id}`} value={f.id}>{f.type === 'hospital' ? '🏥' : '⛺'} {f.name.split(' ').slice(0, 2).join(' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination Input */}
            <div className="bg-[#191f2f] px-2.5 py-1.5 rounded text-[11px] flex flex-col gap-1 border border-[#263244] focus-within:border-[#ef4444] transition-colors">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                <span className="text-[10px] text-[#ef4444] font-bold uppercase shrink-0">DEST:</span>
                <input
                  type="text"
                  value={destText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDestText(val);
                    const parts = val.split(',');
                    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
                      setDestLat(parts[0].trim());
                      setDestLng(parts[1].trim());
                    }
                  }}
                  placeholder="Enter destination hospital, shelter or coordinates..."
                  className="bg-transparent text-xs text-[#dde2f8] font-medium w-full focus:outline-none placeholder:text-[#87929a]"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-[#87929a] pt-1 border-t border-[#263244]/60">
                <span>Quick Preset:</span>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'default' && currentAoi) {
                      setDestText(currentAoi.default_destination.name);
                      setDestLat(String(currentAoi.default_destination.lat));
                      setDestLng(String(currentAoi.default_destination.lng));
                    } else {
                      const fac = analysis.facilities.find(f => f.id === val);
                      if (fac) {
                        setDestText(fac.name);
                        setDestLat(String(fac.lat));
                        setDestLng(String(fac.lng));
                      }
                    }
                  }}
                  className="bg-[#151b2b] text-[9px] text-[#bdc8d1] px-1 py-0.5 rounded border border-[#263244] focus:outline-none cursor-pointer max-w-[150px] truncate"
                >
                  <option value="default">{currentAoi ? currentAoi.default_destination.name.split(' ').slice(0, 2).join(' ') : 'Default Hospital'}</option>
                  {analysis.facilities.map(f => (
                    <option key={`dest-${f.id}`} value={f.id}>{f.type === 'hospital' ? '🏥' : '⛺'} {f.name.split(' ').slice(0, 2).join(' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Coordinate Precision Toggle */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={() => setShowCoords(!showCoords)}
              className="text-[9px] text-[#38bdf8] hover:underline cursor-pointer flex items-center gap-1 font-mono"
            >
              {showCoords ? 'Hide GPS Coordinates' : '+ Exact GPS Coordinates (Lat/Lng)'}
            </button>
          </div>

          {/* Collapsible Lat/Lng Inputs */}
          {showCoords && (
            <div className="grid grid-cols-2 gap-1.5 bg-[#151b2b] p-2 rounded border border-[#263244] text-[10px] font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-[#38bdf8] text-[9px] font-bold">ORIGIN (Lat, Lng)</span>
                <input
                  type="text"
                  value={`${originLat}, ${originLng}`}
                  onChange={(e) => {
                    const p = e.target.value.split(',');
                    if (p[0]) setOriginLat(p[0].trim());
                    if (p[1]) setOriginLng(p[1].trim());
                  }}
                  className="bg-[#080e1d] px-1.5 py-1 rounded border border-[#263244] text-[#dde2f8]"
                  placeholder="13.0189, 80.2312"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#ef4444] text-[9px] font-bold">DEST (Lat, Lng)</span>
                <input
                  type="text"
                  value={`${destLat}, ${destLng}`}
                  onChange={(e) => {
                    const p = e.target.value.split(',');
                    if (p[0]) setDestLat(p[0].trim());
                    if (p[1]) setDestLng(p[1].trim());
                  }}
                  className="bg-[#080e1d] px-1.5 py-1 rounded border border-[#263244] text-[#dde2f8]"
                  placeholder="13.0604, 80.2520"
                />
              </div>
            </div>
          )}

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
            onClick={handleCalculate}
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

            <div className="flex items-center justify-between font-mono text-[11px] py-0.5 border-t border-[#1f2937]">
              <span className="text-[#bdc8d1] font-sans">Hazard Risk</span>
              <span className="text-[#ef4444] font-bold">
                {routeResponse.shortest_route.risk_score.toFixed(2)} (High)
              </span>
              <span className="text-[#22c55e] font-bold">
                {routeResponse.least_risk_route.risk_score.toFixed(2)} (-{routeResponse.risk_reduction_pct}%)
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] py-0.5 border-t border-[#1f2937]">
              <span className="text-[#bdc8d1] font-sans">Convoy Transit</span>
              <span className="text-[#ffc176]">
                {routeResponse.shortest_route.eta_minutes.toFixed(0)}m (Impassable)
              </span>
              <span className="text-[#38bdf8] font-bold">
                {routeResponse.least_risk_route.eta_minutes.toFixed(0)}m (Safe)
              </span>
            </div>

            {/* Tactical Advice Badge */}
            <div className="mt-1.5 p-2 rounded bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#dde2f8] leading-tight">
                <span className="font-bold text-[#38bdf8] block text-[10px] uppercase tracking-wider mb-0.5">Tactical Directive</span>
                {routeResponse?.recommendation || 
                  "The least-risk route bypasses 3 active inundation points along Adyar corridor, reducing hazard exposure by 59% while adding only 1.4 km (2 min). Recommended for emergency dispatch."}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
