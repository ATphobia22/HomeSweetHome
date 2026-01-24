
import React, { useState } from 'react';
import { gemini } from '../services/gemini';

const PatentArchitect: React.FC = () => {
  const [topic, setTopic] = useState('Method and System for AI-Driven B2B Arbitrage with Quantum Route Optimization');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draft, setDraft] = useState('');

  const handleDraft = async () => {
    if (!topic) return;
    setIsDrafting(true);
    setDraft('');
    try {
      // Use NPR reasoning to generate structured legal documentation
      const result = await gemini.runNPRReasoning(`Draft a USPTO-ready patent specification summary for: ${topic}. Include Abstract, Claims, and Technical Field.`);
      setDraft(result);
    } catch (e) {
      setDraft("Legal node disrupted. Failover initiated.");
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic">USPTO-Ready IP Generation Node</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">PATENT <span className="text-indigo-500">ARCHITECT</span></h1>
        </div>
        <button 
          onClick={handleDraft}
          disabled={isDrafting}
          className="px-10 py-4 bg-indigo-600 text-white rounded-[30px] font-black uppercase text-[12px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {isDrafting ? <i className="fa-solid fa-atom animate-spin mr-3"></i> : <i className="fa-solid fa-feather-pointed mr-3"></i>}
          DRAFT SPECIFICATION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
           <div className="iphone-card rounded-[40px] p-8 bg-black/60 border-white/5 space-y-8">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Dossier Params</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[8px] text-slate-700 font-black uppercase">Inventor</label>
                    <p className="text-xs font-black text-white uppercase italic">Anthony John Tucker</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] text-slate-700 font-black uppercase">Assignee</label>
                    <p className="text-xs font-black text-white uppercase italic">Tucker Incorporated 82</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] text-slate-700 font-black uppercase">Jurisdiction</label>
                    <p className="text-xs font-black text-white uppercase italic">US (USPTO)</p>
                 </div>
              </div>
           </div>
           <div className="iphone-card rounded-[40px] p-8 bg-indigo-500/5 border-indigo-500/20 text-center space-y-4">
              <i className="fa-solid fa-shield-check text-indigo-500 text-4xl"></i>
              <p className="text-[10px] text-slate-400 font-black uppercase leading-tight italic">IP-Shield Active<br/>Encrypted Storage Locked</p>
           </div>
        </div>

        <div className="lg:col-span-3">
          <div className="iphone-card rounded-[60px] p-10 md:p-16 bg-black/90 shadow-3xl border-white/5 relative overflow-hidden min-h-[700px] flex flex-col">
             <div className="scanner-line opacity-20"></div>
             
             <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide font-mono text-sm leading-relaxed text-indigo-100/80 italic">
                {isDrafting ? (
                  <div className="h-full flex flex-col items-center justify-center gap-10 py-32 opacity-30">
                     <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                     <p className="text-indigo-400 font-black text-xl uppercase tracking-[0.6em] animate-pulse">Drafting Intellectual Moat...</p>
                  </div>
                ) : draft ? (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="prose prose-invert max-w-none text-slate-300 font-mono text-base whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: draft.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale select-none py-20">
                     <i className="fa-solid fa-stamp text-[12rem] mb-10 text-indigo-500"></i>
                     <p className="uppercase tracking-[2em] font-black text-4xl italic ml-[2em]">Architect Idle</p>
                  </div>
                )}
             </div>

             {draft && (
               <div className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-6 relative z-10">
                  <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Copy Plaintext</button>
                  <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">Export PDF</button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentArchitect;
