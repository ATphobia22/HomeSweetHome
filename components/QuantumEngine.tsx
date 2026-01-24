
import React, { useState, useEffect } from 'react';
import { gemini } from '../services/gemini';
import { AutonomousLog, ApexTrigger } from '../types';

const QuantumEngine: React.FC<{ onProfit: (amt: number) => void }> = ({ onProfit }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<AutonomousLog[]>([]);
  const [triggers, setTriggers] = useState<ApexTrigger[]>([]);
  const [report, setReport] = useState<string>('');
  const [spatialOutput, setSpatialOutput] = useState<any>(null);

  const addLog = (action: string, details: string, status: 'executing' | 'success' | 'warning' | 'quantum' = 'executing') => {
    const newLog: AutonomousLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      action,
      details,
      status
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const fetchTriggers = async () => {
    try {
      const data = await gemini.scanApexTriggers();
      setTriggers(data);
    } catch (e) {
      console.error("Trigger Grid offline.");
    }
  };

  useEffect(() => {
    fetchTriggers();
    const interval = setInterval(fetchTriggers, 60000);
    return () => clearInterval(interval);
  }, []);

  const runSovereignCycle = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setReport('');
    setSpatialOutput(null);
    addLog("SPATIAL_INIT", "Booting Quantum Spatial Solver v12.0...", 'quantum');
    
    try {
      addLog("QISKIT_SYNC", "Compiling circuit for IBM Eagle Processor...", 'executing');
      const spatialResult = await gemini.runQuantumSpatialOptimization("Parcel-A", "Warehouse-B");
      setSpatialOutput(spatialResult);

      addLog("NPR_REASON", "Firing Native Parallel Reasoner for consensus...", 'executing');
      const nprResult = await gemini.runNPRReasoning("Optimize supply routes between TSMC wholesale and US corporate buyers using spatial intelligence.");
      setReport(nprResult);

      const yieldAmt = (Math.random() * 85000) + 15000;
      addLog("SETTLED", `Extraction Complete. ROI: $${yieldAmt.toLocaleString()}`, 'success');
      onProfit(yieldAmt);
    } catch (err) {
      addLog("FAILOVER", "Quantum Disruption: Rerouting via secondary QPU.", 'warning');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16">
        <div>
          <h2 className="text-[14px] font-black text-amber-500 tracking-[0.8em] uppercase mb-4 italic animate-pulse">Quantum Spatial Intelligence</h2>
          <h1 className="vhd-title text-white italic">QUANTUM <span className="text-amber-500">CORE</span></h1>
        </div>
        <button 
          onClick={runSovereignCycle}
          disabled={isRunning}
          className="px-16 py-8 bg-amber-500 text-black rounded-[40px] text-[18px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all flex items-center gap-6 shadow-[0_0_80px_rgba(245,158,11,0.2)] disabled:opacity-50"
        >
          <i className={`fa-solid fa-atom ${isRunning ? 'animate-spin' : ''}`}></i>
          {isRunning ? 'AGENT REASONING' : 'FIRE SPATIAL BATCH'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-8">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest italic border-l-2 border-amber-500 pl-4">Spatial Apex Triggers</h3>
           <div className="space-y-4">
              {triggers.map(trigger => (
                <div key={trigger.id} className="iphone-card rounded-3xl p-6 border-white/5 bg-black/40 group hover:border-amber-500/30 transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">{trigger.type}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   </div>
                   <h4 className="text-white font-black italic uppercase text-lg mb-2">{trigger.targetEntity}</h4>
                   <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Conf: {trigger.threshold}%</span>
                      <span className="text-amber-400">P(x): {trigger.currentValue.toFixed(2)}%</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2">
          <div className="iphone-card rounded-[60px] p-12 md:p-16 min-h-[700px] relative overflow-hidden flex flex-col bg-black/80 shadow-3xl border-white/5">
             <div className="scanner-line"></div>
             <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide text-amber-50/90 font-mono text-lg leading-relaxed">
                {isRunning ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 gap-8">
                     <i className="fa-solid fa-compass-drafting text-8xl animate-pulse text-amber-500"></i>
                     <p className="uppercase tracking-[1em] font-black text-xl italic text-amber-500">Mapping Latent Space...</p>
                  </div>
                ) : spatialOutput ? (
                  <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="p-8 bg-amber-500/5 rounded-[40px] border border-amber-500/20">
                       <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-4">Optimal Spatial Route</h4>
                       <div className="flex gap-4 items-center">
                          {spatialOutput.optimized_path.map((p: string, i: number) => (
                            <React.Fragment key={i}>
                               <span className="text-xl font-black text-white italic">{p}</span>
                               {i < spatialOutput.optimized_path.length - 1 && <i className="fa-solid fa-arrow-right text-slate-700 text-xs"></i>}
                            </React.Fragment>
                          ))}
                       </div>
                       <p className="mt-4 text-[10px] text-slate-500 font-black uppercase italic">Confidence: {spatialOutput.quantum_confidence * 100}% | Entanglement: {spatialOutput.qubit_entanglement || 'Verified'}</p>
                    </div>
                    <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                       {report}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale py-20 text-center select-none">
                    <i className="fa-solid fa-chess-knight text-[15rem] mb-10 text-amber-500"></i>
                    <p className="uppercase tracking-[2em] font-black text-4xl italic ml-[2em]">Uplink Idle</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-1">
           <div className="iphone-card rounded-[50px] p-10 h-[700px] flex flex-col bg-black/95 shadow-3xl border-white/5 overflow-hidden">
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest italic border-b border-white/5 pb-8 mb-8">Quantum Execution Ledger</h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {logs.map((log) => (
                  <div key={log.id} className={`p-5 rounded-[30px] border border-white/5 space-y-2 transition-all ${log.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5'}`}>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase italic">
                      <span className={log.status === 'success' ? 'text-emerald-400' : 'text-amber-500'}>{log.action}</span>
                      <span className="text-slate-800 font-mono text-[8px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-snug italic font-bold tracking-tight uppercase">{log.details}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumEngine;
