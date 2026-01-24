
import React, { useState, useEffect } from 'react';
import { gemini } from '../services/gemini';
import { FinancialForecast, RiskAssessment, AgingReport } from '../types';

const FinancialAnalytics: React.FC<{ balance: number }> = ({ balance }) => {
  const [forecasts, setForecasts] = useState<FinancialForecast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [riskQuery, setRiskQuery] = useState('');
  const [riskResult, setRiskResult] = useState<RiskAssessment | null>(null);
  const [aging, setAging] = useState<AgingReport>({
    current: balance * 0.6,
    thirtyDays: balance * 0.2,
    sixtyDays: balance * 0.1,
    ninetyDaysPlus: balance * 0.1
  });

  const fetchForecast = async () => {
    setIsLoading(true);
    try {
      const data = await gemini.getFinancialForecast(balance, [
        { period: 'Last-30', inflow: balance * 0.4, outflow: balance * 0.1 }
      ]);
      setForecasts(data);
    } catch (e) {
      console.error("Forecasting node disrupted.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkRisk = async () => {
    if (!riskQuery) return;
    setIsLoading(true);
    try {
      const data = await gemini.assessCounterpartyRisk(riskQuery);
      setRiskResult(data);
    } catch (e) {
      console.error("Risk node timeout.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchForecast(); }, [balance]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-cyan-500 tracking-[0.5em] uppercase mb-1 italic">Neural Liquidity Forecasting</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">LIQUIDITY <span className="text-cyan-500">INTEL</span></h1>
        </div>
        <button 
          onClick={fetchForecast}
          className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 font-black uppercase tracking-widest text-[10px] hover:bg-cyan-500/20 transition-all"
        >
          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'RE-CALCULATE'}
        </button>
      </div>

      {/* Aging Matrix HRC Pattern */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Current', val: aging.current, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
           { label: '1-30 Days', val: aging.thirtyDays, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
           { label: '31-60 Days', val: aging.sixtyDays, color: 'text-amber-500', bg: 'bg-amber-500/5' },
           { label: '90+ Days', val: aging.ninetyDaysPlus, color: 'text-red-500', bg: 'bg-red-500/5' }
         ].map(bucket => (
           <div key={bucket.label} className={`iphone-card rounded-3xl p-8 border border-white/5 ${bucket.bg}`}>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4 italic">{bucket.label}</p>
              <p className={`text-2xl font-black italic tracking-tighter ${bucket.color}`}>${bucket.val.toLocaleString()}</p>
              <div className="w-full h-1 bg-black/40 rounded-full mt-6 overflow-hidden">
                <div className={`h-full ${bucket.color.replace('text', 'bg')}`} style={{ width: `${(bucket.val / balance) * 100}%` }}></div>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="iphone-card rounded-[50px] p-10 space-y-8 bg-black/60 shadow-3xl border-white/5">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-mega italic border-b border-white/10 pb-4">Predictive Cash Runway</h3>
          <div className="space-y-4">
            {forecasts.map((f, i) => (
              <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-black uppercase">{f.period}</span>
                  <span className="text-xl font-black text-white italic tracking-tight">Net Pos: +${f.netPosition.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-emerald-400 font-black uppercase">Alpha Conf: {Math.round(f.confidence * 100)}%</p>
                  <p className="text-[11px] text-slate-700 font-mono">Velo: ${f.inflow.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="iphone-card rounded-[50px] p-10 space-y-8 bg-black/60 shadow-3xl border-white/5 relative overflow-hidden">
          <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-mega italic border-b border-white/10 pb-4">Institutional Risk Node</h3>
          <div className="flex gap-4">
            <input 
              value={riskQuery}
              onChange={(e) => setRiskQuery(e.target.value)}
              placeholder="ENTITY SCAN..."
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-3 font-mono text-indigo-400 uppercase tracking-widest outline-none"
            />
            <button 
              onClick={checkRisk}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all shadow-xl"
            >
              SCAN
            </button>
          </div>

          {riskResult && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Solvency Shield</p>
                  <p className="text-3xl font-black text-white italic uppercase tracking-tighter">{riskResult.verdict}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 font-black uppercase">Sovereign Score</p>
                   <p className="text-3xl font-black text-indigo-400 italic">{riskResult.score}/100</p>
                </div>
              </div>
              <ul className="space-y-2">
                {riskResult.factors.map((f, i) => (
                  <li key={i} className="text-[11px] text-slate-400 font-mono uppercase flex items-center gap-3">
                    <i className="fa-solid fa-bolt-lightning text-indigo-500/40"></i>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
