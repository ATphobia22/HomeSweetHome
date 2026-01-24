
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/gemini';

const NPRLaunch: React.FC = () => {
  const [phase, setPhase] = useState<'BOOT' | 'RUNNING' | 'CONSENSUS'>('BOOT');
  const [logs, setLogs] = useState<string[]>([]);
  const [reasoningChain, setReasoningChain] = useState<string[]>([]);
  const [tokenCount, setTokenCount] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Bootstrapping
      const bootLogs = [
        "NPR-4B :: INITIALIZING KERNEL...",
        "LOADING DATASET: orz-math [PARQUET_STREAM]",
        "ALLOCATING 12GB VRAM ON NODE-21605...",
        "MOUNTING FLASH-ATTENTION V2 KERNELS...",
        "ESTABLISHING QUANTUM ENTANGLEMENT BRIDGE...",
        "AUTH VERIFIED: ANTHONY J. TUCKER",
        "READY FOR IGNITION."
      ];
      
      for (const log of bootLogs) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
        await new Promise(r => setTimeout(r, 400));
      }

      setPhase('RUNNING');

      // Phase 2: Reasoning (Simulated streaming)
      try {
        const streamRequest = "Simulate a step-by-step mathematical reasoning trace for a complex calculus problem from the 'orz-math' dataset. Start each step with '[STEP X]'. Finalize with '[CONSENSUS]' and a numerical answer. Keep it very technical and dense.";
        const result = await gemini.runNPRReasoning(streamRequest);
        
        const lines = result.split('\n').filter(l => l.trim().length > 0);
        for (const line of lines) {
          setReasoningChain(prev => [...prev, line]);
          setTokenCount(c => c + Math.floor(Math.random() * 50) + 10);
          await new Promise(r => setTimeout(r, 800));
        }

        setPhase('CONSENSUS');
      } catch (e) {
        setLogs(prev => [...prev, "!! CORE EXCEPTION: DISRUPTION IN NEURAL BRIDGE !!"]);
      }
    };

    sequence();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, reasoningChain]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] text-indigo-400 font-mono p-6 md:p-12 flex flex-col gap-8 animate-in fade-in duration-1000">
      <div className="flex justify-between items-start border-b border-indigo-500/20 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
             <h2 className="text-[10px] font-black uppercase tracking-[0.5em] italic">Native Parallel Reasoner :: Live Execution</h2>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            NPR-4B <span className="text-indigo-500">IGNITION</span>
          </h1>
        </div>
        <div className="text-right space-y-1">
           <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none">Architecture: Llama-SGLang-Hybrid</p>
           <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none">Hardware: DGX-Blackwell-01</p>
           <div className="pt-2">
              <span className="px-3 py-1 bg-indigo-500/10 rounded border border-indigo-500/20 text-[10px] font-black text-indigo-500 italic">
                TOKENS: {tokenCount.toLocaleString()}
              </span>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        <div className="lg:col-span-1 iphone-card rounded-[40px] bg-black/40 p-8 border-white/5 flex flex-col overflow-hidden">
           <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 italic border-b border-white/5 pb-4">System Telemetry</h3>
           <div className="flex-1 overflow-y-auto pr-4 space-y-3 text-[10px] scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className="leading-tight opacity-60 hover:opacity-100 transition-opacity">
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
           </div>
           {phase === 'RUNNING' && (
             <div className="mt-6 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 flex items-center justify-center gap-4">
                <i className="fa-solid fa-atom animate-spin text-indigo-500"></i>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Processing Latent Weights</span>
             </div>
           )}
        </div>

        <div className="lg:col-span-2 iphone-card rounded-[50px] bg-black/80 p-10 md:p-16 border-indigo-500/10 shadow-3xl relative overflow-hidden flex flex-col">
           <div className="scanner-line opacity-10"></div>
           <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Reasoning Chain :: orz-math</span>
              <div className="flex gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${phase === 'RUNNING' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'}`}></div>
                 <div className={`w-1.5 h-1.5 rounded-full ${phase === 'CONSENSUS' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-4 space-y-8 font-mono text-xs md:text-sm leading-relaxed text-indigo-50/70 scrollbar-hide">
              {reasoningChain.length > 0 ? (
                reasoningChain.map((line, i) => (
                  <div key={i} className={`p-6 rounded-3xl animate-in slide-in-from-left-4 duration-500 ${line.startsWith('[STEP') ? 'bg-white/5 border border-white/5' : line.startsWith('[CONSENSUS') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-lg' : ''}`}>
                    {line}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                   <i className="fa-solid fa-brain-circuit text-[10rem] mb-10"></i>
                   <p className="uppercase tracking-[2em] font-black text-xl italic ml-[2em]">Awaiting Output</p>
                </div>
              )}
              <div ref={logEndRef} />
           </div>
        </div>
      </div>

      <div className="flex justify-center gap-6">
         <button 
          onClick={() => window.location.reload()}
          className="px-16 py-6 bg-indigo-600 text-white rounded-[35px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:bg-indigo-500 transition-all active:scale-95"
         >
           {phase === 'CONSENSUS' ? 'TERMINATE & RETURN' : 'ABORT EXECUTION'}
         </button>
      </div>
    </div>
  );
};

export default NPRLaunch;
