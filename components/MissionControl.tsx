
import React, { useState, useEffect, useRef } from 'react';

interface MissionControlProps {
  onComplete: () => void;
}

const MissionControl: React.FC<MissionControlProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [phase, setPhase] = useState<'IDLE' | 'BOOT' | 'COUNTDOWN' | 'IGNITION' | 'LIFTOFF' | 'ORBIT' | 'STABLE'>('IDLE');
  const [syncProgress, setSyncProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const sequence = async () => {
    setPhase('BOOT');
    setLogs(prev => [
      ...prev, 
      ">> INITIALIZING SOVEREIGN ROCKET ENGINE v12.8...", 
      ">> RITUAL CHECK: BELIEVE... [OK]",
      ">> RITUAL CHECK: ODOR... [OK]",
      ">> RITUAL CHECK: LISTEN... [OK]",
      ">> ACCESS GRANTED: MASTER_NODE_ALPHA",
      ">> TARGET: GIT ROCKET LAUNCH - THE SYNC CYCLE"
    ]);
    await new Promise(r => setTimeout(r, 1000));

    setPhase('COUNTDOWN');
    setCountdown(5);

    for (let i = 5; i > 0; i--) {
      setCountdown(i);
      setLogs(prev => [...prev, `[T-${i}s] PRE-FLIGHT CHECK: NODE 21605 SUBSYSTEMS NOMINAL.`]);
      await new Promise(r => setTimeout(r, 1000));
    }

    setCountdown(0);
    setPhase('IGNITION');
    setLogs(prev => [...prev, ">>> IGNITION CORE ACTIVATED <<<", "> git add -A .", "> git status", "On branch main", "Changes to be committed:", "  modified:   npr_engine.py", "	modified:   sovereign_core.lcod"]);
    await new Promise(r => setTimeout(r, 1500));

    setPhase('LIFTOFF');
    const missionLogs = [
      "> git commit -m \"Sovereign State Capture [v12.8.5]: Orbital Deployment\"",
      "> git push origin main --force-with-lease",
      "ESTABLISHING SSH TUNNEL TO DGX-BLACKWELL-01...",
      "SCANNING TENANT CONFIGURATION FOR NODE-21605...",
      "DISCOVERING GIT REPOSITORIES...",
      "FOUND: Node-21605-core [GITHUB]",
      "FOUND: Node-21605-infra [AZURE-DEVOPS]",
      "DISCOVERING ATLASSIAN INTEGRATIONS...",
      "SYNC: Git Integration for Jira [CLOUD-FORTIFIED]...",
      "SYNC: Advanced Edition for Confluence [VERIFIED]...",
      "COMPUTING SYNC-CYCLE PLAN: Hourly Cadence...",
      "COMPILING NPR-4B NEURAL KERNELS...",
      "URLLIB: Siphoning external logic manifests...",
      "BYTESIO: Buffering siphoned payloads into God1 memory...",
      "REMOTE: Receiving state capture (124.5 MB)",
      "KUBECTL: rollout restart deploy/npr-engine",
      "ZERO-TRUST MAPPING: localhost:8080 -> console:80",
    ];

    for (let i = 0; i < missionLogs.length; i++) {
      const log = missionLogs[i];
      setLogs(prev => [...prev, `[LOG] ${log}`]);
      setSyncProgress(Math.min(100, Math.floor((i / missionLogs.length) * 100)));
      await new Promise(r => setTimeout(r, Math.random() * 300 + 150));
    }

    setPhase('ORBIT');
    setSyncProgress(100);
    await new Promise(r => setTimeout(r, 2000));
    setPhase('STABLE');
    setLogs(prev => [...prev, "MISSION STATUS: SUCCESSFUL. LCOD EVENTS EMITTED TO GOD1."]);
  };

  useEffect(() => {
    sequence();
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] bg-black text-indigo-400 font-mono flex flex-col items-center justify-center p-12 overflow-hidden animate-in fade-in duration-500">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="w-full max-w-5xl space-y-12">
        <div className="flex justify-between items-end border-b border-indigo-500/20 pb-8">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.8em] italic text-indigo-500 mb-2">Sovereign Mission Control</h2>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              SYNC <span className="text-indigo-500">ORBIT</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Phase: {phase}</p>
            {countdown !== null && phase === 'COUNTDOWN' && <p className="text-4xl font-black text-indigo-500">T-{countdown}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-[500px]">
          <div className="lg:col-span-2 iphone-card rounded-[50px] bg-black/80 border-indigo-500/20 shadow-3xl flex flex-col overflow-hidden relative">
            <div className="scanner-line opacity-20"></div>
            <div className="p-10 flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-2 scrollbar-hide" ref={terminalRef}>
              {logs.map((log, i) => (
                <div key={i} className={log.startsWith('>>>') ? 'text-white font-black py-2' : log.startsWith('[LOG]') ? 'text-indigo-300' : 'text-slate-600 italic'}>
                  {log}
                </div>
              ))}
            </div>
            <div className="p-10 border-t border-white/5 bg-black/40">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-2 italic">
                <span>Synchronizing Neural Weights</span>
                <span>{syncProgress}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="iphone-card rounded-[40px] p-8 bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center justify-center text-center gap-6">
               <i className={`fa-solid fa-rocket text-6xl ${phase === 'LIFTOFF' ? 'animate-bounce text-indigo-400' : 'text-slate-800'}`}></i>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rocket Engine Status</p>
               <p className="text-xl font-black text-white italic uppercase tracking-tight">{phase}</p>
            </div>
            
            {phase === 'STABLE' && (
              <button 
                onClick={onComplete}
                className="w-full py-8 bg-indigo-600 text-white rounded-[40px] font-black uppercase tracking-[0.4em] text-sm shadow-2xl hover:bg-indigo-500 transition-all animate-in zoom-in-95"
              >
                RETURN TO CONSOLE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
