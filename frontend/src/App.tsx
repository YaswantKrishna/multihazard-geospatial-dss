import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OperationalRibbon } from './components/OperationalRibbon';
import { LeftPanel } from './components/LeftPanel';
import { TacticalMap } from './components/TacticalMap';
import { RightPanel } from './components/RightPanel';
import { AnalysisEngineView } from './components/AnalysisEngineView';
import { EmergencyRoutingView } from './components/EmergencyRoutingView';
import { AboutMethodologyView } from './components/AboutMethodologyView';
import { fetchAois, runAnalysis, calculateRoute } from './services/api';
import type { AOI, AnalysisResult, MCDMWeights, RouteResponse, Facility } from './types';

export const App: React.FC = () => {
  const [aois, setAois] = useState<AOI[]>([]);
  const [currentAoi, setCurrentAoi] = useState<AOI | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'routing' | 'about'>('dashboard');
  const [weights, setWeights] = useState<MCDMWeights>({
    flood: 0.40,
    terrain: 0.25,
    rainfall: 0.20,
    exposure: 0.15
  });
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [routeResponse, setRouteResponse] = useState<RouteResponse | null>(null);
  const [activeRouteMode, setActiveRouteMode] = useState<'shortest' | 'least_risk'>('least_risk');
  const [focusedHotspotId, setFocusedHotspotId] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRoutingLoading, setIsRoutingLoading] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<string>('Data Ready');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Initialize application on load
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      setPipelineStage('Loading AOI catalog...');
      const loadedAois = await fetchAois();
      setAois(loadedAois);
      const defaultAoi = loadedAois[0]; // Chennai
      setCurrentAoi(defaultAoi);

      setPipelineStage('Executing Sentinel-1 & MCDM pipeline...');
      const initAnalysis = await runAnalysis(defaultAoi.id, weights);
      setAnalysis(initAnalysis);

      setPipelineStage('Computing evacuation topology...');
      const initRoute = await calculateRoute(
        initAnalysis.analysis_id,
        { lat: defaultAoi.default_origin.lat, lng: defaultAoi.default_origin.lng },
        { lat: defaultAoi.default_destination.lat, lng: defaultAoi.default_destination.lng },
        5.0
      );
      setRouteResponse(initRoute);
      setIsLoading(false);
      setPipelineStage('Chennai Live Ready');
    }
    init();
  }, []);

  // Handle switching AOIs
  const handleSelectAoi = async (aoi: AOI) => {
    setCurrentAoi(aoi);
    setIsLoading(true);
    setPipelineStage(`Loading ${aoi.name} satellite rasters...`);
    const newAnalysis = await runAnalysis(aoi.id, weights);
    setAnalysis(newAnalysis);

    const newRoute = await calculateRoute(
      newAnalysis.analysis_id,
      { lat: aoi.default_origin.lat, lng: aoi.default_origin.lng },
      { lat: aoi.default_destination.lat, lng: aoi.default_destination.lng },
      5.0
    );
    setRouteResponse(newRoute);
    setIsLoading(false);
    setPipelineStage(`${aoi.name.split(' ')[0]} Ready`);
  };

  // Handle weight changes and recalculate
  const handleUpdateWeights = async (newWeights: MCDMWeights) => {
    setWeights(newWeights);
    if (currentAoi) {
      const updated = await runAnalysis(currentAoi.id, newWeights);
      setAnalysis(updated);
    }
  };

  // Run full analysis trigger
  const handleRunAnalysis = async () => {
    if (!currentAoi) return;
    setIsLoading(true);
    setPipelineStage('Loading satellite data...');
    setTimeout(async () => {
      setPipelineStage('Generating hazard indicators...');
      setTimeout(async () => {
        setPipelineStage('Running MCDM model...');
        const res = await runAnalysis(currentAoi.id, weights);
        setAnalysis(res);
        setPipelineStage('Building risk map...');
        setIsLoading(false);
      }, 500);
    }, 500);
  };

  // Calculate route trigger
  const handleCalculateRoute = async () => {
    if (!currentAoi || !analysis) return;
    setIsRoutingLoading(true);
    const res = await calculateRoute(
      analysis.analysis_id,
      { lat: currentAoi.default_origin.lat, lng: currentAoi.default_origin.lng },
      { lat: currentAoi.default_destination.lat, lng: currentAoi.default_destination.lng },
      5.0
    );
    setRouteResponse(res);
    setIsRoutingLoading(false);
  };

  // Load demo handler
  const handleLoadDemo = async () => {
    if (aois.length > 0) {
      await handleSelectAoi(aois[0]); // Reset to Chennai flagship demo
    }
  };

  if (!currentAoi || !analysis) {
    return (
      <div className="w-full h-screen bg-[#080e1d] flex flex-col items-center justify-center text-[#dde2f8]">
        <div className="w-12 h-12 border-4 border-[#38bdf8] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-sm tracking-wider uppercase text-[#38bdf8]">
          Initializing MULTIHAZARD GIS DSS...
        </span>
        <span className="text-xs text-[#bdc8d1] mt-2 font-mono">{pipelineStage}</span>
      </div>
    );
  }

  return (
    <div className="bg-[#080e1d] text-[#dde2f8] min-h-screen flex flex-col font-sans selection:bg-[#38bdf8] selection:text-[#001e2c]">
      {/* 1. Header */}
      <Header
        currentAoi={currentAoi}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInfoModal={() => setShowInfoModal(true)}
      />

      {/* Main Container */}
      <main className="w-full pt-14 flex flex-col flex-1">
        {/* 2. Operational Status Ribbon */}
        <OperationalRibbon
          onLoadDemo={handleLoadDemo}
          isLoading={isLoading}
          pipelineStage={pipelineStage}
        />

        {/* 3. Dynamic Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 w-full gap-3 p-3 flex-1">
            {/* Left Command Panel */}
            <LeftPanel
              aois={aois}
              currentAoi={currentAoi}
              onSelectAoi={handleSelectAoi}
              weights={weights}
              onUpdateWeights={handleUpdateWeights}
              onRunAnalysis={handleRunAnalysis}
              isLoading={isLoading}
            />

            {/* Tactical Map Viewport */}
            <TacticalMap
              currentAoi={currentAoi}
              analysis={analysis}
              routeResponse={routeResponse}
              activeRouteMode={activeRouteMode}
              focusedHotspotId={focusedHotspotId}
            />

            {/* Right Decision Intelligence Panel */}
            <RightPanel
              analysis={analysis}
              routeResponse={routeResponse}
              activeRouteMode={activeRouteMode}
              setActiveRouteMode={setActiveRouteMode}
              onCalculateRoute={handleCalculateRoute}
              isRoutingLoading={isRoutingLoading}
              selectedFacility={selectedFacility}
              onSelectFacility={(fac) => setSelectedFacility(fac)}
              onFocusHotspot={(id) => setFocusedHotspotId(id)}
            />
          </div>
        )}

        {activeTab === 'analysis' && (
          <AnalysisEngineView analysis={analysis} />
        )}

        {activeTab === 'routing' && (
          <EmergencyRoutingView
            routeResponse={routeResponse}
            currentAoi={currentAoi}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'about' && (
          <AboutMethodologyView />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#080e1d] py-3 border-t border-[#1f2937] px-4 shadow-lg text-[10px] text-[#bdc8d1]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-[#38bdf8] font-bold">MULTIHAZARD DSS</span>
            <span>•</span>
            <span>Mission-Critical Response Framework</span>
            <span>•</span>
            <span>Sentinel GIS Core v4.18</span>
          </div>
          <div>
            © 2026 Geospatial Disaster Intelligence. Restricted Operational Access.
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151b2b] border border-[#263244] rounded-lg max-w-lg w-full p-5 flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#263244] pb-2">
              <span className="text-sm font-bold text-[#dde2f8]">MULTIHAZARD DSS Operational Guide</span>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-[#bdc8d1] hover:text-[#dde2f8] text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-[#bdc8d1] space-y-2 leading-relaxed">
              <p>
                This platform ingests Sentinel-1 SAR, Sentinel-2 MSI, SRTM 30m DEM, and CHIRPS precipitation to compute a multi-hazard composite risk index.
              </p>
              <p>
                <strong>Emergency Routing:</strong> The system builds a road network graph where edge impedances are weighted by intersecting disaster hazard risk:
                <br/><code className="text-[#38bdf8] font-mono">Cost = Distance × (1 + λ × Risk)</code>
              </p>
              <p>
                The resulting <em>Least-Risk Route</em> avoids flooded bottleneck segments, reducing convoy hazard exposure while quantifying the exact distance trade-off.
              </p>
            </div>
            <div className="flex justify-end pt-2 border-t border-[#263244]">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-3 py-1.5 bg-[#38bdf8] text-[#001e2c] font-bold text-xs rounded cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
