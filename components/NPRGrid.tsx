
import React, { useState } from 'react';
import { gemini } from '../services/gemini';
import { ReasoningBranch } from '../types';

const NPRGrid: React.FC = () => {
  const [task, setTask] = useState('');
  const [isReasoning, setIsReasoning] = useState(false);
  const [consensus, setConsensus] = useState('');
  const [branches, setBranches] = useState<ReasoningBranch[]>([
    { id: 'A', label: 'Infrastructure Branch', status: 'merged', content: 'Awaiting ignition...' },
    { id: 'B', label: 'Environmental Branch', status: 'merged', content: 'Awaiting ignition...' },
    { id: 'C', label: 'Fiscal Branch', status: 'merged', content: 'Awaiting ignition...' }
  ]);

  const igniteReasoning = async () => {
    if (!task) return;
    setIsReasoning(true);
    setConsensus('');
    
    // Simulate MAP phase
    setBranches(prev => prev.map(b => ({ ...b, status: 'thinking', content: 'Decomposing latent variables...' })));
    await new Promise(r => setTimeout(r, 1500));

    // Simulate PROCESS phase
    setBranches(prev => prev.map(b => ({ ...b, content: `Executing parallel reasoning on ${b.label}...` })));
    
    try {
      const result = await gemini.runNPRReasoning(task);
      
      // Simulate REDUCE phase
      setBranches(prev => prev.map(b => ({ ...b, status: 'resolved', content: 'Logic branch concluded.' })));
      await new Promise(r => setTimeout(r, 1000));
      setConsensus(result);
      setBranches(prev => prev.map(b => ({ ...b, status: 'merged' })));
    } catch (err) {
      setConsensus("Consensus failed: Quantum interference detected.");
    } finally {
      setIsReasoning(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic">NPR v1.0 Native Parallel Reasoner</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">REASONING <span className="text-indigo-500">GRID</span></h1>
        </div>
        <div className="w-full md:w-auto">
          <div className="flex gap-4 bg-white/5 p-3 rounded-[30px] border border-white/10 shadow-inner">
             <input 
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter Problem Statement..."
              className="bg-transparent px-6 py-3 font-mono text-sm text-indigo-400 focus:outline-none w-full md:w-80 uppercase italic font-bold"
             />
             <button 
              onClick={igniteReasoning}
              disabled={isReasoning || !task}
              className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
             >
               {isReasoning ? <i className="fa-solid fa-atom animate-spin"></i> : 'IGNITE'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-indigo-500/10 -translate-y-1/2 hidden lg:block"></div>
        
        {branches.map((branch) => (
          <div key={branch.id} className="iphone-card rounded-[50px] p-10 space-y-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-3xl bg-black/60 border-white/5 min-h-[400px]">
             <div className="scanner-line opacity-0 group-hover:opacity-100"></div>
             <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{branch.label}</span>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic ${
                  branch.status === 'thinking' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                  branch.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                  'bg-white/5 text-slate-700'
                }`}>
                  {branch.status}
                </span>
             </div>
             
             <div className="flex-1 font-mono text-sm text-slate-300 leading-relaxed italic">
                {branch.content}
             </div>

             <div className="pt-6 flex gap-4">
                <div className={`w-3 h-3 rounded-full ${branch.status === 'thinking' ? 'bg-amber-500 animate-ping' : 'bg-slate-800'}`}></div>
                <div className={`w-3 h-3 rounded-full ${branch.status === 'resolved' ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                <div className={`w-3 h-3 rounded-full ${branch.status === 'merged' ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
             </div>
          </div>
        ))}
      </div>

      <div className="iphone-card rounded-[60px] p-12 md:p-20 bg-black/80 shadow-3xl border-indigo-500/10 relative overflow-hidden">
         <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
            <h3 className="text-[12px] font-black text-indigo-500 uppercase tracking-mega italic leading-none">Single Truth Sovereign Consensus</h3>
            <span className="text-[10px] text-slate-700 font-mono italic">Teacher-Free Map-Process-Reduce Engine</span>
         </div>
         
         <div className="min-h-[200px] flex items-center justify-center">
            {isReasoning ? (
              <div className="flex flex-col items-center gap-6 opacity-30">
                 <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                 <p className="text-xs font-black uppercase tracking-[0.8em] text-indigo-500 ml-[0.8em]">Reducing Alpha...</p>
              </div>
            ) : consensus ? (
              <div className="text-center space-y-10 animate-in zoom-in-95 duration-700">
                 <p className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-tight uppercase max-w-5xl mx-auto">{consensus}</p>
                 <div className="flex justify-center gap-10">
                    <button className="px-12 py-5 bg-indigo-600 text-white rounded-[30px] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                       Accept Consensus
                    </button>
                    <button className="px-12 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-[30px] font-black uppercase tracking-widest text-[11px] hover:text-white transition-all">
                       Reroute Logic
                    </button>
                 </div>
              </div>
            ) : (
              <div className="text-center opacity-10 py-20 grayscale">
                 <i className="fa-solid fa-diagram-cells text-[8rem] mb-8"></i>
                 <p className="text-xs font-black uppercase tracking-[1.5em] italic ml-[1.5em]">Consensus Engine Idle</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default NPRGrid;
