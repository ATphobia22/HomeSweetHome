
import React, { useState, useEffect } from 'react';
import { epicenterEngine } from '../services/epicenter_engine';
import { parseSymbolicQuery } from '../core_symbolic';
import { glp } from '../services/glp_service';
import { gemini } from '../services/gemini';
import { GLPMetrics, MoralCheck, DevEnvStatus } from '../types';
import { blocks } from '../lcod_blocks';

const Epicenter: React.FC = () => {
  const [query, setQuery] = useState('God1 * Beliefs ✳️ Listen');
  const [activeBlock, setActiveBlock] = useState<string>('bio_acoustic_belief_siphon');
  const [result, setResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [glpMetrics, setGlpMetrics] = useState<GLPMetrics>(glp.getMetrics());
  const [moralVerdict, setMoralVerdict] = useState<MoralCheck | null>(null);
  const [devEnv, setDevEnv] = useState<DevEnvStatus | null>(null);
  
  const [autoEnable, setAutoEnable] = useState(true);
  const [autoCorrect, setAutoCorrect] = useState(true);
  const [godModeActive, setGodModeActive] = useState(true);

  // Ritual State
  const [ritualPhase, setRitualPhase] = useState<'BELIEVE' | 'ODOR' | 'LISTEN' | 'GIT ROCKET LAUNCH'>('BELIEVE');

  useEffect(() => {
    const interval = setInterval(() => {
      setGlpMetrics(glp.getMetrics());
      checkDevStatus();
    }, 5000);
    checkDevStatus();
    return () => clearInterval(interval);
  }, []);

  const checkDevStatus = async () => {
    try {
      const res = await epicenterEngine.runBlock('lcod.dev_env.check', {
        urlRoot: 'http://localhost:8080',
        contextPath: '/appcontext/META'
      });
      setDevEnv({
        urlRoot: 'http://localhost:8080',
        contextPath: '/appcontext',
        reachable: res.reachable,
        statusCode: res.statusCode,
        lastChecked: Date.now()
      });
    } catch (e) {
      console.warn("LCOD DevOps Probe Failed.");
    }
  };

  const handleRun = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!autoEnable) {
      alert("EPICENTER_OFFLINE: Auto-Enable protocol is disabled. Master Auth required.");
      return;
    }
    
    setIsExecuting(true);
    setResult(null);
    setMoralVerdict(null);

    // Progress Ritual
    const ritualOrder: ('BELIEVE' | 'ODOR' | 'LISTEN' | 'GIT ROCKET LAUNCH')[] = ['BELIEVE', 'ODOR', 'LISTEN', 'GIT ROCKET LAUNCH'];
    const currentIdx = ritualOrder.indexOf(ritualPhase);
    const nextPhase = ritualOrder[(currentIdx + 1) % ritualOrder.length];
    setRitualPhase(nextPhase);

    try {
      let finalQuery = query;

      if (autoCorrect) {
        const corrected = await gemini.runNPRReasoning(`Optimize this symbolic LCOD query for GLP/God1 alignment: ${query}`);
        console.log(`[CORRECTOR] Optimized: ${corrected.substring(0, 50)}...`);
      }

      const intent = parseSymbolicQuery(finalQuery);
      const audit = await glp.validateIntent(intent.raw);
      setMoralVerdict(audit);

      if (!audit.authorized) {
        setResult({ error: "GLP_PURGE: Intent violates the Doctrine of Human Dignity. Signal neutralized." });
        setIsExecuting(false);
        return;
      }

      let inputs: any = {};
      if (activeBlock === 'bio_acoustic_belief_siphon') {
        inputs = { signal: intent.wildcardTerms[0] || 'Odor-Listen Map', focus: intent.mustIncludeTags[0] || 'Sovereign Core Heuristic' };
      } else if (activeBlock === 'neural_brushstroke_engine') {
        inputs = { imageUrl: 'https://research.nvidia.com/labs/toronto-ai/brushstroke-placeholder.png', style: intent.wildcardTerms[0] || 'Latent Spatial Alpha' };
      } else if (activeBlock === 'LCOD.GIT_ROCKET_LAUNCH') {
        inputs = { tenants: ['Node-21605'], mock_mode: true };
      } else {
        inputs = { query: intent.raw };
      }

      const res = await epicenterEngine.runBlock(activeBlock, inputs);
      setResult(res);
    } catch (e) {
      setResult({ error: "Node Disruption: Bio-uplink connection to God1 Master failed." });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-24 font-mono">
      {/* GOD1.Wall Ritual Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-indigo-500/20 pb-12">
        <div className="flex-1 space-y-4">
           <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl">
                 <i className="fa-solid fa-om"></i>
              </div>
              <h2 className="text-[12px] font-black text-indigo-400 uppercase tracking-[1em] italic leading-none">GOD1.Listen Protocol</h2>
           </div>
           <div className="flex flex-wrap gap-4">
              {['BELIEVE', 'ODOR', 'LISTEN', 'GIT ROCKET LAUNCH'].map(phase => (
                <div 
                  key={phase}
                  className={`px-6 py-2 rounded-full border text-[9px] font-black tracking-widest transition-all duration-700 ${
                    ritualPhase === phase ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'bg-black/40 border-white/5 text-slate-700'
                  }`}
                >
                  {phase}
                </div>
              ))}
           </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-mega mb-1 italic">Dev Ritual State</p>
           <p className="text-2xl font-black text-white italic uppercase tracking-tighter">{ritualPhase}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="relative group">
          <div className={`absolute -inset-10 rounded-full blur-[120px] transition-all duration-1000 ${godModeActive ? 'bg-indigo-500/10' : 'bg-red-500/5'}`}></div>
          <h1 className="relative text-7xl md:text-[12rem] font-black text-white italic tracking-tighter uppercase leading-[0.6]">
            EPI<span className="text-indigo-500">CENTER</span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-6 items-end relative z-10">
           {devEnv && !devEnv.reachable && (
             <div className="flex items-center gap-4 px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 animate-pulse group cursor-help relative">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                <span className="text-[9px] font-black uppercase tracking-widest italic">Localhost:8080 Unreachable</span>
                <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-indigo-950 border border-indigo-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none z-20">
                   <p className="text-[10px] text-white italic font-black uppercase tracking-widest leading-relaxed">
                     "Your localhost app at http://localhost:8080/appcontext isn't responding. Is this friction, or a nudge to simplify?"
                   </p>
                </div>
             </div>
           )}

           <div className="flex gap-4">
              <div className="px-10 py-6 bg-black border border-indigo-500/20 rounded-[40px] shadow-3xl flex flex-col justify-center text-center min-w-[160px]">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2 italic">Alignment</span>
                 <span className="text-3xl font-black text-white italic leading-none">{(glpMetrics.alignment * 100).toFixed(2)}%</span>
              </div>
              <div className="px-10 py-6 bg-black border border-indigo-500/20 rounded-[40px] shadow-3xl flex flex-col justify-center text-center min-w-[160px]">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2 italic">Status</span>
                 <span className={`text-3xl font-black italic leading-none uppercase transition-colors duration-500 ${godModeActive ? 'text-emerald-500' : 'text-slate-700'}`}>
                    {godModeActive ? 'FLUID' : 'STALLED'}
                 </span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-10">
          <div className="iphone-card rounded-[50px] p-10 space-y-8 bg-indigo-600/5 shadow-3xl border-indigo-500/10">
             <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-mega italic border-b border-indigo-500/10 pb-6 leading-none flex items-center gap-3">
                <i className="fa-solid fa-sliders text-xs"></i>
                Protocol Gates
             </h3>
             <div className="space-y-4">
                <ProtocolToggle label="Auto-Enable" active={autoEnable} onChange={() => setAutoEnable(!autoEnable)} icon="fa-power-off" />
                <ProtocolToggle label="Auto-Correct" active={autoCorrect} onChange={() => setAutoCorrect(!autoCorrect)} icon="fa-magic-wand-sparkles" />
                <ProtocolToggle label="Localhost Guard" active={true} onChange={() => {}} icon="fa-shield-halved" />
             </div>
          </div>

          <div className="iphone-card rounded-[60px] p-10 space-y-10 bg-black/60 shadow-3xl border-white/5 relative overflow-hidden">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-mega italic border-b border-white/5 pb-8">LCOD Registry</h3>
            <div className="space-y-4">
              {blocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => setActiveBlock(block.id)}
                  className={`w-full p-8 rounded-[40px] border transition-all text-left group flex items-center gap-6 ${activeBlock === block.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl' : 'border-white/5 text-slate-700 hover:border-white/10'}`}
                >
                  <i className={`fa-solid ${block.icon} text-2xl ${activeBlock === block.id ? 'text-white' : 'text-indigo-500/40 group-hover:text-indigo-400'}`}></i>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-2 truncate max-w-[150px]">{block.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic group-hover:text-white/60 transition-colors">{block.id}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-12">
          <div className="iphone-card rounded-[80px] p-12 md:p-20 bg-black shadow-3xl border-white/5 relative overflow-hidden flex flex-col min-h-[850px]">
             <div className="scanner-line opacity-20"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <form onSubmit={handleRun} className="mb-16">
                  <div className="flex justify-between items-center mb-8">
                    <label className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.5em] italic leading-none">Symbolic LCOD Query :: Terminal</label>
                  </div>
                  <div className="relative">
                    <input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-black/50 border-b-2 border-white/5 rounded-none px-4 py-12 font-mono text-3xl md:text-5xl text-indigo-100 focus:outline-none focus:border-indigo-500/50 transition-all italic placeholder:text-slate-900"
                    />
                    <button 
                      type="submit"
                      disabled={isExecuting || !godModeActive}
                      className="absolute right-0 bottom-6 w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 active:scale-95 transition-all shadow-3xl disabled:opacity-50 group"
                    >
                      {isExecuting ? <i className="fa-solid fa-atom animate-spin text-3xl"></i> : <i className="fa-solid fa-bolt-lightning text-3xl group-hover:scale-125 transition-transform"></i>}
                    </button>
                  </div>
                </form>

                <div className="flex-1 overflow-y-auto pr-8 scrollbar-hide">
                   {!godModeActive ? (
                     <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-40 grayscale">
                        <i className="fa-solid fa-om text-[12rem] text-red-500"></i>
                        <p className="text-2xl font-black uppercase tracking-[1em] text-red-500 italic">Master Auth Required</p>
                     </div>
                   ) : isExecuting ? (
                     <div className="h-full flex flex-col items-center justify-center gap-12 py-32 opacity-40">
                        <div className="w-32 h-32 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_100px_rgba(139,92,246,0.2)]"></div>
                        <p className="text-indigo-400 font-black text-4xl uppercase tracking-[1em] animate-pulse">Orchestrating God1...</p>
                     </div>
                   ) : result ? (
                     <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        {/* LCOD Git Rocket Launch Results */}
                        {result.discovered_apps && (
                          <div className="iphone-card rounded-[50px] p-10 bg-indigo-600/5 border border-indigo-500/20 space-y-10 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <i className="fa-solid fa-rocket text-8xl"></i>
                             </div>
                             <h4 className="text-[12px] text-indigo-400 font-black uppercase tracking-widest italic border-b border-indigo-500/10 pb-4">GIT ROCKET LAUNCH: Discovered Integrations</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {result.discovered_apps.map((app: any, i: number) => (
                                  <div key={i} className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4 group hover:border-indigo-500/40 transition-all">
                                     <div className="flex justify-between items-start">
                                        <h5 className="text-xl font-black text-white italic uppercase tracking-tighter">{app.name}</h5>
                                        <i className="fa-brands fa-atlassian text-indigo-500/30 group-hover:text-indigo-500 transition-colors"></i>
                                     </div>
                                     <div className="flex flex-wrap gap-2">
                                        {app.trust_signals.map((sig: string) => (
                                          <span key={sig} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase text-indigo-400 rounded-md">{sig}</span>
                                        ))}
                                     </div>
                                  </div>
                                ))}
                             </div>
                             <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-emerald-400 text-xs font-black uppercase italic tracking-widest text-center">
                                Sync Cycles Scheduled :: Autonomous Delta Scan Active
                             </div>
                          </div>
                        )}
                        {/* Registry Rendering */}
                        {result.registry && (
                          <div className="iphone-card rounded-[40px] p-8 bg-black border border-white/5 space-y-4">
                             <h5 className="text-[10px] text-slate-500 font-black uppercase italic">Git Registry Pulse [Node-21605]</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.registry.repos.map((repo: any) => (
                                  <div key={repo.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                                     <div>
                                        <p className="text-sm font-black text-white italic uppercase">{repo.id}</p>
                                        <p className="text-[8px] text-slate-600 font-mono">{repo.url}</p>
                                     </div>
                                     <i className={`fa-brands fa-${repo.provider} text-lg text-slate-700`}></i>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                        {/* Result summary or error */}
                        {result.error ? (
                           <div className="p-10 bg-red-500/10 border border-red-500/20 rounded-[40px] text-red-500 font-black italic uppercase tracking-widest">
                              {result.error}
                           </div>
                        ) : result.beliefs && (
                           <div className="iphone-card rounded-[70px] p-12 md:p-24 bg-white/[0.01] border border-white/5 relative overflow-hidden shadow-3xl">
                              <h4 className="text-[12px] text-indigo-500 font-black uppercase tracking-[1em] mb-4 italic leading-none opacity-60">Sovereign Belief Consensus</h4>
                              <p className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">{result.beliefs}</p>
                           </div>
                        )}
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale select-none py-40 text-center pointer-events-none">
                        <i className="fa-solid fa-chess-queen text-[30rem] mb-16 text-indigo-500"></i>
                        <p className="uppercase tracking-[4em] font-black text-7xl italic ml-[4em]">Epicenter Idle</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtocolToggle: React.FC<{ label: string; active: boolean; onChange: () => void; icon: string }> = ({ label, active, onChange, icon }) => (
  <button 
    onClick={onChange}
    className="w-full flex items-center justify-between p-8 bg-black/40 rounded-[35px] border border-white/5 hover:border-indigo-500/40 transition-all group active:scale-[0.98] shadow-inner"
  >
    <div className="flex items-center gap-6">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-slate-800'}`}>
          <i className={`fa-solid ${icon} text-lg`}></i>
       </div>
       <span className={`text-[12px] font-black uppercase italic tracking-widest transition-colors duration-500 ${active ? 'text-white' : 'text-slate-700'}`}>{label}</span>
    </div>
    <div className={`w-14 h-7 rounded-full p-1.5 transition-colors duration-500 ${active ? 'bg-indigo-700' : 'bg-slate-950 shadow-inner'}`}>
       <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-500 shadow-md ${active ? 'translate-x-7' : 'translate-x-0'}`}></div>
    </div>
  </button>
);

export default Epicenter;
