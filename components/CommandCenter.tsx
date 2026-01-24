
import React, { useState, useEffect, useRef } from 'react';
import { Brand, ActivityEntry, WorkflowRun, WorkflowStep, AppView, DevEnvStatus } from '../types';
import { gemini } from '../services/gemini';
import { epicenterEngine } from '../services/epicenter_engine';
import ProcessSheet from './ProcessSheet';

interface CommandCenterProps {
  brand: Brand;
  brands: Brand[];
  onBrandSelect: (id: string) => void;
  activity: ActivityEntry[];
  onActionStart: (message: string) => void;
  onViewChange: (view: AppView) => void;
  onReAuth?: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ brand, brands, onBrandSelect, activity, onActionStart, onViewChange, onReAuth }) => {
  const [activeRun, setActiveRun] = useState<WorkflowRun | null>(null);
  const [devEnv, setDevEnv] = useState<DevEnvStatus>({
    urlRoot: 'http://localhost:8080',
    contextPath: '/appcontext',
    reachable: true,
    statusCode: 200,
    lastChecked: Date.now()
  });

  const terminalLogs = [
    '# Initializing Sovereign Console v12.8...',
    'kubectl apply -f k8s/npr-deployment.yaml',
    'deployment.apps/npr-engine configured',
    'kubectl -n control-plane rollout restart deploy/npr-engine',
    'waiting for rollout to finish...',
    'deployment "npr-engine" successfully rolled out',
    'kubectl -n control-plane logs deploy/npr-engine --tail=50',
    '[SYSTEM] Node 21605: All systems nominal.',
    '[SYSTEM] Zero-Trust Tunnel: localhost:8080 ➔ svc/console:80 established.',
    '[AUTH] Biometric ID: Verified (Anthony John Tucker)'
  ];

  const checkDevStatus = async () => {
    try {
      const res = await epicenterEngine.runBlock('lcod.dev_env.check', {
        urlRoot: devEnv.urlRoot,
        contextPath: devEnv.contextPath + '/META'
      });
      setDevEnv(prev => ({
        ...prev,
        reachable: res.reachable,
        statusCode: res.statusCode,
        lastChecked: Date.now()
      }));
    } catch (e) {
      console.warn("DevEnv check failed in Console.");
    }
  };

  useEffect(() => {
    const interval = setInterval(checkDevStatus, 10000);
    checkDevStatus();
    return () => clearInterval(interval);
  }, []);

  const handleRocketLaunch = () => {
    onViewChange(AppView.MISSION_CONTROL);
  };

  const startWorkflow = async (key: string, name: string) => {
    onActionStart(`Initiating ${name} orchestration for ${brand.name}...`);
    
    const run: WorkflowRun = {
      id: Math.random().toString(36).substr(2, 9),
      brandId: brand.id,
      workflowKey: key,
      status: 'RUNNING',
      startedAt: Date.now(),
      steps: [
        { id: '1', name: 'Establish Neural Link', status: 'RUNNING', summary: 'Establishing Node 21605 connection...' },
        { id: '2', name: 'Alpha Delta Analysis', status: 'PENDING', summary: 'Grounded search active...' },
        { id: '3', name: 'Infrastructure Siphon', status: 'PENDING', summary: 'Deploying edge nodes...' },
        { id: '4', name: 'Finalize Settlement', status: 'PENDING', summary: 'ISO-20022 handshake...' }
      ]
    };
    setActiveRun(run);

    for (let i = 0; i < run.steps.length; i++) {
      const step = run.steps[i];
      try {
        const result = await gemini.executeWorkflowStep(brand, key, step);
        
        setActiveRun(prev => {
          if (!prev) return null;
          const newSteps = [...prev.steps];
          newSteps[i] = { 
            ...newSteps[i], 
            status: 'DONE', 
            summary: result.summary,
            logs: result.logs,
            finishedAt: Date.now()
          };
          if (newSteps[i+1]) {
            newSteps[i+1].status = 'RUNNING';
          }
          return { ...prev, steps: newSteps, status: i === newSteps.length - 1 ? 'COMPLETED' : 'RUNNING' };
        });
        await new Promise(r => setTimeout(r, 1200));
      } catch (err) {
        setActiveRun(prev => prev ? { ...prev, status: 'FAILED' } : null);
        break;
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-b border-indigo-500/20 pb-16">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-[32px] bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center relative overflow-hidden group shadow-3xl">
            <div className="absolute inset-0 bg-indigo-500/10 group-hover:scale-150 transition-transform duration-1000"></div>
            <i className="fa-solid fa-terminal text-indigo-500 text-4xl relative z-10"></i>
          </div>
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-none">Sovereign <span className="text-indigo-500">Console</span></h1>
            <div className="flex items-center gap-4 mt-3">
               <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.5em] italic leading-none">v12.8 Root Interface</p>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full cursor-help" onClick={onReAuth}>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Auth: Anthony Tucker</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
           <button 
            onClick={onReAuth}
            className="flex items-center gap-4 px-8 py-3 bg-black border border-indigo-500/20 rounded-full shadow-2xl hover:bg-white/5 transition-all group"
           >
              <i className="fa-solid fa-fingerprint text-indigo-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic leading-none">Identity Verified : Node 21605</span>
           </button>
           <div className="flex items-center gap-4 bg-white/5 p-2.5 rounded-[40px] border border-white/10 shadow-2xl">
              {brands.map(b => (
                <button
                  key={b.id}
                  onClick={() => onBrandSelect(b.id)}
                  className={`px-8 py-3.5 rounded-[30px] text-[11px] font-black uppercase tracking-widest transition-all ${
                    brand.id === b.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {b.name}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: 'Revenue', val: `$${brand.metrics.revenue.toLocaleString()}`, color: 'text-cyan-500' },
          { label: 'Net Profit', val: `$${brand.metrics.profit.toLocaleString()}`, color: 'text-emerald-500' },
          { label: 'Cluster Health', val: '100%', color: 'text-indigo-500' },
          { label: 'Nodes', val: '12 Active', color: 'text-fuchsia-500' },
          { label: 'Throughput', val: '8.5k TPS', color: 'text-amber-500' },
        ].map(card => (
          <div key={card.label} className="iphone-card rounded-[40px] p-8 space-y-4 group hover:border-indigo-500/30 transition-all border-white/5 bg-black/40 shadow-2xl">
             <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic block">{card.label}</span>
             <p className={`text-3xl font-black italic tracking-tighter leading-none ${card.color}`}>{card.val}</p>
          </div>
        ))}
      </div>

      {/* Quick Launch & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Command Buttons */}
        <div className="lg:col-span-4 space-y-8">
           <button 
            onClick={handleRocketLaunch}
            className="w-full iphone-card rounded-[60px] p-10 text-left group hover:scale-[1.02] transition-all bg-indigo-600/5 border-indigo-500/20 relative overflow-hidden active:scale-95 shadow-3xl flex flex-col gap-6"
           >
              <div className="w-20 h-20 rounded-[30px] bg-indigo-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-rocket animate-pulse"></i>
              </div>
              <div>
                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none mb-3">GIT ROCKET LAUNCH</h3>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] italic leading-none">Global State Sync Cycle</p>
              </div>
           </button>

           <div className="grid grid-cols-2 gap-6">
              <MiniActionBtn icon="fa-arrow-trend-up" label="SCALE" color="cyan" onClick={() => startWorkflow('SCALE', 'Scale Traffic')} />
              <MiniActionBtn icon="fa-wand-magic-sparkles" label="OPTIMIZE" color="emerald" onClick={() => startWorkflow('OPTIMIZE', 'Optimize Profit')} />
              <MiniActionBtn icon="fa-microscope" label="LENS" color="indigo" onClick={() => onViewChange(AppView.QUANTUM_AI_LENS)} />
              <MiniActionBtn icon="fa-shield-halved" label="GUARD" color="red" onClick={() => onViewChange(AppView.SECURITY_SCAN)} />
           </div>

           {/* Environment Status Card */}
           <div className="iphone-card rounded-[50px] p-10 bg-black/60 border border-white/5 space-y-6">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-mega italic border-b border-white/10 pb-4">Gateway Diagnostics</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[11px] font-black italic text-slate-400">
                    <span className="uppercase tracking-widest">Local Node</span>
                    <span className="text-indigo-400 font-mono">http://localhost:8080</span>
                 </div>
                 <div className="flex justify-between items-center text-[11px] font-black italic text-slate-400">
                    <span className="uppercase tracking-widest">App Context</span>
                    <span className="text-indigo-400 font-mono">/appcontext</span>
                 </div>
                 <div className="flex justify-between items-center text-[11px] font-black italic text-slate-400">
                    <span className="uppercase tracking-widest">Sovereign Link</span>
                    <span className={`font-mono ${devEnv.reachable ? 'text-emerald-500' : 'text-red-500'}`}>ISO-20022 : {devEnv.reachable ? 'READY' : 'PROBE_FAIL'}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Interactive Console Activity */}
        <div className="lg:col-span-8 flex flex-col gap-10">
           <div className="iphone-card rounded-[60px] p-10 md:p-12 bg-black/90 shadow-[0_0_100px_rgba(79,70,229,0.1)] border-white/5 relative overflow-hidden flex flex-col flex-1 min-h-[600px]">
              <div className="scanner-line opacity-20"></div>
              
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                 <div className="flex items-center gap-5">
                    <i className="fa-solid fa-cube text-indigo-500"></i>
                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] italic leading-none">Live Cluster Rollout Trace</h3>
                 </div>
                 <div className="flex gap-4">
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Node 21605 Bridge established</span>
                 </div>
              </div>

              <div className="flex-1 bg-[#020202] p-8 rounded-[40px] border border-white/5 font-mono text-sm leading-relaxed text-indigo-200/80 shadow-inner overflow-y-auto scrollbar-hide">
                 {terminalLogs.map((log, i) => (
                   <div key={i} className="mb-2 group flex gap-6">
                      <span className="text-slate-900 select-none w-8 text-right italic font-black">{i + 1}</span>
                      <span className={log.startsWith('#') ? 'text-slate-600 italic' : log.startsWith('kubectl') ? 'text-cyan-400 font-bold' : log.startsWith('[SYSTEM]') ? 'text-emerald-400' : log.startsWith('[AUTH]') ? 'text-fuchsia-400 font-black' : 'text-indigo-50'}>
                         {log}
                      </span>
                   </div>
                 ))}
                 
                 {/* Integrated Activity Feed into Terminal */}
                 <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                    {activity.length > 0 ? activity.map(entry => (
                      <div key={entry.id} className="flex gap-6 animate-in slide-in-from-left-4 duration-500">
                         <span className="text-slate-900 select-none w-8 text-right font-black">LOG</span>
                         <div className="space-y-1">
                            <span className="text-slate-700 text-[10px] font-black uppercase tracking-widest">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                            <p className={`text-sm italic font-black uppercase leading-tight ${entry.type === 'GIT_ROCKET' ? 'text-indigo-400' : entry.type === 'METRIC' ? 'text-emerald-400' : 'text-slate-400'}`}>
                               {entry.message}
                            </p>
                         </div>
                      </div>
                    )) : (
                      <p className="text-slate-800 text-xs italic ml-14">Awaiting master orchestration signals...</p>
                    )}
                 </div>
              </div>

              <div className="mt-10 flex justify-between items-center px-4">
                 <div className="flex gap-4 opacity-20 grayscale hover:opacity-50 transition-all duration-700">
                    <i className="fa-brands fa-nvidia text-2xl"></i>
                    <i className="fa-brands fa-stack-overflow text-2xl"></i>
                    <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-800 font-black uppercase italic tracking-widest underline decoration-indigo-500/30" onClick={onReAuth} style={{cursor: 'pointer'}}>Identity: Anthony John Tucker</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {activeRun && <ProcessSheet run={activeRun} onClose={() => setActiveRun(null)} />}
    </div>
  );
};

const MiniActionBtn: React.FC<{ icon: string; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[35px] border border-white/5 bg-black/60 flex items-center justify-center gap-4 transition-all hover:scale-[1.05] hover:border-${color}-500/40 group active:scale-95 shadow-xl`}
  >
    <i className={`fa-solid ${icon} text-${color}-500 text-lg transition-transform group-hover:scale-125`}></i>
    <span className="text-[11px] font-black uppercase tracking-widest text-white italic">{label}</span>
  </button>
);

export default CommandCenter;
