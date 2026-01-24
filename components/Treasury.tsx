
import React, { useState, useMemo } from 'react';
import { gemini } from '../services/gemini';
import { DepositRecord } from '../types';

interface TreasuryProps {
  balance: number;
  deposits: DepositRecord[];
  preferredRail: 'bank' | 'cashapp';
  onRailChange: (rail: 'bank' | 'cashapp') => void;
}

const Treasury: React.FC<TreasuryProps> = ({ balance, deposits, preferredRail, onRailChange }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'escrow' | 'radar'>('vault');
  const [isScanning, setIsScanning] = useState(false);
  const [radarReport, setRadarReport] = useState('');
  const [radarSources, setRadarSources] = useState<string[]>([]);

  const runRadarScan = async () => {
    setIsScanning(true);
    try {
      const data = await gemini.scanFintechNodes();
      setRadarReport(data.text);
      setRadarSources(data.sources);
    } catch (e) {
      setRadarReport("Fintech Node Link Error.");
    } finally {
      setIsScanning(false);
    }
  };

  const wealthVelocity = useMemo(() => (balance * 0.28).toLocaleString(), [balance]);

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="flex gap-6 border-b border-white/5 pb-10 overflow-x-auto scrollbar-hide">
        {[
          { id: 'vault', label: 'SIPHON VAULT', icon: 'fa-vault' },
          { id: 'escrow', label: 'APEX ESCROW', icon: 'fa-shield-halved' },
          { id: 'radar', label: 'LIQUIDITY RADAR', icon: 'fa-radar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40' : 'text-slate-600 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-4`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'vault' && (
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/10 pb-12 gap-10">
            <div>
              <h2 className="text-[16px] font-black text-indigo-400 uppercase tracking-[1em] mb-4 italic leading-none animate-pulse">Middleman Settlement Enclave</h2>
              <h1 className="text-6xl md:text-[10rem] font-black text-white italic tracking-tighter uppercase leading-[0.7]">
                WEALTH <span className="text-indigo-500">SIPHON</span>
              </h1>
            </div>
            <div className="text-right">
               <p className="text-[11px] text-indigo-400 font-black uppercase tracking-widest italic">ISO-20022 Compliance: ACTIVE</p>
               <div className="mt-4 px-8 py-3 bg-black/40 border border-indigo-500/20 rounded-full text-[12px] text-emerald-400 font-black italic uppercase">
                  Velocity: +$ {wealthVelocity} / hr
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
             <div className="lg:col-span-2">
                <div className="iphone-card rounded-[80px] p-20 md:p-32 relative overflow-hidden bg-black/80 shadow-3xl border-white/5">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                   <p className="text-base text-slate-500 font-black uppercase tracking-[1.5em] mb-12 italic">Middleman Capital Pool</p>
                   <div className="flex items-start mb-20">
                      <span className="text-6xl md:text-9xl font-black text-indigo-500/30 mt-8 mr-8 italic">$</span>
                      <h3 className="text-7xl md:text-[14rem] font-black text-white italic tracking-tighter leading-[0.8]">
                         {balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </h3>
                   </div>
                   <div className="flex justify-between items-center pt-10 border-t border-white/5">
                      <span className="text-[12px] text-slate-700 font-black uppercase italic tracking-widest">Alpha Status: UNLOCKED</span>
                      <div className="flex gap-4">
                         <i className="fa-solid fa-globe text-indigo-500/30 text-4xl"></i>
                         <i className="fa-solid fa-satellite text-indigo-500/30 text-4xl"></i>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="iphone-card rounded-[50px] p-10 bg-black/60 shadow-xl border-white/5">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-6 mb-8">Settlement Rails</h4>
                   <div className="space-y-4">
                      <button 
                        onClick={() => onRailChange('bank')}
                        className={`w-full p-8 rounded-[40px] border transition-all text-left group ${preferredRail === 'bank' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/5 text-slate-600 hover:border-white/20'}`}
                      >
                         <p className="text-[9px] uppercase font-black mb-1 group-hover:text-white">Tier-1 Institutional</p>
                         <p className="text-2xl font-black italic uppercase tracking-tighter">Heritage Fed</p>
                      </button>
                      <button 
                        onClick={() => onRailChange('cashapp')}
                        className={`w-full p-8 rounded-[40px] border transition-all text-left group ${preferredRail === 'cashapp' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-white/5 text-slate-600 hover:border-white/20'}`}
                      >
                         <p className="text-[9px] uppercase font-black mb-1 group-hover:text-white">T+0 High Velocity</p>
                         <p className="text-2xl font-black italic uppercase tracking-tighter">Sutton Bank</p>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'radar' && (
        <div className="space-y-16 animate-in slide-in-from-right-10 duration-500 pb-20">
           <div className="iphone-card rounded-[85px] p-20 bg-indigo-500/5 border border-indigo-500/20 shadow-3xl flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="scanner-line"></div>
              <div className="relative z-10">
                 <h2 className="text-5xl md:text-8xl font-black italic uppercase text-white tracking-tighter mb-4 leading-none">Liquidity <span className="text-indigo-500">Radar</span></h2>
                 <p className="text-[14px] text-slate-500 uppercase font-black tracking-widest italic opacity-80 max-w-xl">Scanning global fintech nodes for Fortune 500 middleman settlement deltas via Google Search grounding.</p>
              </div>
              <button 
                onClick={runRadarScan}
                disabled={isScanning}
                className="px-20 py-10 bg-indigo-600 text-white rounded-[50px] font-black uppercase tracking-[0.4em] text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10 whitespace-nowrap"
              >
                {isScanning ? <i className="fa-solid fa-atom animate-spin mr-4"></i> : <i className="fa-solid fa-radar mr-4"></i>}
                {isScanning ? 'PROBING...' : 'INITIATE RADAR'}
              </button>
           </div>
           {radarReport && (
             <div className="iphone-card rounded-[85px] p-24 font-mono text-xl leading-relaxed text-indigo-50/90 shadow-3xl bg-black/95 border-white/5 relative">
                <div className="prose prose-invert prose-2xl max-w-none text-slate-300 font-mono text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: radarReport.replace(/\n/g, '<br/>') }} />
                {radarSources.length > 0 && (
                   <div className="mt-20 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {radarSources.map((src, i) => (
                        <a key={i} href={src} target="_blank" className="p-6 bg-white/5 rounded-[35px] text-[10px] text-indigo-400 hover:text-white border border-white/5 truncate transition-all italic font-black shadow-inner">
                           <i className="fa-solid fa-link mr-4 opacity-30"></i> {src}
                        </a>
                      ))}
                   </div>
                )}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Treasury;
