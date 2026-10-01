import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Plus, Minus, Crosshair, Layers } from 'lucide-react';
import type { AnalysisResult, RouteResponse, AOI } from '../types';

// Fix Leaflet marker icon paths in Vite/Webpack bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createFacilityIcon = (type: 'hospital' | 'shelter', name: string) => {
  const color = type === 'hospital' ? '#38bdf8' : '#ffc176';
  const symbol = type === 'hospital' ? '🏥' : '⛺';
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;gap:4px;background:rgba(21,27,43,0.92);border-left:2px solid ${color};border:1px solid #263244;border-left:2px solid ${color};padding:2px 6px;border-radius:4px;box-shadow:0 4px 10px rgba(0,0,0,.5);cursor:pointer;white-space:nowrap;">
      <span style="font-size:12px;">${symbol}</span>
      <span style="font-size:9px;font-weight:600;color:#dde2f8;font-family:sans-serif;">${name.split(' ').slice(0, 2).join(' ')}</span>
    </div>`,
    iconSize: [110, 20],
    iconAnchor: [55, 10],
  });
};

const createPinIcon = (label: string, color: string) => {
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
      <div style="background:#191f2f;border:1px solid #263244;border-bottom:2px solid ${color};color:#dde2f8;font-size:10px;font-family:monospace;font-weight:bold;padding:2px 6px;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.5);white-space:nowrap;">${label}</div>
      <div style="color:${color};font-size:18px;line-height:1;">📍</div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Sub-component: sync map view when AOI changes
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, zoom, map]);
  return null;
};

// Sub-component: track cursor coords
const CoordTracker: React.FC<{ onChange: (lat: number, lng: number) => void }> = ({ onChange }) => {
  useMapEvents({ mousemove(e) { onChange(e.latlng.lat, e.latlng.lng); } });
  return null;
};

interface TacticalMapProps {
  currentAoi: AOI;
  analysis: AnalysisResult;
  routeResponse: RouteResponse | null;
  activeRouteMode: 'shortest' | 'least_risk';
  focusedHotspotId: string | null;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  currentAoi, analysis, routeResponse, activeRouteMode,
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [rasterOpacity, setRasterOpacity] = useState(80);
  const [layerMode, setLayerMode] = useState<'composite' | 'flood'>('composite');
  const [showRoads, setShowRoads] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [coord, setCoord] = useState({ lat: currentAoi.center[0], lng: currentAoi.center[1] });
  const mapRef = useRef<L.Map | null>(null);

  const origin: [number, number] = [currentAoi.default_origin.lat, currentAoi.default_origin.lng];
  const dest: [number, number] = [currentAoi.default_destination.lat, currentAoi.default_destination.lng];

  const shortestCoords: [number, number][] = routeResponse?.shortest_route?.coordinates?.length
    ? (routeResponse.shortest_route.coordinates as [number, number][])
    : [origin, [13.031, 80.243], [13.039, 80.246], [13.049, 80.248], dest];

  const leastRiskCoords: [number, number][] = routeResponse?.least_risk_route?.coordinates?.length
    ? (routeResponse.least_risk_route.coordinates as [number, number][])
    : [origin, [13.021, 80.231], [13.029, 80.222], [13.042, 80.224], [13.054, 80.232], [13.059, 80.242], dest];

  return (
    <main className="xl:col-span-6 flex flex-col relative h-[780px] xl:h-[820px] rounded-lg overflow-hidden bg-[#080e1d] border border-[#1f2937] shadow-2xl">
      {/* Leaflet map */}
      <MapContainer
        center={currentAoi.center}
        zoom={currentAoi.zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <MapController center={currentAoi.center} zoom={currentAoi.zoom} />
        <CoordTracker onChange={(lat, lng) => setCoord({ lat, lng })} />

        {/* Dark CartoDB basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Hotspot polygons */}
        {showHotspots && analysis.hotspots.map((h) =>
          h.polygon && h.polygon.length > 2 ? (
            <Polygon
              key={h.id}
              positions={h.polygon as [number, number][]}
              pathOptions={{
                color: h.risk_score >= 0.8 ? '#ef4444' : '#f59e0b',
                fillColor: h.risk_score >= 0.8 ? '#dc2626' : '#f97316',
                fillOpacity: (rasterOpacity / 100) * 0.45,
                weight: 2,
                dashArray: h.id === 'HZ-04' ? '6 3' : undefined,
              }}
            >
              <Popup>
                <div style={{ padding: '4px', fontFamily: 'sans-serif' }}>
                  <b style={{ color: '#ffb4ab' }}>{h.name}</b><br />
                  <span style={{ fontSize: '11px', color: '#dde2f8' }}>Risk: {h.risk_score.toFixed(2)} — {h.dominant_hazard}</span><br />
                  <span style={{ fontSize: '10px', color: '#bdc8d1' }}>{h.depth_or_intensity}</span><br />
                  <span style={{ fontSize: '10px', color: '#38bdf8' }}>Trauma: {h.nearest_hospital}</span>
                </div>
              </Popup>
            </Polygon>
          ) : null
        )}

        {/* Road network risk-color coded */}
        {showRoads && analysis.layers?.road_network?.features?.map((f: any, idx: number) => {
          const coords = (f.geometry.coordinates as [number, number][]).map(c => [c[1], c[0]] as [number, number]);
          const risk: number = f.properties.risk || 0.2;
          const roadColor = risk >= 0.6 ? '#ef4444' : risk >= 0.3 ? '#f59e0b' : '#22c55e';
          return (
            <Polyline
              key={`road-${idx}`}
              positions={coords}
              pathOptions={{ color: roadColor, weight: risk >= 0.6 ? 3.5 : 2.5, opacity: 0.75, dashArray: risk >= 0.6 ? '4 4' : undefined }}
            />
          );
        })}

        {/* Shortest route — dashed amber */}
        <Polyline
          positions={shortestCoords}
          pathOptions={{ color: '#f59e0b', weight: activeRouteMode === 'shortest' ? 5 : 3, dashArray: '8 6', opacity: activeRouteMode === 'shortest' ? 1.0 : 0.4 }}
        >
          <Popup>
            <b style={{ color: '#ffc176' }}>SHORTEST ROUTE</b><br />
            {routeResponse && <span>{routeResponse.shortest_route.distance_km} km | Risk: {routeResponse.shortest_route.risk_score.toFixed(2)} (High)</span>}
          </Popup>
        </Polyline>

        {/* Least-risk route — solid cyan */}
        <Polyline
          positions={leastRiskCoords}
          pathOptions={{ color: '#38bdf8', weight: activeRouteMode === 'least_risk' ? 5.5 : 2.5, opacity: activeRouteMode === 'least_risk' ? 1.0 : 0.35, lineCap: 'round', lineJoin: 'round' }}
        >
          <Popup>
            <b style={{ color: '#38bdf8' }}>LEAST-RISK RECOMMENDED</b><br />
            {routeResponse && <span>{routeResponse.least_risk_route.distance_km} km | Risk: {routeResponse.least_risk_route.risk_score.toFixed(2)} (Safe)</span>}
          </Popup>
        </Polyline>

        {/* Origin pin */}
        <Marker position={origin} icon={createPinIcon(`ORIGIN: ${currentAoi.default_origin.name.split(' ')[0]}`, '#38bdf8')}>
          <Popup><b style={{ color: '#38bdf8' }}>ORIGIN</b><br />{currentAoi.default_origin.name}</Popup>
        </Marker>

        {/* Destination pin */}
        <Marker position={dest} icon={createPinIcon(`DEST: ${currentAoi.default_destination.name.split(' ')[0]}`, '#ef4444')}>
          <Popup><b style={{ color: '#ffb4ab' }}>DESTINATION</b><br />{currentAoi.default_destination.name}</Popup>
        </Marker>

        {/* Hospital markers */}
        {showHospitals && analysis.facilities.filter(f => f.type === 'hospital').map(h => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={createFacilityIcon('hospital', h.name)}>
            <Popup>
              <b style={{ color: '#38bdf8' }}>{h.name}</b><br />
              <span style={{ fontSize: '10px' }}>{h.capacity} | Status: {h.status}</span>
            </Popup>
          </Marker>
        ))}

        {/* Shelter markers */}
        {showShelters && analysis.facilities.filter(f => f.type === 'shelter').map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={createFacilityIcon('shelter', s.name)}>
            <Popup>
              <b style={{ color: '#ffc176' }}>{s.name}</b><br />
              <span style={{ fontSize: '10px' }}>{s.capacity} | {s.status}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Pulsing hotspot callout overlay */}
      <div className="absolute left-[41%] top-[56%] -translate-x-1/2 -translate-y-1/2 bg-[#080e1d]/95 p-2 rounded border border-[#ef4444] shadow-xl flex items-center gap-2 max-w-[220px] pointer-events-none z-30 animate-bounce">
        <span className="flex h-2.5 w-2.5 shrink-0 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
        </span>
        <div>
          <div className="text-[10px] font-bold text-[#ffb4ab] uppercase">#HZ-04 Adyar Overflow</div>
          <div className="text-[9px] text-[#bdc8d1]">Depth: 1.4m • Impassable corridor</div>
        </div>
      </div>

      {/* GIS Controls HUD (top-right) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-1.5">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="bg-[#151b2b]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#263244] shadow-lg text-[#dde2f8] text-xs uppercase font-semibold flex items-center gap-1.5 hover:bg-[#191f2f] transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#38bdf8]" />Layers
          </button>
          {showLayerMenu && (
            <div className="absolute right-0 mt-1 w-60 bg-[#080e1d]/97 backdrop-blur-xl p-3 rounded-lg border border-[#263244] shadow-2xl flex flex-col gap-2 z-40 text-[11px]">
              <div className="flex justify-between border-b border-[#263244] pb-1">
                <span className="text-[#38bdf8] font-bold uppercase text-[10px]">Raster Blend</span>
                <span className="text-[#bdc8d1] font-mono">{rasterOpacity}%</span>
              </div>
              <input type="range" min="10" max="100" value={rasterOpacity} onChange={e => setRasterOpacity(+e.target.value)} className="w-full accent-[#38bdf8] cursor-pointer" />
              <div className="flex flex-col gap-1 text-[#dde2f8]">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="lm" checked={layerMode === 'composite'} onChange={() => setLayerMode('composite')} className="accent-[#38bdf8]" /> Multi-Hazard Composite</label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="lm" checked={layerMode === 'flood'} onChange={() => setLayerMode('flood')} className="accent-[#38bdf8]" /> SAR Flood Extent</label>
              </div>
              <div className="flex flex-col gap-1 text-[#dde2f8] border-t border-[#263244] pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={showRoads} onChange={e => setShowRoads(e.target.checked)} className="accent-[#38bdf8]" /> Road Heatmap</label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={showHospitals} onChange={e => setShowHospitals(e.target.checked)} className="accent-[#38bdf8]" /> Hospitals ({analysis.facilities.filter(f => f.type === 'hospital').length})</label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={showShelters} onChange={e => setShowShelters(e.target.checked)} className="accent-[#38bdf8]" /> Shelters ({analysis.facilities.filter(f => f.type === 'shelter').length})</label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={showHotspots} onChange={e => setShowHotspots(e.target.checked)} className="accent-[#38bdf8]" /> Hazard Polygons</label>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col bg-[#151b2b]/90 rounded border border-[#263244] shadow-lg overflow-hidden">
          <button onClick={() => mapRef.current?.zoomIn()} className="p-2 hover:bg-[#191f2f] text-[#bdc8d1] hover:text-white transition-colors cursor-pointer" title="Zoom In"><Plus className="w-4 h-4" /></button>
          <button onClick={() => mapRef.current?.zoomOut()} className="p-2 hover:bg-[#191f2f] text-[#bdc8d1] hover:text-white transition-colors cursor-pointer border-t border-[#263244]" title="Zoom Out"><Minus className="w-4 h-4" /></button>
          <button onClick={() => mapRef.current?.setView(currentAoi.center, currentAoi.zoom)} className="p-2 hover:bg-[#191f2f] text-[#bdc8d1] hover:text-white transition-colors cursor-pointer border-t border-[#263244]" title="Recenter"><Crosshair className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Risk Legend (bottom-left) */}
      <div className="absolute bottom-3 left-3 z-30 bg-[#080e1d]/92 backdrop-blur-md p-2.5 rounded-lg border border-[#263244] shadow-xl max-w-xs flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#dde2f8] font-bold uppercase">Risk Level (0.00–1.00)</span>
          <span className="text-[#38bdf8] font-mono font-semibold">MCDA</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#22c55e] via-[#eab308] via-[#f97316] via-[#ef4444] to-[#991b1b]" />
        <div className="flex items-center justify-between text-[9px] text-[#bdc8d1] font-mono">
          <span>0.0 Low</span><span>0.25</span><span>0.50</span><span>0.75</span><span className="text-[#ffb4ab] font-bold">1.0 Ext</span>
        </div>
        <div className="flex items-center justify-between pt-0.5 text-[9px] text-[#bdc8d1] border-t border-[#1f2937] mt-0.5">
          <div className="flex items-center gap-1"><div className="h-1 w-8 bg-[#87929a]" /><span>2.5 km</span></div>
          <span className="font-mono text-[8px]">WGS 84 / UTM 44N</span>
        </div>
      </div>

      {/* Cursor Coordinates (bottom-right) */}
      <div className="absolute bottom-3 right-3 z-20 hidden md:flex items-center gap-2 bg-[#151b2b]/80 px-2.5 py-1 rounded border border-[#263244] font-mono text-[10px] text-[#bdc8d1]">
        <span>LAT: {coord.lat.toFixed(4)}°</span>
        <span>LON: {coord.lng.toFixed(4)}°</span>
        <span className="text-[#38bdf8]">ELEV: +{currentAoi.elevation_msl}m</span>
      </div>
    </main>
  );
};
