
import React, { useState } from 'react';
import { gemini } from '../services/gemini';

interface TradingTerminalProps {
  onProfit: (amt: number) => void;
}

const TradingTerminal: React.FC<TradingTerminalProps> = ({ onProfit }) => {
  const [ticker, setTicker] = useState('NVDA');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [tradeActive, setTradeActive] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const data = await gemini.getDeepIntel(ticker);
      setAnalysis(data.text);
      setSources(data.sources);
    } catch (e) {
      setAnalysis("Intel link disrupted. Rerouting...");
    } finally {
      setIsLoading(false);
    }
  };

  const executeTrade = async () => {
    setTradeActive(true);
    await new Promise(r => setTimeout(r, 2000));
    const profit = (Math.random() * 2000) + 1000;
    onProfit(profit);
    setTradeActive(false);
    alert(`Sovereign Alpha Settled: $${profit.toLocaleString()} profit routed to Heritage Federal Node 21605.`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-700 pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-8">
        <div>
          <h2 className="text-xs font-black text-indigo-500 tracking-[0.5em] uppercase mb-2">Neural Market Predictor</h2>
          <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">QUANTUM <span className="text-indigo-500">TRADER</span></h1>
          <p className="text-[10px] text-slate-500 mt-2 font-mono italic">STAMPED: {new Date().toLocaleString()}</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 flex gap-3 bg-black/40 p-2 rounded-2xl border border-indigo-500/20">
            <input 
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="bg-transparent px-4 py-3 font-mono text-indigo-400 focus:outline-none w-full md:w-32 text-xl font-black italic"
              placeholder="TICKER"
            />
            <button 
              onClick={fetchInsights}
              disabled={isLoading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
            >
              {isLoading ? 'SCANNING...' : 'SWEEP INTEL'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="iphone-card rounded-[40px] p-8 md:p-10 min-h-[500px] font-mono relative overflow-hidden flex flex-col shadow-2xl">
            {isLoading ? (
               <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                  <div className="w-24 h-24 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                  <p className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-[10px]">Orchestrating Strategic Intel Sweep...</p>
               </div>
            ) : analysis ? (
              <div className="relative z-10 space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-4">
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm prose prose-invert max-w-none">
                  {analysis}
                </div>
                {sources.length > 0 && (
                  <div className="pt-8 border-t border-white/5">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4 italic">Settlement Nodes:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {sources.map((src, i) => (
                        <a key={i} href={src} target="_blank" className="p-3 bg-black/40 rounded-xl text-[8px] text-slate-600 hover:text-indigo-400 border border-white/5 truncate transition-all">
                           {src}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 py-20">
                <i className="fa-solid fa-chart-line text-[10rem] mb-10 text-indigo-500"></i>
                <p className="uppercase tracking-[1em] font-black text-[10px] text-indigo-500">Awaiting Target Node Selection</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-10 rounded-[40px] bg-gradient-to-br from-indigo-600 to-indigo-950 text-white shadow-2xl">
            <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6 italic">Execute Alpha Cycle</h3>
            <div className="space-y-4">
              <button 
                onClick={executeTrade}
                disabled={tradeActive || !analysis}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all text-xs active:scale-95 ${
                  tradeActive ? 'bg-slate-800 text-slate-500' : 'bg-indigo-500 text-white hover:bg-indigo-400'
                }`}
              >
                {tradeActive ? 'EXECUTING...' : 'INITIALIZE SETTLEMENT'}
              </button>
            </div>
            <p className="text-[8px] text-indigo-300/40 mt-8 text-center leading-tight uppercase tracking-widest italic">
              Direct Route: Node 21605 (Heritage)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingTerminal;
