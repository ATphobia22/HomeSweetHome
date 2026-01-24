
import React, { useState } from 'react';
import { gemini } from '../services/gemini';

interface EnvSetupProps {
  onLaunchRequested?: () => void;
}

const EnvSetup: React.FC<EnvSetupProps> = ({ onLaunchRequested }) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isIgniting, setIsIgniting] = useState(false);
  const [ignitionLog, setIgnitionLog] = useState<string[]>([]);

  const setupCommands = [
    {
      id: 'env',
      title: "Environment Creation",
      cmd: "conda create -n npr_env python=3.11 -y\nconda activate npr_env",
      desc: "Initialize a dedicated Python 3.11 virtual environment for the Sovereign Node."
    },
    {
      id: 'deps',
      title: "Core Dependencies",
      cmd: "pip install sglang\npip install liger-kernel",
      desc: "Install SGLang for high-throughput serving and Liger Kernel for optimized training."
    },
    {
      id: 'hw',
      title: "Hardware Acceleration",
      cmd: "pip install flash-attn --no-build-isolation",
      desc: "Configure Flash Attention v2. Ensure your CUDA toolkit matches the local Blackwell/Grace architecture."
    },
    {
      id: 'launch',
      title: "Inference Ignition",
      cmd: "python npr_engine.py --model_path \"bigai-NPR/NPR-4B\" --dataset \"orz-math\"",
      desc: "Launch the Native Parallel Reasoner using the NPR-4B architecture on the specified dataset."
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus("Command Buffered to Memory");
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleIgnite = async () => {
    setIsIgniting(true);
    setIgnitionLog(["[SYSTEM] Initializing Blackwell Cluster...", "[SYSTEM] Loading NPR-4B Weights...", "[SYSTEM] Connecting orz-math stream..."]);
    
    try {
      // Simulate real execution via Gemini reasoning
      await gemini.runNPRReasoning("Validate system readiness for NPR-4B architecture ignition.");
      setIgnitionLog(prev => [...prev, "[NPR-ENGINE] Weights Loaded (4.2B Params)", "[NPR-ENGINE] Neural Bridge Secure.", "[SYSTEM] DETACHING CONSOLE FOR LIVE EXECUTION..."]);
      
      // Delay slightly for effect then trigger transition
      setTimeout(() => {
        if (onLaunchRequested) onLaunchRequested();
      }, 1500);
    } catch (e) {
      setIgnitionLog(prev => [...prev, "[ERROR] Ignition Failure: Connection to GPU-Node 21605 lost."]);
      setIsIgniting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic">Infrastructure Provisioning v12.0</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">NODE <span className="text-indigo-500">SETUP</span></h1>
        </div>
        <div className="flex items-center gap-4 bg-indigo-500/10 px-6 py-3 rounded-full border border-indigo-500/20">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Blackwell Optimized Path</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {setupCommands.map((item, idx) => (
            <div key={idx} className="iphone-card rounded-[40px] p-8 space-y-6 bg-black/60 border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                  <i className="fa-solid fa-terminal text-6xl"></i>
               </div>
               
               <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-2 italic">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase italic tracking-tight">{item.desc}</p>
                  </div>
                  {item.id === 'launch' && (
                    <button 
                      onClick={handleIgnite}
                      disabled={isIgniting}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                    >
                      {isIgniting ? <i className="fa-solid fa-atom animate-spin"></i> : <i className="fa-solid fa-play"></i>}
                      <span className="ml-2">{isIgniting ? 'IGNITING...' : 'LAUNCH'}</span>
                    </button>
                  )}
               </div>

               <div className="relative">
                  <pre className="bg-black/80 rounded-2xl p-6 font-mono text-sm text-slate-300 border border-white/10 overflow-x-auto shadow-inner leading-relaxed">
                    {item.cmd}
                  </pre>
                  <button 
                    onClick={() => handleCopy(item.cmd)}
                    className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
               </div>
            </div>
          ))}
        </div>

        <div className="space-y-12">
           {ignitionLog.length > 0 ? (
              <div className="iphone-card rounded-[50px] p-10 bg-black shadow-3xl border-indigo-500/20 relative overflow-hidden flex flex-col min-h-[500px]">
                <div className="scanner-line"></div>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Ignition Console :: NPR-4B</h4>
                   <button onClick={() => setIgnitionLog([])} className="text-[10px] text-slate-700 hover:text-white uppercase font-black">Clear</button>
                </div>
                <div className="flex-1 font-mono text-xs text-indigo-100/70 space-y-4 overflow-y-auto pr-4 scrollbar-hide">
                   {ignitionLog.map((line, i) => (
                     <div key={i} className={`p-4 rounded-xl ${line.startsWith('[SYSTEM]') ? 'bg-white/5 italic' : 'bg-black/40 border border-white/5'}`}>
                        {line}
                     </div>
                   ))}
                </div>
              </div>
           ) : (
             <div className="iphone-card rounded-[50px] p-12 bg-indigo-600/5 border border-indigo-500/20 text-center space-y-10 shadow-3xl relative overflow-hidden">
                <div className="scanner-line opacity-10"></div>
                <i className="fa-solid fa-microchip-ai text-indigo-500 text-8xl"></i>
                <div>
                  <p className="text-xl font-black text-white uppercase italic leading-tight tracking-widest mb-4">Provisioning Guard</p>
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest opacity-80 italic max-w-sm mx-auto">
                    The NPR engine requires SGLang for low-latency parallel reasoning. These commands will configure your local Blackwell instance for sovereign operation.
                  </p>
                </div>
                <div className="h-px w-20 bg-indigo-500/20 mx-auto"></div>
                <p className="text-[10px] text-slate-800 font-mono tracking-[0.2em] uppercase">VERIFIED: BIGAI_OFFICIAL_12_2025</p>
             </div>
           )}

           <div className="iphone-card rounded-[40px] p-10 space-y-8 bg-black/90 border-white/5">
              <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest italic border-b border-white/5 pb-4 leading-none">Status Monitor</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Conda Bin', status: 'LOCKED', color: 'text-indigo-400' },
                   { label: 'SGLang Kernel', status: 'AWAITING', color: 'text-amber-500' },
                   { label: 'Liger-Kernel', status: 'AWAITING', color: 'text-amber-500' },
                   { label: 'FlashAttention', status: 'AWAITING', color: 'text-amber-500' },
                   { label: 'NPR-4B Architecture', status: isIgniting ? 'LOAD_SEQ' : 'AWAITING', color: isIgniting ? 'text-indigo-500 animate-pulse' : 'text-slate-700' }
                 ].map((node, i) => (
                   <div key={i} className="flex justify-between items-center text-nano font-black uppercase tracking-widest italic">
                      <span className="text-slate-500">{node.label}</span>
                      <span className={node.color}>{node.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {copyStatus && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] bg-indigo-600 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest animate-in slide-in-from-bottom-10 shadow-2xl">
          <i className="fa-solid fa-brain-circuit mr-3"></i>
          {copyStatus}
        </div>
      )}
    </div>
  );
};

export default EnvSetup;
