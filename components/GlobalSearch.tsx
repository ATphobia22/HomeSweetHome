
import React, { useState } from 'react';
import { gemini } from '../services/gemini';

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [intel, setIntel] = useState<{ text: string; sources: { web: { uri: string; title: string } }[] } | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setIntel(null);

    try {
      const result = await gemini.runGroundedSearch(query);
      setIntel(result);
    } catch (err) {
      console.error("Global search failure:", err);
      setIntel({ 
        text: "Intelligence sweep interrupted by quantum noise. The grounding rail is currently unstable. Please verify node connectivity.",
        sources: [] 
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic">Real-Time Grounding Engine v4.0</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">GLOBAL <span className="text-indigo-500">INTEL</span></h1>
        </div>
        <div className="flex flex-col items-end gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
           <span className="flex items-center gap-3 pr-6"><i className="fa-solid fa-earth-americas text-indigo-500 animate-pulse"></i> GROUNDING: ACTIVE</span>
           <span className="flex items-center gap-3"><i className="fa-solid fa-radar text-magenta-500 animate-pulse"></i> SEARCH TOOL: ENABLED</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <form onSubmit={handleSearch} className="relative group">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the global knowledge graph..."
            className="w-full bg-white/5 border border-white/10 rounded-[40px] px-10 py-8 text-xl md:text-2xl font-black italic text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-2xl"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {isSearching ? <i className="fa-solid fa-atom animate-spin text-xl"></i> : <i className="fa-solid fa-magnifying-glass text-xl"></i>}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <div className="iphone-card rounded-[60px] p-10 md:p-16 min-h-[600px] relative overflow-hidden flex flex-col bg-black/60 shadow-3xl border-white/5">
            <div className="scanner-line opacity-20"></div>
            
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
              {isSearching ? (
                <div className="h-full flex flex-col items-center justify-center space-y-12 py-20">
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                    <i className="fa-solid fa-globe absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-indigo-500 animate-pulse"></i>
                  </div>
                  <div className="text-center space-y-4">
                    <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse">Sweeping Global Nodes...</p>
                    <p className="text-slate-700 text-xs uppercase font-black tracking-widest italic">Grounding via Google Search Graph</p>
                  </div>
                </div>
              ) : intel ? (
                <div className="space-y-12 animate-in fade-in duration-700">
                  <div className="prose prose-invert prose-2xl max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-lg" 
                       dangerouslySetInnerHTML={{ __html: intel.text.replace(/\n/g, '<br/>') }} 
                  />
                  
                  {intel.sources.length > 0 && (
                    <div className="pt-16 border-t border-white/5">
                      <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-mega italic mb-10">Intelligence Provenance</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {intel.sources.map((src, i) => (
                          <a 
                            key={i} 
                            href={src.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-indigo-500/40 hover:bg-white/10 transition-all flex flex-col gap-2"
                          >
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest truncate">{src.web.title || 'Verified Source'}</span>
                            <span className="text-[10px] text-slate-600 font-mono truncate group-hover:text-slate-400 transition-colors">{src.web.uri}</span>
                            <i className="fa-solid fa-arrow-up-right-from-square absolute top-4 right-4 text-[10px] text-slate-800 group-hover:text-indigo-500 transition-colors"></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale select-none py-20 text-center">
                  <i className="fa-solid fa-satellite text-[15rem] mb-10 text-indigo-500"></i>
                  <p className="uppercase tracking-[2em] font-black text-4xl italic ml-[2em]">Uplink Idle</p>
                  <p className="mt-8 text-xl font-black uppercase tracking-widest italic opacity-50">Query the collective for real-time advantage.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="iphone-card rounded-[40px] p-8 bg-black/60 border border-indigo-500/10 shadow-xl">
            <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-mega mb-6 italic border-b border-white/10 pb-4 leading-none">Global Trending Intel</h4>
            <div className="space-y-4">
              {[
                "Quantum Networking",
                "Blackwell Production",
                "Global Logistics Delays",
                "AI Sovereign Nodes",
                "Arbitrage Benchmarks"
              ].map(topic => (
                <button 
                  key={topic} 
                  onClick={() => { setQuery(topic); handleSearch(); }}
                  className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all text-left"
                >
                  <span className="font-black italic text-[11px] text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest">{topic}</span>
                  <i className="fa-solid fa-arrow-right text-indigo-500/20 group-hover:text-indigo-500 text-[10px] transition-all"></i>
                </button>
              ))}
            </div>
          </div>

          <div className="p-10 rounded-[40px] bg-gradient-to-br from-indigo-600 to-indigo-950 text-white shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-all"></div>
            <div className="relative z-10">
              <h4 className="font-black uppercase text-[10px] tracking-[0.5em] mb-6 flex items-center gap-3 italic">
                <i className="fa-solid fa-bolt-lightning text-white animate-pulse"></i>
                Sovereign Power
              </h4>
              <p className="text-lg font-black mb-8 leading-tight italic tracking-tighter opacity-80">
                Grounding your strategy in real-world facts from the global web.
              </p>
              <div className="text-[9px] font-black uppercase tracking-widest text-indigo-300">
                Node 21605: Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
