
import React from 'react';
import { WorkflowRun } from '../types';

interface ProcessSheetProps {
  run: WorkflowRun;
  onClose: () => void;
}

const ProcessSheet: React.FC<ProcessSheetProps> = ({ run, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="w-full max-w-3xl bg-[#020617] border border-indigo-500/20 rounded-[75px] overflow-hidden flex flex-col shadow-[0_0_150px_rgba(79,70,229,0.15)] max-h-[95vh] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        
        <div className="p-12 md:p-16 border-b border-white/5 flex justify-between items-center bg-black/60">
          <div className="space-y-2">
            <h2 className="text-indigo-500 font-black text-[12px] tracking-[0.8em] uppercase italic leading-none">Orchestrator Cycle Active</h2>
            <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{run.workflowKey} <span className="text-indigo-400 opacity-30">|</span> <span className={`${run.status === 'COMPLETED' ? 'text-emerald-500' : 'text-indigo-400'} animate-pulse`}>{run.status}</span></h3>
          </div>
          <button 
            onClick={onClose}
            className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:scale-110 transition-all shadow-xl"
          >
            <i className="fa-solid fa-xmark text-3xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 md:p-16 space-y-12 scrollbar-hide">
          {run.steps.map((step, i) => (
            <div key={step.id} className={`flex gap-10 relative ${i !== run.steps.length - 1 ? 'pb-12' : ''}`}>
              {i !== run.steps.length - 1 && (
                <div className={`absolute top-16 left-8 w-[2px] h-[calc(100%-64px)] ${step.status === 'DONE' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-white/5'}`}></div>
              )}
              
              <div className={`w-16 h-16 rounded-full shrink-0 flex items-center justify-center border-4 transition-all duration-700 ${
                step.status === 'DONE' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.3)]' :
                step.status === 'RUNNING' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.3)]' :
                'bg-white/5 border-white/10 text-slate-800 opacity-20'
              }`}>
                {step.status === 'DONE' ? <i className="fa-solid fa-check text-xl"></i> : <span className="font-black text-xl">{i + 1}</span>}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className={`text-2xl font-black uppercase italic tracking-tight ${step.status === 'PENDING' ? 'text-slate-900' : 'text-white'}`}>
                    {step.name}
                  </h4>
                  {step.status === 'RUNNING' && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse italic">Neural Sync...</span>}
                </div>
                <p className="text-[13px] text-slate-500 font-black italic uppercase leading-relaxed tracking-tight">
                  {step.summary}
                </p>
                {step.logs && step.logs.length > 0 && (
                  <div className="mt-8 p-8 bg-black/90 rounded-[40px] border border-white/5 font-mono text-[11px] text-indigo-400/80 space-y-2 shadow-inner group">
                    <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-2">Technical Execution Log</p>
                    {step.logs.map((log, li) => (
                      <p key={li} className="flex gap-4">
                        <span className="text-slate-800 opacity-50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className="leading-tight">{log}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-12 md:p-16 bg-black/60 border-t border-white/5 flex gap-8">
           {run.status === 'COMPLETED' ? (
             <button 
               onClick={onClose}
               className="w-full py-8 bg-indigo-600 text-white rounded-[40px] font-black uppercase tracking-[0.5em] text-sm hover:bg-indigo-500 transition-all shadow-[0_30px_60px_rgba(79,70,229,0.4)] active:scale-95"
             >
               DISMISS & SETTLE
             </button>
           ) : (
             <div className="w-full flex flex-col items-center justify-center py-6 gap-6">
               <div className="flex items-center gap-5 text-indigo-400 font-black uppercase tracking-[1em] text-[11px] italic">
                 <i className="fa-solid fa-atom animate-spin"></i>
                 Processing Alpha
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 animate-[loading_2s_infinite]"></div>
               </div>
             </div>
           )}
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProcessSheet;
