
import React from 'react';

const AdapterHub: React.FC = () => {
  const adapters = [
    { name: 'Gemini 3 Pro', type: 'LLM', status: 'Primary', latency: '240ms', color: 'text-cyan-500', icon: 'fa-brain' },
    { name: 'Groq (Llama 3.3)', type: 'LLM', status: 'Fast-Chat', latency: '42ms', color: 'text-fuchsia-500', icon: 'fa-bolt-lightning' },
    { name: 'OpenAI strategy', type: 'LLM', status: 'Analysis', latency: '1200ms', color: 'text-blue-500', icon: 'fa-chess-knight' },
    { name: 'IBM Quantum', type: 'QPU', status: 'Eagle v3', latency: 'T+0', color: 'text-amber-500', icon: 'fa-atom' },
    { name: 'IonQ Aria', type: 'QPU', status: 'Optimization', latency: 'Cloud', color: 'text-indigo-500', icon: 'fa-microchip' },
    { name: 'Heritage Fed Node', type: 'FINTECH', status: 'Settlement', latency: 'Instant', color: 'text-emerald-500', icon: 'fa-vault' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 uppercase mb-2 italic tracking-[0.6em]">Heterogeneous Compute Orchestration</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">ADAPTER <span className="text-indigo-500">HUB</span></h1>
        </div>
        <div className="flex items-center gap-4 px-6 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/10 shadow-inner">
           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic">Sovereign Registry Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adapters.map((adapter, i) => (
          <div key={i} className="iphone-card rounded-[50px] p-10 space-y-8 relative overflow-hidden group hover:bg-white/5 transition-all shadow-3xl border-white/5 bg-black/60">
             <div className="flex justify-between items-start">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${adapter.color} text-3xl shadow-inner border border-white/5 group-hover:border-indigo-500/30 transition-all`}>
                   <i className={`fa-solid ${adapter.icon}`}></i>
                </div>
                <div className="text-right">
                   <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${adapter.color.replace('text', 'bg')}/10 ${adapter.color.replace('text', 'border')}/20`}>
                      {adapter.type}
                   </span>
                </div>
             </div>

             <div className="space-y-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{adapter.name}</h3>
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic">{adapter.status} Node Active</p>
             </div>

             <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase italic tracking-widest">
                <span className="text-slate-700">Latency Node</span>
                <span className={adapter.color}>{adapter.latency}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="iphone-card rounded-[60px] p-12 bg-indigo-600/5 border border-indigo-500/10 relative overflow-hidden">
         <div className="scanner-line opacity-20"></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center md:text-left space-y-4">
               <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">Unified Siphon Bridge</h4>
               <p className="text-xs text-slate-500 font-mono leading-relaxed max-w-xl uppercase italic">
                 Distributing reasoning branches across parallel logic providers. Automated failover to IBM Quantum for consensus optimization in orz-math and orz-logic datasets.
               </p>
            </div>
            <button className="px-12 py-5 bg-indigo-600 text-white rounded-[35px] font-black uppercase tracking-widest text-[12px] shadow-2xl hover:bg-indigo-500 transition-all active:scale-95">
               RESYNC CLUSTER
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdapterHub;
