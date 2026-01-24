
import React, { useState, useEffect } from 'react';
import { gemini } from '../services/gemini';

interface MarketIntelProps {
  onProfit: (amt: number) => void;
}

const MarketIntel: React.FC<MarketIntelProps> = ({ onProfit }) => {
  const [intel, setIntel] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [sources, setSources] = useState<string[]>([]);

  const performScan = async () => {
    setIsScanning(true);
    setIntel('');
    try {
      const data = await gemini.performInstitutionalMegaScan();
      setIntel(data.text);
      setSources(data.sources);
    } catch (e) {
      setIntel("Neural link failure. Attempting Anycast failover...");
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => { performScan(); }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end border-b border-indigo-500/10 pb-8">
        <div>
          <h2 className="text-sm font-black text-indigo-500 uppercase mb-2 tracking-[0.5em] italic">Institutional Siphon Pulse</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">ALPHA <span className="text-indigo-500">INTEL</span></h1>
        </div>
        <button 
          onClick={performScan}
          disabled={isScanning}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95 flex items-center gap-3"
        >
          {isScanning ? <i className="fa-solid fa-atom animate-spin"></i> : <i className="fa-solid fa-bolt-lightning"></i>}
          {isScanning ? 'SYNCING...' : 'SWEEP ALPHA'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="iphone-card rounded-[40px] p-10 min-h-[700px] relative overflow-hidden flex flex-col bg-black/60 shadow-2xl">
             <div className="scanner-line"></div>
             <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide font-mono text-sm md:text-lg leading-relaxed text-slate-200">
                {isScanning ? (
                  <div className="h-full flex flex-col items-center justify-center gap-10 py-32">
                     <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                     <div className="text-center space-y-4">
                        <p className="text-indigo-400 font-black text-xl uppercase tracking-[0.6em] animate-pulse">Sweeping Institutional Feeds...</p>
                        <p className="text-slate-700 text-xs uppercase font-black tracking-widest">Blackwell Adoption • Rigetti Moore's Law • ISO-20022 Protocols</p>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                     <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 flex justify-between items-center italic">
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Grounded Verdict: Sovereign Node 21605</span>
                        <div className="flex gap-4 opacity-30 text-2xl">
                           <i className="fa-brands fa-nvidia"></i>
                           <i className="fa-brands fa-microsoft"></i>
                        </div>
                     </div>
                     <div className="prose prose-invert prose-2xl max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: intel.replace(/\n/g, '<br/>') }} />
                     
                     {sources.length > 0 && (
                       <div className="mt-16 pt-10 border-t border-white/5 space-y-6">
                          <p className="text-[12px] text-slate-700 font-black uppercase italic tracking-[0.8em]">Verified Citation Nodes:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {sources.map((src, i) => (
                               <a key={i} href={src} target="_blank" className="p-4 bg-white/5 rounded-2xl text-[10px] text-indigo-400 hover:text-white border border-white/5 truncate italic font-black hover:border-indigo-500/30 transition-all">
                                  <i className="fa-solid fa-link mr-3 opacity-30 text-xs"></i>
                                  {src}
                               </a>
                             ))}
                          </div>
                       </div>
                     )}
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="iphone-card rounded-[35px] p-8 bg-black/60 border border-indigo-500/10 shadow-xl">
              <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-mega mb-6 italic border-b border-white/10 pb-4">Active Siphon Channels</h4>
              <div className="space-y-3">
                 {['Financial Times', 'Reuters Alpha', 'TechCrunch Global', 'Geekwire Pro', 'Motley Fool Elite', 'Phys.org Nodes'].map(s => (
                   <div key={s} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                      <span className="font-black italic text-[11px] text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest">{s}</span>
                      <i className="fa-solid fa-circle-check text-emerald-500 text-[10px] opacity-40"></i>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="iphone-card rounded-[35px] p-8 bg-indigo-600/5 border border-indigo-600/20 text-center space-y-4 shadow-inner">
              <i className="fa-solid fa-vault text-indigo-500 text-5xl"></i>
              <p className="text-sm font-black text-white uppercase italic leading-tight tracking-widest">VAULT NODE 21605<br/>SETTLEMENT ACTIVE</p>
              <div className="h-px w-12 bg-indigo-500/20 mx-auto"></div>
              <p className="text-[9px] text-slate-700 font-mono tracking-tighter uppercase">STAMP: {new Date().toLocaleDateString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntel;
