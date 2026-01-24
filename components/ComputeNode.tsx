
import React, { useState } from 'react';
import { gemini } from '../services/gemini';
import { CodeExecutionPart } from '../types';

const ComputeNode: React.FC = () => {
  const [prompt, setPrompt] = useState('What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.');
  const [isComputing, setIsComputing] = useState(false);
  const [results, setResults] = useState<CodeExecutionPart[]>([]);

  const fireCompute = async () => {
    if (!prompt) return;
    setIsComputing(true);
    setResults([]);
    try {
      const data = await gemini.runComputationalReasoning(prompt);
      setResults(data);
    } catch (e) {
      console.error("Compute Node core meltdown.");
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic">Gemini Compute Sandbox v1.0</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">COMPUTE <span className="text-indigo-500">NODE</span></h1>
        </div>
        <div className="w-full md:w-auto">
          <div className="flex gap-4 bg-white/5 p-3 rounded-[30px] border border-white/10 shadow-inner">
             <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a mathematical or logic problem..."
              className="bg-transparent px-6 py-3 font-mono text-sm text-indigo-400 focus:outline-none w-full md:w-[500px] uppercase italic font-bold"
             />
             <button 
              onClick={fireCompute}
              disabled={isComputing || !prompt}
              className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
             >
               {isComputing ? <i className="fa-solid fa-atom animate-spin"></i> : 'EXECUTE'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="iphone-card rounded-[60px] p-10 md:p-16 bg-black/80 shadow-3xl border-white/5 relative overflow-hidden min-h-[600px]">
           <div className="scanner-line opacity-20"></div>
           
           <div className="flex justify-between items-start mb-12 border-b border-white/5 pb-8">
              <div>
                 <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic leading-none mb-2">Computational Trace</p>
                 <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Sovereign Execution Shell</h2>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest italic">Sandbox: Python 3.10</p>
                 <p className="text-xs text-slate-600 font-mono italic">Isolated Memory Node-21605</p>
              </div>
           </div>

           <div className="space-y-12">
             {isComputing ? (
               <div className="h-[400px] flex flex-col items-center justify-center gap-10 opacity-30">
                  <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <p className="text-indigo-400 font-black text-xl uppercase tracking-[0.8em] animate-pulse">Allocating Neural Resources...</p>
               </div>
             ) : results.length > 0 ? (
               results.map((part, i) => (
                 <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {part.text && (
                      <div className="text-xl font-black text-slate-300 italic mb-8 leading-relaxed">
                        {part.text}
                      </div>
                    )}
                    
                    {part.executableCode && (
                      <div className="mb-10 p-10 bg-slate-900/80 rounded-[40px] border border-white/10 shadow-inner font-mono text-sm group relative">
                         <div className="absolute top-6 right-8 text-[10px] font-black text-slate-600 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-full">
                           Generated {part.executableCode.language}
                         </div>
                         <pre className="text-indigo-300 whitespace-pre-wrap">{part.executableCode.code}</pre>
                      </div>
                    )}

                    {part.codeExecutionResult && (
                      <div className="p-10 bg-emerald-500/5 rounded-[40px] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                         <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[11px] text-emerald-500 font-black uppercase tracking-widest italic flex items-center gap-3">
                               <i className="fa-solid fa-terminal"></i>
                               Execution Output
                            </h4>
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${part.codeExecutionResult.outcome === 'ok' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                               Status: {part.codeExecutionResult.outcome}
                            </span>
                         </div>
                         <pre className="text-emerald-50 font-mono text-lg font-bold bg-black/40 p-8 rounded-3xl border border-white/5 shadow-inner">
                           {part.codeExecutionResult.output}
                         </pre>
                      </div>
                    )}
                 </div>
               ))
             ) : (
               <div className="h-[400px] flex flex-col items-center justify-center opacity-5 grayscale select-none">
                  <i className="fa-solid fa-calculator text-[15rem] mb-10 text-indigo-500"></i>
                  <p className="uppercase tracking-[2em] font-black text-4xl italic ml-[2em]">ALU IDLE</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComputeNode;
