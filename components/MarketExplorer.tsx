
import React from 'react';

const MarketExplorer: React.FC = () => {
  const globalTrends = [
    { name: 'GaN 240W Pro Charger', platform: 'Alibaba', delta: '420%', sentiment: 'Grok-98', millionaireScore: 94, tier: 'MICRO', range: '$12-$35', ship: 'Air-Express' },
    { name: 'Haptic Mechanical Deck', platform: 'Temu', delta: '310%', sentiment: 'Grok-82', millionaireScore: 79, tier: 'MID', range: '$65-$180', ship: 'Air-Express' },
    { name: 'Quantum-Safe USB Node', platform: 'Amazon B2B', delta: '580%', sentiment: 'Grok-99', millionaireScore: 99, tier: 'HIGH', range: '$220-$550', ship: 'Logistics-Nexus' },
    { name: 'Neural-Link HMD Glass', platform: 'Shein Alpha', delta: '720%', sentiment: 'Grok-92', millionaireScore: 96, tier: 'ULTRA', range: '$1200-$2500', ship: 'Logistics-Nexus' },
    { name: 'Sovereign Sourcing Rig', platform: 'Global B2B', delta: '190%', sentiment: 'Grok-74', millionaireScore: 82, tier: 'MACRO', range: '$3500-$5000', ship: 'Sea-Freight' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic">Multi-Tier Arbitrage & Distribution</h2>
          <h1 className="text-5xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">GLOBAL <span className="text-indigo-500">DELTA</span></h1>
        </div>
        <div className="flex flex-col items-end gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
           <span className="flex items-center gap-3 pr-6"><i className="fa-solid fa-bolt-lightning text-indigo-500 animate-pulse"></i> OPENAI-STRATEGY: SYNCED</span>
           <span className="flex items-center gap-3"><i className="fa-solid fa-radar text-magenta-500 animate-pulse"></i> GROK-SOCIAL: LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {globalTrends.map((trend, i) => (
          <div key={i} className="group iphone-card rounded-[40px] md:rounded-[55px] p-10 md:p-14 flex flex-col justify-between hover:bg-indigo-600/5 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden shadow-2xl active:scale-98">
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px] group-hover:bg-indigo-500/15 transition-all"></div>
            
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                   <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] italic">{trend.platform} Pulse</span>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{trend.range} | {trend.ship}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">{trend.delta}</p>
                  <p className="text-[10px] text-indigo-500/60 font-black uppercase tracking-widest italic">ROI ALPHA</p>
                </div>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase mb-12 leading-tight group-hover:text-indigo-400 transition-colors tracking-tighter">{trend.name}</h3>
            </div>

            <div className="flex items-end justify-between pt-10 border-t border-white/5">
              <div className="space-y-6 flex-1">
                <div className="flex flex-wrap gap-4">
                  <div className="px-5 py-2 bg-white/5 rounded-full text-[9px] font-black text-slate-400 tracking-widest uppercase italic border border-white/5">
                    {trend.sentiment} GROK-PULSE
                  </div>
                  <div className="px-5 py-2 bg-indigo-500/10 rounded-full text-[9px] font-black text-indigo-500 tracking-widest uppercase italic border border-indigo-500/20">
                    {trend.tier} SCALE
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex-1 max-w-[180px] h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div className="h-full bg-gradient-to-r from-indigo-700 via-indigo-400 to-indigo-200 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]" style={{width: `${trend.millionaireScore}%`}}></div>
                   </div>
                   <span className="text-[10px] font-black text-indigo-500 tracking-widest italic">{trend.millionaireScore}% ALPHA SCORE</span>
                </div>
              </div>
              <button className="w-24 h-24 rounded-[40px] bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-[0_25px_50px_rgba(79,70,229,0.4)] hover:scale-110 transition-transform active:scale-95">
                <i className="fa-solid fa-truck-fast"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[50px] md:rounded-[100px] p-16 md:p-32 text-center relative overflow-hidden border-indigo-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/15 via-transparent to-blue-600/15"></div>
        <div className="max-w-4xl mx-auto space-y-10 md:space-y-16 relative z-10">
           <div className="inline-flex items-center gap-5 px-10 py-4 bg-slate-900/90 border border-indigo-500/20 rounded-full mb-6 shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
              <span className="text-[11px] text-slate-300 font-black uppercase tracking-[0.6em] italic">Tucker Inc: Multi-Tier Distribution Engine</span>
           </div>
           <h2 className="text-5xl md:text-[9rem] font-black italic uppercase text-white leading-none tracking-tighter">SOVEREIGN <br/> <span className="text-indigo-500">WEALTH</span></h2>
           <p className="text-slate-400 font-mono text-xs md:text-base leading-relaxed max-w-2xl mx-auto opacity-80 uppercase tracking-tight">
             Integrated OpenAI Strategy, Grok-Social Pulse, and IBM Global Logistics for Anthony John Tucker. 
             Optimized for multi-range scale and direct settlement to Heritage Federal Node 21605.
           </p>
           <div className="flex justify-center gap-8 pt-10">
             <button className="bg-indigo-600 text-white px-20 py-8 rounded-[45px] font-black uppercase tracking-[0.4em] text-sm md:text-base hover:bg-indigo-500 transition-all shadow-[0_30px_60px_rgba(79,70,229,0.5)] active:scale-95">
                IGNITE DISTRIBUTION SCAN
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketExplorer;
