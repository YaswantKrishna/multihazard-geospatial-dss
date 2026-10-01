import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sliders, 
  Play, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Activity
} from 'lucide-react';
import type { AOI, MCDMWeights } from '../types';

interface LeftPanelProps {
  aois: AOI[];
  currentAoi: AOI;
  onSelectAoi: (aoi: AOI) => void;
  weights: MCDMWeights;
  onUpdateWeights: (newWeights: MCDMWeights) => void;
  onRunAnalysis: () => void;
  isLoading: boolean;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  aois,
  currentAoi,
  onSelectAoi,
  weights,
  onUpdateWeights,
  onRunAnalysis,
  isLoading
}) => {
  const [activePreset, setActivePreset] = useState<'humanitarian' | 'infra' | 'equal'>('humanitarian');
  const [showAdvancedSensors, setShowAdvancedSensors] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(currentAoi.name);

  // Preset handlers
  const handlePreset = (type: 'humanitarian' | 'infra' | 'equal') => {
    setActivePreset(type);
    if (type === 'humanitarian') {
      onUpdateWeights({ flood: 0.40, terrain: 0.25, rainfall: 0.20, exposure: 0.15 });
    } else if (type === 'infra') {
      onUpdateWeights({ flood: 0.30, terrain: 0.40, rainfall: 0.15, exposure: 0.15 });
    } else if (type === 'equal') {
      onUpdateWeights({ flood: 0.25, terrain: 0.25, rainfall: 0.25, exposure: 0.25 });
    }
  };

  const handleSliderChange = (key: keyof MCDMWeights, val: number) => {
    const updated = { ...weights, [key]: val / 100 };
    // Automatically renormalize other weights to sum to 100
    const otherKeys = (Object.keys(weights) as (keyof MCDMWeights)[]).filter(k => k !== key);
    const remaining = Math.max(0, 1.0 - updated[key]);
    const currentOtherSum = otherKeys.reduce((acc, k) => acc + weights[k], 0) || 1;
    
    otherKeys.forEach(k => {
      updated[k] = Number(((weights[k] / currentOtherSum) * remaining).toFixed(2));
    });

    onUpdateWeights(updated);
  };

  const pct = (val: number) => Math.round(val * 100);

  return (
    <aside className="xl:col-span-3 flex flex-col gap-3">
      <div className="bg-[#151b2b] rounded-lg p-3.5 border border-[#1f2937] shadow-md flex flex-col gap-3.5">
        
        {/* AOI Selector Section */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#bdc8d1] font-semibold">
              Area of Interest
            </span>
            <span className="text-[10px] text-[#38bdf8] font-mono font-bold">
              AOI #{currentAoi.id.toUpperCase()}
            </span>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search operational sector..."
              className="w-full bg-[#080e1d] text-[#dde2f8] text-xs pl-8 pr-3 py-1.5 rounded border border-[#263244] focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#87929a] absolute left-2.5 top-2.5" />
          </div>

          {/* Quick AOI pills */}
          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
            {aois.slice(0, 4).map((aoi) => (
              <button
                key={aoi.id}
                onClick={() => {
                  onSelectAoi(aoi);
                  setSearchTerm(aoi.name);
                }}
                className={`flex items-center justify-center gap-1 py-1 px-2 rounded text-[11px] font-medium transition-colors border ${
                  currentAoi.id === aoi.id
                    ? 'bg-[#191f2f] text-[#38bdf8] border-[#38bdf8]/40 font-bold'
                    : 'bg-[#191f2f]/60 text-[#bdc8d1] hover:text-[#dde2f8] border-transparent hover:bg-[#191f2f]'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#38bdf8]" />
                <span className="truncate">{aoi.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active AOI Tag */}
          <div className="bg-[#191f2f] p-2 rounded border border-[#263244] flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-[#dde2f8] font-semibold truncate max-w-[150px]">
                  {currentAoi.name}
                </span>
                <span className="text-[10px] text-[#bdc8d1] truncate max-w-[150px]">
                  Area: {currentAoi.area_sqkm} km² • {currentAoi.context}
                </span>
              </div>
            </div>
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#38bdf8] text-[#004965] font-mono font-bold tracking-wider">
              LOCKED
            </span>
          </div>
        </div>

        {/* Temporal Horizon */}
        <div className="flex flex-col gap-1.5 bg-[#080e1d]/50 p-2.5 rounded border border-[#1f2937]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#bdc8d1] font-semibold">
              Temporal Horizon
            </span>
            <span className="text-[10px] text-[#ffc176] font-mono font-semibold">
              30-Day Window
            </span>
          </div>
          <div className="flex items-center justify-between bg-[#080e1d] px-3 py-1.5 rounded border border-[#263244]">
            <span className="text-xs text-[#dde2f8] font-mono">2026-09-01</span>
            <span className="text-[#87929a] text-xs">→</span>
            <span className="text-xs text-[#dde2f8] font-mono">2026-09-30</span>
          </div>

          {/* Sensor Accordion */}
          <button
            onClick={() => setShowAdvancedSensors(!showAdvancedSensors)}
            className="flex items-center justify-between text-[#bdc8d1] hover:text-[#dde2f8] text-left text-[11px] pt-1 transition-colors"
          >
            <span className="flex items-center gap-1 font-medium">
              <Sliders className="w-3 h-3 text-[#38bdf8]" /> Advanced Sensor Sources
            </span>
            {showAdvancedSensors ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showAdvancedSensors && (
            <div className="flex flex-col gap-1 p-2 bg-[#191f2f] rounded text-[10px] text-[#bdc8d1] border border-[#263244] mt-1 font-mono">
              <div className="flex justify-between items-center">
                <span>Sentinel-1 SAR VV/VH (10m)</span>
                <span className="text-[#38bdf8] font-bold">READY</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Copernicus DEM GLO-30</span>
                <span className="text-[#38bdf8] font-bold">SYNCED</span>
              </div>
              <div className="flex justify-between items-center">
                <span>NASA GPM / CHIRPS Rain</span>
                <span className="text-[#38bdf8] font-bold">LATEST</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Dynamic World 10m LULC</span>
                <span className="text-[#38bdf8] font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>JRC Surface Water Baseline</span>
                <span className="text-[#38bdf8] font-bold">MASKED</span>
              </div>
            </div>
          )}
        </div>

        {/* Hazard Matrix & MCDM Weight Sliders */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#bdc8d1] font-semibold">
              Active Hazard Indices (MCDM)
            </span>
            <button
              onClick={() => handlePreset('humanitarian')}
              className="text-[10px] text-[#38bdf8] hover:underline flex items-center gap-0.5"
              title="Reset weights to Humanitarian defaults"
            >
              <RotateCcw className="w-2.5 h-2.5" /> Reset
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {/* Flood Inundation Index */}
            <div className="bg-[#080e1d]/70 p-2 rounded border border-[#263244] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#dde2f8] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                  Flood Inundation Index
                </span>
                <span className="text-[#ffb4ab] font-mono font-bold text-[11px]">
                  {pct(weights.flood)}% WGT
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pct(weights.flood)}
                onChange={(e) => handleSliderChange('flood', Number(e.target.value))}
                className="w-full accent-[#38bdf8] h-1.5 bg-[#191f2f] rounded-lg cursor-pointer"
              />
            </div>

            {/* Terrain Slope & Elevation */}
            <div className="bg-[#080e1d]/70 p-2 rounded border border-[#263244] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#dde2f8] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ffc176]"></span>
                  Terrain Slope & Elevation
                </span>
                <span className="text-[#ffc176] font-mono font-bold text-[11px]">
                  {pct(weights.terrain)}% WGT
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pct(weights.terrain)}
                onChange={(e) => handleSliderChange('terrain', Number(e.target.value))}
                className="w-full accent-[#38bdf8] h-1.5 bg-[#191f2f] rounded-lg cursor-pointer"
              />
            </div>

            {/* Extreme Rainfall Anomaly */}
            <div className="bg-[#080e1d]/70 p-2 rounded border border-[#263244] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#dde2f8] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
                  Extreme Rainfall Anomaly
                </span>
                <span className="text-[#38bdf8] font-mono font-bold text-[11px]">
                  {pct(weights.rainfall)}% WGT
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pct(weights.rainfall)}
                onChange={(e) => handleSliderChange('rainfall', Number(e.target.value))}
                className="w-full accent-[#38bdf8] h-1.5 bg-[#191f2f] rounded-lg cursor-pointer"
              />
            </div>

            {/* Human Exposure Density */}
            <div className="bg-[#080e1d]/70 p-2 rounded border border-[#263244] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#dde2f8] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#bbc7de]"></span>
                  Human Exposure Density
                </span>
                <span className="text-[#bdc8d1] font-mono font-bold text-[11px]">
                  {pct(weights.exposure)}% WGT
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pct(weights.exposure)}
                onChange={(e) => handleSliderChange('exposure', Number(e.target.value))}
                className="w-full accent-[#38bdf8] h-1.5 bg-[#191f2f] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Preset Selection Pills */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#bdc8d1] font-semibold">
            Weight Preset (MCDA)
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handlePreset('humanitarian')}
              className={`py-1 px-1 rounded text-center text-[10px] font-semibold transition-colors ${
                activePreset === 'humanitarian'
                  ? 'bg-[#3b475a] text-[#dde2f8] border border-[#38bdf8]/40'
                  : 'bg-[#191f2f] text-[#bdc8d1] hover:text-[#dde2f8]'
              }`}
            >
              Humanitarian
            </button>
            <button
              onClick={() => handlePreset('infra')}
              className={`py-1 px-1 rounded text-center text-[10px] font-semibold transition-colors ${
                activePreset === 'infra'
                  ? 'bg-[#3b475a] text-[#dde2f8] border border-[#38bdf8]/40'
                  : 'bg-[#191f2f] text-[#bdc8d1] hover:text-[#dde2f8]'
              }`}
            >
              Infra Core
            </button>
            <button
              onClick={() => handlePreset('equal')}
              className={`py-1 px-1 rounded text-center text-[10px] font-semibold transition-colors ${
                activePreset === 'equal'
                  ? 'bg-[#3b475a] text-[#dde2f8] border border-[#38bdf8]/40'
                  : 'bg-[#191f2f] text-[#bdc8d1] hover:text-[#dde2f8]'
              }`}
            >
              Equal Bias
            </button>
          </div>
        </div>

        {/* Execute Run Analysis CTA */}
        <button
          onClick={onRunAnalysis}
          disabled={isLoading}
          className="w-full mt-1 py-2.5 px-4 rounded bg-[#38bdf8] hover:bg-[#7bd0ff] text-[#001e2c] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#38bdf8]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-[#001e2c]" />
              <span>Analyzing Raster...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Analysis</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-[#87929a] text-[10px] pt-0.5 font-mono">
          <span>Engine: Sentinel-DSS v4.18</span>
          <span className="text-[#38bdf8]">CUDA Accel: ACTIVE</span>
        </div>
      </div>

      {/* Quick Telemetry Mini-Card */}
      <div className="bg-[#151b2b] p-3 rounded-lg border border-[#1f2937] flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-[#bdc8d1] tracking-wider font-semibold">
            AOI Baseline Elevation
          </span>
          <span className="text-base text-[#dde2f8] font-mono font-bold">
            {currentAoi.elevation_msl} m MSL
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-[#bdc8d1] tracking-wider font-semibold">
            Est. Population
          </span>
          <span className="text-base text-[#dde2f8] font-mono font-bold">
            {currentAoi.population_est}
          </span>
        </div>
      </div>
    </aside>
  );
};
