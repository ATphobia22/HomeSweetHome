
import React, { useState, useMemo } from 'react';
import { AdCampaign, Shipment, HardwareNode } from '../types';

const OperationsHub: React.FC = () => {
  const [ads] = useState<AdCampaign[]>([
    { platform: 'X', status: 'active', spend: 450, reach: 24500, conversions: 120, lastUpdate: Date.now() },
    { platform: 'TikTok', status: 'active', spend: 1200, reach: 180000, conversions: 450, lastUpdate: Date.now() - 50000 },
    { platform: 'Instagram', status: 'active', spend: 800, reach: 56000, conversions: 210, lastUpdate: Date.now() - 120000 },
  ]);

  const [shipments] = useState<Shipment[]>([
    { id: 'TUC-8812', destination: 'New York Enclave', method: 'Air-Express', status: 'In-Transit', value: 4500, timestamp: Date.now() },
    { id: 'DGX-SPARK-01', destination: 'Node 21605', method: 'Logistics-Nexus', status: 'Clearing-Customs', value: 128000, timestamp: Date.now() - 3600000 },
    { id: 'TUC-1205', destination: 'Tokyo, JP', method: 'Sea-Freight', status: 'Processing', value: 25000, timestamp: Date.now() - 7200000 },
  ]);

  const hardware: HardwareNode[] = [
    { id: 'GB10-CORE-01', type: 'NVIDIA-GB10', status: 'COMPUTING', utilization: 98, temp: '44°C' },
    { id: 'SPARK-MASTER', type: 'NVIDIA-GB10', status: 'ONLINE', utilization: 8, temp: '32°C' },
    { id: 'QCS-ASPEN-M3', type: 'RIGETTI-QPU', status: 'ONLINE', utilization: 0, temp: '15mK' }
  ];

  const hardwareSpecs = useMemo(() => [
    { label: 'Architecture', value: 'NVIDIA Grace Blackwell' },
    { label: 'CPU Cluster', value: '20-core Arm (GB10)' },
    { label: 'Compute Power', value: '1 PFLOP (FP4)' },
    { label: 'Unified Memory', value: '128 GB LPDDR5x' },
    { label: 'Wasm Runtime', value: 'v8-Sovereign-Edge' },
    { label: 'T+0 Rail', value: 'Sutton/CashApp Sync' }
  ], []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-cyan-500 tracking-[0.5em] uppercase mb-1 italic">Global Logistics & Compute Deployment Grid</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">OPERATIONS <span className="text-cyan-500">HUB</span></h1>
        </div>
        <div className="text-right">
           <div className="flex gap-4 mb-2 justify-end">
              <i className="fa-solid fa-microchip text-slate-700 hover:text-cyan-500 transition-colors"></i>
              <i className="fa-brands fa-nvidia text-slate-700 hover:text-cyan-500 transition-colors"></i>
              <i className="fa-solid fa-atom text-slate-700 hover:text-cyan-500 transition-colors"></i>
           </div>
           <span className="px-4 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-[9px] font-black uppercase italic text-cyan-400 tracking-widest">v11.8 Blackwell Sync: 100% Secure</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hardware.map(node => (
                <div key={node.id} className="iphone-card rounded-[35px] p-8 border-white/5 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                   <div className="scanner-line opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="flex justify-between items-start mb-10">
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{node.type}</p>
                        <h4 className="text-lg font-black text-white italic leading-none">{node.id}</h4>
                      </div>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${node.status === 'COMPUTING' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 animate-pulse' : 'bg-slate-800 text-slate-500 border-white/10'}`}>
                        {node.status}
                      </span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="text-nano text-slate-600 font-black uppercase italic">Utilization</span>
                         <span className="text-white font-black text-xs">{node.utilization}%</span>
                      </div>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                         <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${node.utilization}%` }}></div>
                      </div>
                      <div className="flex justify-between text-nano font-black text-slate-600 uppercase italic pt-2">
                         <span>Core Temp</span>
                         <span className="text-cyan-400">{node.temp}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="iphone-card rounded-[40px] p-8 md:p-12 bg-black/60 shadow-2xl border-white/5 relative overflow-hidden">
              <div className="scanner-line"></div>
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                 <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">NVIDIA DGX Spark Master Registry</h3>
                 <span className="text-[9px] text-slate-700 font-mono italic">WebAssembly.instantiate(module_Blackwell)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                 {hardwareSpecs.map(spec => (
                   <div key={spec.label} className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-cyan-500/40 transition-all">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2 leading-none">{spec.label}</p>
                      <p className="text-base font-black text-white italic uppercase tracking-tight leading-none group-hover:text-cyan-400 transition-colors">{spec.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
            <i className="fa-solid fa-truck-fast text-indigo-500"></i>
            Logistics Pipeline
          </h3>
          <div className="space-y-4">
            {shipments.map((ship, i) => (
              <div key={i} className="iphone-card rounded-[35px] p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full font-black border border-indigo-500/20">{ship.id}</span>
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest italic animate-pulse">{ship.status}</span>
                </div>
                <h4 className="text-xl font-black italic uppercase text-white tracking-tighter leading-tight mb-1">{ship.destination}</h4>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{ship.method}</p>
                <div className="mt-4 flex justify-between items-end">
                   <p className="text-lg font-black italic text-white leading-none">${ship.value.toLocaleString()}</p>
                   <i className="fa-solid fa-arrow-up-right text-slate-800 text-xs group-hover:text-indigo-500 transition-colors"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsHub;
