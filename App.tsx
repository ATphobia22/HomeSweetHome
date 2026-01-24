
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Brand, ActivityEntry, SystemMetrics, MediaAsset } from './types';
import Sidebar from './Sidebar';
import CommandCenter from './components/CommandCenter';
import Treasury from './components/Treasury';
import Dashboard from './components/Dashboard';
import LiveInterface from './components/LiveInterface';
import OperationsHub from './components/OperationsHub';
import FinancialAnalytics from './components/FinancialAnalytics';
import MarketIntel from './components/MarketIntel';
import ControlPlane from './components/ControlPlane';
import NPRGrid from './components/NPRGrid';
import SpatialIntelligence from './components/SpatialIntelligence';
import ComputeNode from './components/ComputeNode';
import SourceIntel from './components/SourceIntel';
import TestHarness from './components/TestHarness';
import EnvSetup from './components/EnvSetup';
import NPRLaunch from './components/NPRLaunch';
import GlobalSearch from './components/GlobalSearch';
import PatentArchitect from './components/PatentArchitect';
import StructuredAlpha from './components/StructuredAlpha';
import SecurityScanner from './components/SecurityScanner';
import AdapterHub from './components/AdapterHub';
import Epicenter from './components/Epicenter';
import GLPDoctrine from './components/GLPDoctrine';
import QuantumAILens from './components/QuantumAILens';
import MissionControl from './components/MissionControl';
import BiometricOverlay from './components/BiometricOverlay';
import Studio from './components/Studio';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.COMMAND_CENTER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(true);
  
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: 'brand_1',
      name: 'NVIDIA SPATIAL ALPHA',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/3050/3050215.png',
      status: 'ACTIVE',
      metrics: { revenue: 840000, orders: 342, adSpend: 15600, profit: 124000 },
      config: { storeTemplate: 'spatial-dark', region: 'APAC', logistics: 'IBM-Priority' }
    },
    {
      id: 'brand_2',
      name: 'BLACKWELL SPATIAL',
      logoUrl: 'https://cdn-icons-png.flaticon.com/512/3050/3050215.png',
      status: 'LAUNCHING',
      metrics: { revenue: 0, orders: 0, adSpend: 0, profit: 0 },
      config: { storeTemplate: 'minimal-light', region: 'US-EAST', logistics: 'Standard-Express' }
    }
  ]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('brand_1');
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const [metrics] = useState<SystemMetrics>({
    tflops: 4096, latency: 8.4, uptime: 99.999, memoryBandwidth: 2048,
    temp: 36.5, nodeCount: 12, cacheHitRate: 99.8, circuitStatus: 'CLOSED',
    requestThroughput: 8500, wafShield: 'ACTIVE', anycastHealth: 100,
    zeroTrustTunnel: 'CONNECTED'
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const addActivity = useCallback((brandId: string, message: string, type: ActivityEntry['type']) => {
    const entry: ActivityEntry = {
      id: Math.random().toString(36).substr(2, 9),
      brandId,
      timestamp: Date.now(),
      message,
      type
    };
    setActivity(prev => [entry, ...prev].slice(0, 100));
  }, []);

  const selectedBrand = brands.find(b => b.id === selectedBrandId) || brands[0];

  const handleProfitUpdate = (amt: number) => {
    setBrands(prev => prev.map(b => 
      b.id === selectedBrandId 
        ? { ...b, metrics: { ...b.metrics, profit: b.metrics.profit + amt } } 
        : b
    ));
    addActivity(selectedBrandId, `Liquidity Extraction Settled: +$${amt.toLocaleString()}`, 'SETTLEMENT');
  };

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
    setShowAuthOverlay(false);
    addActivity(selectedBrandId, "Master Authentication Verified: Anthony Tucker", "METRIC");
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-indigo-500 font-mono">
        <div className="relative mb-12">
          <div className="w-40 h-40 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
          <i className="fa-solid fa-om absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse"></i>
        </div>
        <p className="text-[20px] font-black uppercase tracking-[2em] animate-pulse ml-[2em]">SOVEREIGN CONSOLE INIT</p>
      </div>
    );
  }

  if (showAuthOverlay) {
    return <BiometricOverlay onAuthenticated={handleAuthComplete} />;
  }

  if (currentView === AppView.NPR_LAUNCH) {
    return <NPRLaunch />;
  }

  if (currentView === AppView.MISSION_CONTROL) {
    return <MissionControl onComplete={() => setCurrentView(AppView.COMMAND_CENTER)} />;
  }

  return (
    <div className="flex h-screen bg-black text-slate-100 overflow-hidden font-mono selection:bg-indigo-500/30">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        balance={selectedBrand.metrics.profit} 
        metrics={metrics} 
      />
      
      <main className="flex-1 overflow-y-auto relative z-10 p-4 md:p-12 pb-24 md:pb-12 scrollbar-hide scroll-smooth">
        <div className="max-w-[1700px] mx-auto space-y-12">
          {currentView === AppView.COMMAND_CENTER && (
            <CommandCenter 
              brand={selectedBrand} 
              brands={brands} 
              onBrandSelect={setSelectedBrandId}
              activity={activity.filter(a => a.brandId === selectedBrandId)}
              onActionStart={(msg) => addActivity(selectedBrandId, msg, 'WORKFLOW')}
              onViewChange={setCurrentView}
              onReAuth={() => setShowAuthOverlay(true)}
            />
          )}
          {currentView === AppView.AI_STUDIO && (
            <Studio onAssetGenerated={(a) => setAssets(prev => [a, ...prev])} />
          )}
          {currentView === AppView.EPICENTER && (
            <Epicenter />
          )}
          {currentView === AppView.GLP_DOCTRINE && (
            <GLPDoctrine />
          )}
          {currentView === AppView.QUANTUM_AI_LENS && (
            <QuantumAILens />
          )}
          {currentView === AppView.GLOBAL_SEARCH && (
            <GlobalSearch />
          )}
          {currentView === AppView.STRUCTURED_ALPHA && (
            <StructuredAlpha />
          )}
          {currentView === AppView.SECURITY_SCAN && (
            <SecurityScanner />
          )}
          {currentView === AppView.ADAPTER_HUB && (
            <AdapterHub />
          )}
          {currentView === AppView.CONTROL_PLANE && (
            <ControlPlane />
          )}
          {currentView === AppView.NPR_GRID && (
            <NPRGrid />
          )}
          {currentView === AppView.COMPUTE_NODE && (
            <ComputeNode />
          )}
          {currentView === AppView.SOURCE_INTEL && (
            <SourceIntel onViewChange={setCurrentView} />
          )}
          {currentView === AppView.PATENT_ARCHITECT && (
            <PatentArchitect />
          )}
          {currentView === AppView.TEST_HARNESS && (
            <TestHarness />
          )}
          {currentView === AppView.ENV_SETUP && (
            <EnvSetup onLaunchRequested={() => setCurrentView(AppView.NPR_LAUNCH)} />
          )}
          {currentView === AppView.SPATIAL_INTEL && (
            <SpatialIntelligence />
          )}
          {currentView === AppView.SCAN && (
            <Dashboard 
              assets={assets} 
              onAddAsset={(a) => setAssets(prev => [a, ...prev])} 
              onDeleteAsset={(id) => setAssets(prev => prev.filter(a => a.id !== id))} 
            />
          )}
          {currentView === AppView.ANALYTICS && (
            <div className="space-y-12">
              <MarketIntel onProfit={handleProfitUpdate} />
              <FinancialAnalytics balance={selectedBrand.metrics.profit} />
            </div>
          )}
          {currentView === AppView.TREASURY && (
            <Treasury 
              balance={selectedBrand.metrics.profit} 
              deposits={[]} 
              preferredRail="bank" 
              onRailChange={() => {}} 
            />
          )}
          {currentView === AppView.OPERATIONS && (
            <OperationsHub />
          )}
        </div>
      </main>

      <div className="fixed bottom-10 right-10 z-[100]">
        <button 
          onClick={() => setCurrentView(currentView === AppView.VOICE ? AppView.COMMAND_CENTER : AppView.VOICE)}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-2xl transition-all ${
            currentView === AppView.VOICE ? 'bg-red-500 rotate-45' : 'bg-indigo-600 hover:scale-110 active:scale-95'
          }`}
        >
          {currentView === AppView.VOICE ? <i className="fa-solid fa-plus"></i> : <i className="fa-solid fa-microphone"></i>}
        </button>
      </div>

      {currentView === AppView.VOICE && (
        <div className="fixed inset-0 z-[150] bg-black/98 p-4 md:p-12 overflow-y-auto animate-in zoom-in-95 duration-300">
          <button onClick={() => setCurrentView(AppView.COMMAND_CENTER)} className="absolute top-10 right-10 text-slate-500 text-4xl hover:text-white transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <LiveInterface />
        </div>
      )}
    </div>
  );
};

export default App;
