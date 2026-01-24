
import React from 'react';
import { AppView, SystemMetrics } from './types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  balance: number;
  metrics?: SystemMetrics;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, balance, metrics }) => {
  const menuItems = [
    { view: AppView.EPICENTER, icon: 'fa-chess-queen', label: 'EPICENTER' },
    { view: AppView.AI_STUDIO, icon: 'fa-wand-magic-sparkles', label: 'AI STUDIO' },
    { view: AppView.QUANTUM_AI_LENS, icon: 'fa-microscope', label: 'AI LENS' },
    { view: AppView.GLP_DOCTRINE, icon: 'fa-om', label: 'GLP DOCTRINE' },
    { view: AppView.COMMAND_CENTER, icon: 'fa-gamepad', label: 'COMMAND' },
    { view: AppView.GLOBAL_SEARCH, icon: 'fa-globe', label: 'GLOBAL INTEL' },
    { view: AppView.STRUCTURED_ALPHA, icon: 'fa-chart-mixed', label: 'STRUCTURED' },
    { view: AppView.CONTROL_PLANE, icon: 'fa-microchip', label: 'CONTROL' },
    { view: AppView.SECURITY_SCAN, icon: 'fa-shield-halved', label: 'SECURITY' },
    { view: AppView.NPR_GRID, icon: 'fa-diagram-cells', label: 'NPR GRID' },
    { view: AppView.ADAPTER_HUB, icon: 'fa-server', label: 'ADAPTERS' },
    { view: AppView.PATENT_ARCHITECT, icon: 'fa-file-shield', label: 'PATENT ARCH' },
    { view: AppView.ENV_SETUP, icon: 'fa-layer-group', label: 'SETUP' },
    { view: AppView.SOURCE_INTEL, icon: 'fa-code-fork', label: 'SOURCE' },
    { view: AppView.COMPUTE_NODE, icon: 'fa-calculator', label: 'COMPUTE' },
    { view: AppView.SPATIAL_INTEL, icon: 'fa-map-location-dot', label: 'SPATIAL' },
    { view: AppView.TEST_HARNESS, icon: 'fa-vial-circle-check', label: 'TESTS' },
    { view: AppView.SCAN, icon: 'fa-barcode-read', label: 'SCOUT' },
    { view: AppView.ANALYTICS, icon: 'fa-chart-mixed', label: 'ALPHA' },
    { view: AppView.TREASURY, icon: 'fa-vault', label: 'TREASURY' },
    { view: AppView.OPERATIONS, icon: 'fa-microchip-ai', label: 'NODES' },
  ];

  return (
    <aside className="hidden lg:flex w-72 bg-black border-r border-white/5 flex-col h-screen shrink-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent"></div>
      <div className="p-8 h-full flex flex-col overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-5 mb-12 px-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-black flex items-center justify-center border border-indigo-500/20 shadow-2xl relative overflow-hidden group">
            <i className="fa-solid fa-chess-knight text-white text-2xl relative z-10"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter text-white uppercase leading-none italic">Sovereign</span>
            <span className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.5em] mt-1">Control Plane</span>
          </div>
        </div>

        <div className="p-6 rounded-[35px] bg-white/5 border border-white/10 shadow-inner mb-10 px-8 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
          <p className="text-[8px] text-slate-500 uppercase font-black tracking-mega mb-3 italic">Active Portfolio Yield</p>
          <p className="text-3xl font-black text-white tracking-tighter leading-none italic group-hover:text-indigo-400 transition-colors">
            ${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </p>
        </div>

        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center justify-between px-6 py-3.5 rounded-[20px] transition-all duration-300 group ${
                currentView === item.view
                  ? 'bg-indigo-500/10 text-white border border-indigo-500/20 shadow-lg'
                  : 'text-slate-600 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <i className={`fa-solid ${item.icon} text-lg w-6 group-hover:scale-125 transition-transform text-center`}></i>
                <span className="font-black tracking-[0.2em] text-[10px] uppercase italic">{item.label}</span>
              </div>
              {currentView === item.view && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>}
            </button>
          ))}
        </nav>

        {metrics && (
          <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600">
               <span>Anycast Rail</span>
               <span className="text-indigo-500">Node-21605</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600">
               <span>Latency</span>
               <span className="text-emerald-500">{metrics.latency}ms</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600">
               <span>Throughput</span>
               <span className="text-indigo-400">{metrics.requestThroughput} TPS</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
