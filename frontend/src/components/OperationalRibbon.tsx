import React from 'react';
import { Zap, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';

interface OperationalRibbonProps {
  onLoadDemo: () => void;
  isLoading: boolean;
  pipelineStage: string;
}

export const OperationalRibbon: React.FC<OperationalRibbonProps> = ({
  onLoadDemo,
  isLoading,
  pipelineStage
}) => {
  return (
    <section className="w-full bg-[#080e1d] px-4 py-1.5 border-b border-[#1f2937] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        {/* Left: Demo trigger and temporal badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onLoadDemo}
            disabled={isLoading}
            className="group flex items-center gap-1.5 bg-[#191f2f] hover:bg-[#242a3a] px-3 py-1 rounded text-[#38bdf8] border border-[#38bdf8]/30 hover:border-[#38bdf8] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Load Precomputed High-Resolution Satellite Disaster Simulation"
          >
            <Zap className="w-3.5 h-3.5 text-[#38bdf8] group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {isLoading ? 'Processing Pipeline...' : 'Load Demo Analysis'}
            </span>
          </button>

          <div className="h-4 w-px bg-[#2f3445] hidden sm:block"></div>

          <div className="flex items-center gap-1.5 text-xs text-[#bdc8d1]">
            <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-[#dde2f8] font-medium font-mono text-[11px]">
              01 Sep 2026 — 30 Sep 2026
            </span>
            <span className="text-[10px] bg-[#242a3a] text-[#bdc8d1] px-1.5 py-0.5 rounded uppercase font-semibold">
              Hindcast / Monsoonal
            </span>
          </div>
        </div>

        {/* Right: Sensor Pipeline Status */}
        <div className="flex items-center gap-3 text-[10px] tracking-wider uppercase text-[#bdc8d1] overflow-x-auto py-0.5 font-mono">
          <span className="flex items-center gap-1 text-[#38bdf8]">
            <CheckCircle2 className="w-3 h-3 text-[#38bdf8]" /> Sentinel Radar
          </span>
          <span className="text-[#2f3445]">•</span>
          <span className="flex items-center gap-1 text-[#38bdf8]">
            <CheckCircle2 className="w-3 h-3 text-[#38bdf8]" /> Inundation Hazard
          </span>
          <span className="text-[#2f3445]">•</span>
          {isLoading ? (
            <span className="flex items-center gap-1 text-[#ffc176] animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" /> {pipelineStage || 'Computing Risk MCDA'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#38bdf8]">
              <CheckCircle2 className="w-3 h-3 text-[#38bdf8]" /> MCDA Solved
            </span>
          )}
          <span className="text-[#2f3445]">•</span>
          <span className="flex items-center gap-1 text-[#38bdf8] font-bold">
            <CheckCircle2 className="w-3 h-3" /> Topology Mesh Active
          </span>
        </div>
      </div>
    </section>
  );
};
