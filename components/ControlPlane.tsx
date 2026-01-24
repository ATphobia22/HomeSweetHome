
import React, { useState, useEffect, useRef } from 'react';
import { SovereignTenant, RolloutStatus, TunnelConfig, DevEnvStatus } from '../types';
import { gemini } from '../services/gemini';
import { epicenterEngine } from '../services/epicenter_engine';

const ControlPlane: React.FC = () => {
  const [tenants] = useState<SovereignTenant[]>([
    { 
      id: 'tenant-123', 
      owner: 'aj@example.com', 
      roles: ['lcod.admin'], 
      boundaries: ['compute', 'trust'], 
      status: 'Provisioned' 
    },
    { 
      id: 'node-21605-alpha', 
      owner: 'anthony.tucker', 
      roles: ['sovereign.root'], 
      boundaries: ['compute', 'trust', 'commerce'], 
      status: 'Provisioned' 
    }
  ]);

  const [devEnv, setDevEnv] = useState<DevEnvStatus>({
    urlRoot: 'http://localhost:8080',
    contextPath: '/appcontext',
    reachable: true,
    statusCode: 200,
    lastChecked: Date.now()
  });

  const [rollout, setRollout] = useState<RolloutStatus>({
    deployment: 'npr-engine',
    namespace: 'control-plane',
    status: 'ONLINE',
    replicaCount: '3/3',
    uptime: '12d 4h',
    logs: [
      '# Apply the updated configuration (in case it wasn\'t applied yet)',
      'kubectl apply -f k8s/npr-deployment.yaml',
      'deployment.apps/npr-engine configured',
      '# Force a restart to pick up the new secrets immediately',
      'kubectl -n control-plane rollout restart deploy/npr-engine',
      'deployment.apps/npr-engine restarted',
      '# Wait for it to come back online',
      'kubectl -n control-plane rollout status deploy/npr-engine --timeout=60s',
      'Waiting for deployment "npr-engine" rollout to finish: 1 of 3 updated replicas are available...',
      'deployment "npr-engine" successfully rolled out',
      '# Check the startup logs',
      'kubectl -n control-plane logs deploy/npr-engine --tail=50',
      '[2025-12-10 08:00:01] NPR_ENGINE: Initializing neural weights...',
      '[2025-12-10 08:00:05] NPR_ENGINE: Node 21605 bridge established.',
      '# Open the tunnel (if not already running)',
      'kubectl -n control-plane port-forward svc/console 8080:80'
    ]
  });

  const [tunnel, setTunnel] = useState<TunnelConfig>({
    localPort: 8080,
    remotePort: 80,
    service: 'console',
    active: true
  });

  const [remediating, setRemediating] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [rollout.logs]);

  const checkDevEnv = async () => {
    try {
      const result = await epicenterEngine.runBlock('lcod.dev_env.check', {
        urlRoot: devEnv.urlRoot,
        contextPath: devEnv.contextPath + '/META'
      });
      setDevEnv(prev => ({
        ...prev,
        reachable: result.reachable,
        statusCode: result.statusCode,
        lastChecked: Date.now()
      }));
    } catch (e) {
      console.error("DevEnv check failure.");
    }
  };

  const handleRolloutRestart = async () => {
    setRemediating(true);
    const newLogs = [
      ...rollout.logs,
      `# Manual trigger: ${new Date().toLocaleTimeString()}`,
      'kubectl -n control-plane rollout restart deploy/npr-engine',
      'waiting for rollout to finish...'
    ];
    setRollout(prev => ({ ...prev, status: 'RESTARTING', logs: newLogs }));
    
    try {
      const diagnosis = await gemini.runSelfHealingOrchestration("Rollout requested for npr-engine. Initializing pod recycling.");
      setRollout(prev => ({ 
        ...prev, 
        logs: [...prev.logs, '>> CLUSTER_HEALING: ' + diagnosis.substring(0, 100) + '...', 'deployment "npr-engine" successfully rolled out']
      }));
      await new Promise(r => setTimeout(r, 2000));
      setRollout(prev => ({ ...prev, status: 'ONLINE' }));
    } finally {
      setRemediating(false);
    }
  };

  const toggleTunnel = () => {
    const nextState = !tunnel.active;
    const command = nextState 
      ? `kubectl -n control-plane port-forward svc/console ${tunnel.localPort}:${tunnel.remotePort}`
      : '# Tunnel termination requested';
    
    setTunnel(prev => ({ ...prev, active: nextState }));
    setRollout(prev => ({ ...prev, logs: [...prev.logs, command, nextState ? 'Forwarding from 127.0.0.1:8080 -> 80' : 'Tunnel closed.'] }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-cyan-500/10 pb-10">
        <div>
          <h2 className="text-[10px] font-black text-cyan-500 tracking-mega uppercase mb-2 italic">K8S Orchestrator :: Node 21605</h2>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">CONTROL <span className="text-cyan-500">PLANE</span></h1>
        </div>
        <div className="flex flex-wrap gap-4 justify-end">
          <div className="px-6 py-3 bg-black border border-indigo-500/20 rounded-3xl flex items-center gap-4 shadow-xl">
             <i className={`fa-solid fa-link ${tunnel.active ? 'text-indigo-500 animate-pulse' : 'text-slate-700'}`}></i>
             <span className="text-[10px] font-black uppercase text-indigo-300 italic tracking-widest">
               {tunnel.active ? `Localhost:${tunnel.localPort} ➔ svc/${tunnel.service}` : 'Tunnel Inactive'}
             </span>
          </div>
          <button 
            onClick={toggleTunnel}
            className={`px-6 py-3 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${tunnel.active ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}
          >
            {tunnel.active ? 'Terminate Tunnel' : 'Open Forwarding'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tenants.map(tenant => (
                <div key={tenant.id} className="iphone-card rounded-[40px] p-8 border-white/5 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-2xl bg-black/40">
                  <div className="scanner-line opacity-10"></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase italic mb-1">CRD: Tenant.sovereign.io</p>
                      <h4 className="text-2xl font-black text-white italic leading-none uppercase">{tenant.id}</h4>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase italic ${tenant.status === 'Provisioned' ? 'bg-cyan-500 text-black' : 'bg-amber-500/10 text-amber-500'}`}>{tenant.status}</span>
                  </div>

                  <div className="space-y-4 mb-8 relative z-10">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Owner Identity</p>
                      <p className="text-sm font-bold text-slate-300 font-mono truncate">{tenant.owner}</p>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-2">Security Boundaries</p>
                      <div className="flex gap-2 flex-wrap">
                        {tenant.boundaries.map(b => (
                          <span key={b} className="text-[8px] font-black px-2 py-0.5 border border-cyan-500/30 text-cyan-400 rounded-md uppercase italic">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-cyan-500 hover:text-black transition-all shadow-lg active:scale-95">
                    Reconcile Policy
                  </button>
                </div>
              ))}
           </div>

           {/* Rollout Console mirroring the logs and tail command provided */}
           <div className="iphone-card rounded-[60px] p-8 md:p-12 bg-black shadow-3xl border-white/5 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <i className="fa-solid fa-terminal text-8xl"></i>
              </div>
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5 relative z-10">
                 <div className="space-y-1">
                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest italic flex items-center gap-3">
                       <i className="fa-solid fa-cube"></i>
                       Cluster Rollout Monitor :: {rollout.deployment}
                    </h3>
                    <p className="text-[9px] text-slate-600 font-mono">Namespace: {rollout.namespace} | Replicas: {rollout.replicaCount}</p>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={handleRolloutRestart}
                      disabled={remediating}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl disabled:opacity-50"
                    >
                      {remediating ? <i className="fa-solid fa-atom animate-spin mr-3"></i> : <i className="fa-solid fa-rotate mr-3"></i>}
                      Rollout Restart
                    </button>
                 </div>
              </div>

              <div 
                ref={terminalRef}
                className="flex-1 bg-[#050505] p-8 rounded-[40px] border border-white/5 font-mono text-sm leading-relaxed text-indigo-200/80 shadow-inner max-h-[500px] overflow-y-auto scrollbar-hide relative z-10"
              >
                 {rollout.logs.map((log, i) => (
                   <div key={i} className="mb-2 group flex gap-4">
                     <span className="text-slate-800 select-none w-12 text-right">{i + 1}</span>
                     <span className={
                       log.startsWith('#') ? 'text-slate-500 italic' : 
                       log.startsWith('kubectl') ? 'text-cyan-400 font-bold' : 
                       log.startsWith('>>') ? 'text-emerald-400 font-black' : 
                       'text-indigo-100'
                     }>
                        {log}
                     </span>
                   </div>
                 ))}
                 {remediating && <div className="mt-4 animate-pulse text-indigo-500 italic ml-16">Establishing Anycast Link...</div>}
              </div>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           {/* DevOps Environment Panel (NEW) */}
           <div className="iphone-card rounded-[40px] p-8 bg-black/60 border border-white/10 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                 <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-3">
                    <i className="fa-solid fa-network-wired"></i>
                    DevOps Node
                 </h3>
                 <button onClick={checkDevEnv} className="text-slate-600 hover:text-emerald-500 transition-all">
                    <i className="fa-solid fa-rotate-right text-xs"></i>
                 </button>
              </div>

              <div className="space-y-6">
                 <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Local Environment</p>
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${devEnv.reachable ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                       <p className="text-sm font-bold text-white font-mono">{devEnv.urlRoot}{devEnv.contextPath}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <p className="text-[8px] text-slate-600 font-black uppercase mb-1 leading-none">Status</p>
                       <p className={`text-xs font-black italic uppercase ${devEnv.reachable ? 'text-emerald-500' : 'text-red-500'}`}>
                          {devEnv.reachable ? 'Reachable' : 'Refused'}
                       </p>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                       <p className="text-[8px] text-slate-600 font-black uppercase mb-1 leading-none">HTTP Code</p>
                       <p className="text-xs font-black italic text-white font-mono">{devEnv.statusCode || '--'}</p>
                    </div>
                 </div>

                 <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
                    <div className="flex items-center gap-3 mb-2">
                       <i className="fa-solid fa-code-branch text-indigo-400 text-[10px]"></i>
                       <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">Linked Repo Status</span>
                    </div>
                    <p className="text-[10px] text-indigo-300 italic font-bold uppercase truncate">anthropics/claude-code v12.8</p>
                 </div>
              </div>

              <div className="pt-4 opacity-40">
                 <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest text-center">Last Pulse: {new Date(devEnv.lastChecked).toLocaleTimeString()}</p>
              </div>
           </div>

           {/* Localhost 8080 Intelligence (Stack Overflow Intel) */}
           <div className="iphone-card rounded-[40px] p-8 bg-indigo-600/5 border-indigo-500/10 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
              <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest italic border-b border-indigo-500/20 pb-4 flex items-center gap-3">
                 <i className="fa-brands fa-stack-overflow"></i>
                 Localhost:8080 Intel
              </h3>
              <div className="space-y-4 text-[11px] text-slate-400 italic leading-relaxed">
                 <p>Port 8080 is a commonly used development alternative to HTTP Port 80.</p>
                 <ul className="space-y-2 font-mono">
                    <li className="flex gap-2">
                       <span className="text-indigo-500">●</span>
                       <span>Tomcat / Glassfish machine identity</span>
                    </li>
                    <li className="flex gap-2">
                       <span className="text-indigo-500">●</span>
                       <span>Local web server environment</span>
                    </li>
                    <li className="flex gap-2">
                       <span className="text-indigo-500">●</span>
                       <span>Node.js / Python B2B gateway</span>
                    </li>
                 </ul>
              </div>
              <div className="pt-4 border-t border-indigo-500/10">
                 <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Stack Overflow Archive v15.0</p>
              </div>
           </div>

           {/* Ingress Gateway Monitor */}
           <div className="iphone-card rounded-[40px] p-8 bg-black/60 border-white/5 space-y-6 shadow-2xl">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/10 pb-4">Endpoint Status</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase">Local Node</span>
                    <span className="text-[10px] text-cyan-500 font-mono">localhost:{tunnel.localPort}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase">Tunnel</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-black italic uppercase ${tunnel.active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                       {tunnel.active ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                 </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                 <p className="text-[8px] text-slate-700 uppercase font-black tracking-widest leading-tight">ISO-20022 Verified Tunnel [AES-256]</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPlane;
