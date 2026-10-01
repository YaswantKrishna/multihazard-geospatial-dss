import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3 
} from 'lucide-react';
import type { AnalysisResult } from '../types';

interface AnalysisEngineViewProps {
  analysis: AnalysisResult;
}

export const AnalysisEngineView: React.FC<AnalysisEngineViewProps> = ({ analysis }) => {
  // Data for Hazard Contribution Bar Chart
  const hazardData = [
    { name: 'Flood Inundation', value: analysis.contributions.flood, fill: '#ef4444' },
    { name: 'Terrain Slope', value: analysis.contributions.terrain, fill: '#ffc176' },
    { name: 'Extreme Rainfall', value: analysis.contributions.rainfall, fill: '#38bdf8' },
    { name: 'Human Exposure', value: analysis.contributions.exposure, fill: '#bbc7de' },
  ];

  // Data for Risk Classification Distribution
  const distributionData = [
    { name: 'Low (0.0–0.2)', value: analysis.risk_distribution.low, color: '#22c55e' },
    { name: 'Moderate (0.2–0.4)', value: analysis.risk_distribution.moderate, color: '#eab308' },
    { name: 'High (0.4–0.6)', value: analysis.risk_distribution.high, color: '#f97316' },
    { name: 'Very High (0.6–0.8)', value: analysis.risk_distribution.very_high, color: '#ef4444' },
    { name: 'Extreme (0.8–1.0)', value: analysis.risk_distribution.extreme, color: '#991b1b' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      {/* Title Banner */}
      <div className="flex items-center justify-between bg-[#151b2b] p-4 rounded-lg border border-[#1f2937]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
            <BarChart3 className="w-6 h-6 text-[#38bdf8]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#dde2f8]">Multi-Hazard Analytic Engine & Statistical Decomposition</h2>
            <p className="text-xs text-[#bdc8d1]">
              Decomposed raster layers for {analysis.aoi_name} • Multi-Criteria Weighted Sum Model Evaluation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-[#191f2f] text-[#38bdf8] px-3 py-1.5 rounded border border-[#38bdf8]/30 font-semibold">
            Composite Score: {analysis.overall_risk_score.toFixed(2)} ({analysis.overall_risk_class})
          </span>
        </div>
      </div>

      {/* Grid of Statistical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Hazard Attribution Breakdown */}
        <div className="bg-[#151b2b] p-4 rounded-lg border border-[#1f2937] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#263244] pb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#dde2f8]">
              Hazard Indicator Attribution (%)
            </span>
            <span className="text-[10px] text-[#38bdf8] font-mono">Weighted Contribution</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hazardData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#87929a" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" stroke="#dde2f8" fontSize={11} width={110} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#263244', color: '#dde2f8', borderRadius: '6px' }}
                  formatter={(value: any) => [`${value}%`, 'Attribution']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {hazardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#bdc8d1] leading-relaxed">
            Attribution reflects the normalized MCDM product of each hazard index against current user weights. Flood inundation contributes the largest share ({analysis.contributions.flood}%) in current coastal lowlands.
          </p>
        </div>

        {/* Chart 2: Risk Class Spatial Distribution */}
        <div className="bg-[#151b2b] p-4 rounded-lg border border-[#1f2937] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#263244] pb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#dde2f8]">
              Spatial Risk Distribution (% of AOI)
            </span>
            <span className="text-[10px] text-[#ffc176] font-mono">Zonal Statistics</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${(name || '').split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#263244', color: '#dde2f8', borderRadius: '6px' }}
                  formatter={(value: any) => [`${value}% of total sector`, 'Area']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center text-[10px] font-mono">
            {distributionData.map(d => (
              <span key={d.name} className="flex items-center gap-1 text-[#bdc8d1]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                {d.name.split(' ')[0]}: {d.value}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Multi-Hazard Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#151b2b] p-3 rounded-lg border border-[#ef4444]/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#ffb4ab]">Sentinel-1 SAR Flood</span>
            <span className="text-[10px] font-mono text-[#ef4444] bg-[#ef4444]/20 px-1 rounded">PRIMARY</span>
          </div>
          <span className="text-2xl font-bold font-mono text-[#dde2f8]">1.4 m</span>
          <span className="text-[10px] text-[#bdc8d1]">Max Inundation Depth along Adyar Basin. Specular radar backscatter drop: -8.4 dB.</span>
        </div>

        <div className="bg-[#151b2b] p-3 rounded-lg border border-[#ffc176]/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#ffc176]">SRTM Elevation/Slope</span>
            <span className="text-[10px] font-mono text-[#ffc176] bg-[#ffc176]/20 px-1 rounded">TERRAIN</span>
          </div>
          <span className="text-2xl font-bold font-mono text-[#dde2f8]">+6.4 m</span>
          <span className="text-[10px] text-[#bdc8d1]">Mean MSL Elevation. Critical lowland depressions with &lt; 3° slope suffer severe ponding.</span>
        </div>

        <div className="bg-[#151b2b] p-3 rounded-lg border border-[#38bdf8]/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8ed5ff]">CHIRPS Rain Accumulation</span>
            <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/20 px-1 rounded">PRECIP</span>
          </div>
          <span className="text-2xl font-bold font-mono text-[#dde2f8]">284 mm</span>
          <span className="text-[10px] text-[#bdc8d1]">30-Day Accumulation. Monsoonal precipitation anomaly is +78% above 10-year historical baseline.</span>
        </div>

        <div className="bg-[#151b2b] p-3 rounded-lg border border-[#bbc7de]/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#dde2f8]">Dynamic World Exposure</span>
            <span className="text-[10px] font-mono text-[#bbc7de] bg-[#bbc7de]/20 px-1 rounded">LULC</span>
          </div>
          <span className="text-2xl font-bold font-mono text-[#dde2f8]">78.4%</span>
          <span className="text-[10px] text-[#bdc8d1]">Built-up impervious surface fraction in urban core, exacerbating flash runoff velocity.</span>
        </div>
      </div>
    </div>
  );
};
