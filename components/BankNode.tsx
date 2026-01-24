
import React, { useState, useMemo, useEffect } from 'react';
import { gemini } from '../services/gemini';
import { DepositRecord } from '../types';

interface BankNodeProps {
  balance: number;
  deposits: DepositRecord[];
  preferredRail: 'bank' | 'cashapp';
  onRailChange: (rail: 'bank' | 'cashapp') => void;
}

const BankNode: React.FC<BankNodeProps> = ({ balance, deposits, preferredRail, onRailChange }) => {
  const goal = 1000000;
  const progress = (balance / goal) * 100;
  
  const [activeTab, setActiveTab] = useState<'vault' | 'protocols' | 'scout'>('vault');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutReport, setScoutReport] = useState('');
  const [scoutSources, setScoutSources] = useState<string[]>([]);
  
  const performScout = async () => {
    setIsScouting(true);
    try {
      const data = await gemini.scanFintechNodes();
      setScoutReport(data.text);
      setScoutSources(data.sources);
    } catch (e) {
      setScoutReport("Fintech Node scan failure.");
    } finally {
      setIsScouting(false);
    }
  };

  const wealthVelocity = useMemo(() => (balance * 0.15).toLocaleString(), [balance]);

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      <div className="flex gap-6 border-b border-white/5 pb-10 overflow-x-auto scrollbar-hide">
        {[
          { id: 'vault', label: 'SIPHON VAULT', icon: 'fa-vault' },
          { id: 'protocols', label: 'ISO-20022 RAILS', icon: 'fa-shield-halved' },
          { id: 'scout', label: 'LIQUIDITY RADAR', icon: 'fa-radar' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-900/30' : 'text-slate-600 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-4`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'vault' && (
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-emerald-500/10 pb-12 gap-10">
            <div>
              <h2 className="text-[16px] font-black text-emerald-400 uppercase tracking-[1em] mb-4 italic leading-none animate-pulse">Middleman Settlement Enclave</h2>
              <h1 className="text-6xl md:text-[10rem] font-black text-white italic tracking-tighter uppercase leading-[0.7]">
                WEALTH <span className="text-emerald-500">SIPHON</span>
              </h1>
            </div>
            <div className="text-right space-y-2">
               <p className="text-[11px] text-emerald-500 font-black uppercase tracking-widest italic">Auth: Anthony Tucker [Node 21605]</p>
               <div className="px-6 py-2 bg-black/40 border border-emerald-500/20 rounded-full text-[10px] text-slate-500 font-black italic uppercase">
                  Velocity: +$ {wealthVelocity} / hr
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <div className="iphone-card rounded-[80px] p-20 md:p-32 relative overflow-hidden bg-black/80 shadow-3xl">
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -mr-60 -mt-60"></div>
                 <div className="relative z-10">
                    <p className="text-base text-slate-500 font-black uppercase tracking-[1.5em] mb-12 italic">Liquid Middleman Profit</p>
                    <div className="flex items-start mb-20">
                       <span className="text-6xl md:text-9xl font-black text-emerald-500/30 mt-8 mr-8 italic">$</span>
                       <h3 className="text-7xl md:text-[14rem] font-black text-white italic tracking-tighter leading-[0.8]">
                          {balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                       </h3>
                    </div>
                    <div className="space-y-8">
                       <div className="flex justify-between items-end text-lg font-black uppercase tracking-[0.8em] italic">
                          <span className="text-slate-700">Alpha Velocity (DSO 0.1)</span>
                          <span className="text-emerald-400 text-4xl">{progress.toFixed(2)}% ROI</span>
                       </div>
                       <div className="w-full h-6 bg-black/90 rounded-full overflow-hidden border border-white/5 p-1.5 shadow-inner">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_40px_rgba(16,185,129,0.5)]" style={{width: `${progress}%`}}></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-12">
               <div className="iphone-card rounded-[60px] p-16 bg-emerald-950/10 border border-emerald-500/10 shadow-3xl relative overflow-hidden">
                  <p className="text-[11px] text-emerald-400 font-black uppercase tracking-[0.6em] mb-12 italic">Settlement Rail Status</p>
                  <div className="space-y-8">
                     <div className="p-10 bg-black/70 rounded-[45px] border border-white/5 shadow-inner">
                        <p className="text-[11px] text-slate-600 font-black uppercase mb-3 italic">Preferred Bank Node</p>
                        <p className="text-3xl font-black italic tracking-tighter text-white uppercase">{preferredRail === 'bank' ? 'Heritage Fed' : 'Sutton Bank'}</p>
                     </div>
                     <div className="p-10 bg-black/70 rounded-[45px] border border-white/5 shadow-inner">
                        <p className="text-[11px] text-slate-600 font-black uppercase mb-3 italic">Arbitrage Liquidity Status</p>
                        <p className="text-3xl font-black italic tracking-tighter text-emerald-500 uppercase">100% FLUID</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scout' && (
        <div className="space-y-16 animate-in slide-in-from-left-10 duration-500 pb-20">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10 bg-emerald-500/5 p-20 rounded-[85px] border border-emerald-500/20 shadow-3xl relative overflow-hidden">
              <div className="scanner-line"></div>
              <div className="relative z-10">
                 <h2 className="text-5xl md:text-8xl font-black italic uppercase text-white tracking-tighter mb-4">Liquidity <span className="text-emerald-500">Radar</span></h2>
                 <p className="text-[14px] text-slate-500 uppercase font-black tracking-widest italic opacity-80">Scanning Sutton Bank rails for Fortune 500 middleman settlement deltas.</p>
              </div>
              <button 
                onClick={performScout}
                disabled={isScouting}
                className="px-20 py-10 bg-emerald-500 text-black rounded-[50px] font-black uppercase tracking-[0.4em] text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10"
              >
                {isScouting ? <i className="fa-solid fa-spinner animate-spin mr-4"></i> : <i className="fa-solid fa-radar mr-4"></i>}
                {isScouting ? 'SCANNING...' : 'INITIATE RADAR'}
              </button>
           </div>
           {scoutReport && (
             <div className="iphone-card rounded-[85px] p-24 font-mono text-xl leading-relaxed text-emerald-50/90 shadow-3xl bg-black/95">
                <div className="prose prose-invert prose-2xl max-w-none text-slate-300 font-mono text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: scoutReport.replace(/\n/g, '<br/>') }} />
                {scoutSources.length > 0 && (
                   <div className="mt-16 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {scoutSources.map((src, i) => (
                        <a key={i} href={src} target="_blank" className="p-6 bg-white/5 rounded-[35px] text-[11px] text-emerald-400 hover:text-white border border-white/5 truncate transition-all italic font-black">
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

export default BankNode;
