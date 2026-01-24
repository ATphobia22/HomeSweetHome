
import React, { useState } from 'react';
import { gemini } from '../services/gemini';

const StructuredAlpha: React.FC = () => {
  const [initialLevel, setInitialLevel] = useState(1653.23);
  const [finalLevel, setFinalLevel] = useState(1850.00);
  const [ticker, setTicker] = useState('MXWO');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState('');

  const calculateReturn = () => {
    const triggerLevel = initialLevel * 0.75;
    const indexChange = (finalLevel - initialLevel) / initialLevel;
    
    if (finalLevel >= initialLevel) {
      // Leveraged Upside: $10 + ($10 * 150% * change), capped at $12.50
      const payout = 10 + (10 * 1.5 * indexChange);
      return Math.min(payout, 12.50);
    } else if (finalLevel >= triggerLevel) {
      // Absolute Return: $10 + ($10 * abs(change)), capped at $12.50
      return 10 + (10 * Math.abs(indexChange));
    } else {
      // Downside Scenario: $10 * performance factor (final / initial)
      return 10 * (finalLevel / initialLevel);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await gemini.analyzeStructuredAlpha(ticker, initialLevel, finalLevel);
      setReport(res);
    } catch (e) {
      setReport("Strategy node disrupted.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const payout = calculateReturn();

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 text-indigo-400">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 uppercase mb-2 italic tracking-[0.6em]">Structured Wealth Engineering v12.0</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">STRUCTURED <span className="text-indigo-500">ALPHA</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">MSCI World Linked Node</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="iphone-card rounded-[40px] p-8 space-y-6 bg-black/60 border-white/5 shadow-2xl">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Strategy Parameters</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[8px] text-slate-700 font-black uppercase">Asset Ticker</label>
                   <input 
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-mono text-white focus:outline-none focus:border-indigo-500/50 uppercase"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] text-slate-700 font-black uppercase">Initial Index Level</label>
                   <input 
                    type="number"
                    value={initialLevel}
                    onChange={(e) => setInitialLevel(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-mono text-white focus:outline-none"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] text-slate-700 font-black uppercase">Final/Current Level</label>
                   <input 
                    type="number"
                    value={finalLevel}
                    onChange={(e) => setFinalLevel(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-mono text-white focus:outline-none"
                   />
                </div>
                <button 
                  onClick={handleAnalyze}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
                >
                  RUN ALPHA ANALYSIS
                </button>
             </div>
          </div>

          <div className="iphone-card rounded-[40px] p-8 bg-indigo-500/5 border border-indigo-500/20 space-y-4">
             <p className="text-[9px] text-slate-500 font-black uppercase italic tracking-widest">Payout Matrix Projection</p>
             <p className="text-5xl font-black text-white italic tracking-tighter">${payout.toFixed(2)}</p>
             <p className="text-[8px] text-indigo-400 font-bold uppercase italic">per $10 investment unit</p>
             <div className="mt-4 w-full h-1 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 shadow-xl" style={{ width: `${Math.min(100, (payout / 12.50) * 100)}%` }}></div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="iphone-card rounded-[60px] p-10 md:p-16 min-h-[600px] relative overflow-hidden flex flex-col bg-black/80 shadow-3xl border-white/5">
             <div className="scanner-line opacity-20"></div>
             
             <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                {isAnalyzing ? (
                  <div className="h-full flex flex-col items-center justify-center gap-10 py-32 opacity-30">
                     <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                     <p className="text-indigo-400 font-black text-xl uppercase tracking-[0.8em] animate-pulse">Engineering Wealth Curves...</p>
                  </div>
                ) : report ? (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 font-mono text-sm leading-relaxed text-indigo-100/80 italic prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale select-none py-20 text-center">
                     <i className="fa-solid fa-chart-line-up text-[15rem] mb-10 text-indigo-500"></i>
                     <p className="uppercase tracking-[2em] font-black text-4xl italic ml-[2em]">Vault Idle</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructuredAlpha;
