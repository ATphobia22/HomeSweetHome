
import React, { useState, useEffect } from 'react';
import { gemini } from '../services/gemini';
import { ArbitrageNode } from '../types';

const Inventory: React.FC = () => {
  const [nodes, setNodes] = useState<ArbitrageNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanArbitrage = async () => {
    setIsScanning(true);
    try {
      const data = await gemini.fetchArbitrageAllocations();
      setNodes(data);
    } catch (e) {
      console.error("Arbitrage grid timeout.");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => { scanArbitrage(); }, []);

  return (
    <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16">
        <div>
          <h2 className="text-[14px] font-black text-indigo-500 tracking-[0.8em] uppercase mb-4 italic">Zero-Inventory Arbitrage Grid</h2>
          <h1 className="text-6xl md:text-[10rem] font-black text-white italic tracking-tighter uppercase leading-[0.7]">ALPHA <span className="text-indigo-500">NODES</span></h1>
        </div>
        <button 
          onClick={scanArbitrage}
          disabled={isScanning}
          className="px-12 py-8 bg-cyan-500/10 border border-cyan-500/30 rounded-[40px] text-[14px] font-black uppercase tracking-[0.4em] hover:bg-cyan-500/20 transition-all flex items-center gap-6 shadow-3xl text-cyan-400 group active:scale-95"
        >
          <i className={`fa-solid fa-radar text-2xl ${isScanning ? 'animate-pulse' : ''}`}></i>
          {isScanning ? 'PROBING...' : 'SCAN DELTA'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {nodes.map((node, i) => (
          <div key={`${node.id}-${i}`} className="iphone-card rounded-[60px] p-10 flex flex-col justify-between group hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden shadow-3xl border-white/5 bg-black/50 min-h-[600px]">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <i className="fa-solid fa-link-slash text-[10rem]"></i>
             </div>
             
             <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-[12px] font-black text-indigo-500 uppercase tracking-widest italic mb-1">Route: {node.supplierNode} ➔ {node.buyerNode}</span>
                      <span className="text-[10px] text-slate-600 font-mono tracking-tighter uppercase">{node.status} • ALLOC: {node.allocation}</span>
                   </div>
                   <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase tracking-widest">Risk: {node.riskScore}</span>
                </div>
                
                <div>
                   <h3 className="text-3xl font-black text-white italic uppercase mb-2 tracking-tighter group-hover:text-indigo-400 transition-colors leading-[0.9]">{node.commodity}</h3>
                   <div className="flex items-center gap-3">
                      <div className="h-0.5 w-10 bg-indigo-500/30"></div>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] italic">ROI Velocity: {node.roi}</p>
                   </div>
                </div>

                <div className="p-6 bg-black/80 rounded-[35px] border border-white/5 space-y-6">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <div>
                        <p className="text-[9px] text-slate-600 uppercase font-black mb-1 italic">Wholesale Buy</p>
                        <p className="text-2xl font-black text-white italic tracking-tighter leading-none">${node.buyPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase font-black mb-1 italic">Corporate Sell</p>
                        <p className="text-2xl font-black text-cyan-500 italic tracking-tighter leading-none">${node.sellPrice.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="flex justify-between items-center px-2">
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Middleman Delta</p>
                      <p className="text-xl font-black text-emerald-400">+$ {node.delta.toLocaleString()}</p>
                   </div>
                </div>
             </div>

             <div className="pt-8 relative z-10">
                <button className="w-full px-10 py-5 bg-indigo-600 text-white rounded-[30px] text-[11px] font-black uppercase tracking-[0.3em] italic hover:bg-indigo-500 shadow-3xl transition-all active:scale-95">
                   EXECUTE ALLOCATION ROUTE
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
