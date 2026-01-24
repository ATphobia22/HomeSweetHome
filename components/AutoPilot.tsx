
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/gemini';
import { AutonomousLog } from '../types';

interface AutoPilotProps {
  onAddProfit: (amt: number) => void;
}

const AutoPilot: React.FC<AutoPilotProps> = ({ onAddProfit }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<AutonomousLog[]>([]);
  const [cycleData, setCycleData] = useState<string>('');
  const [activeNodes, setActiveNodes] = useState<{name: string, status: string, color: string, icon: string}[]>([
    { name: 'OPENAI-STRATEGY', status: 'IDLE', color: 'text-blue-500', icon: 'fa-brain' },
    { name: 'IBM-LOGISTICS', status: 'IDLE', color: 'text-indigo-500', icon: 'fa-truck-fast' },
    { name: 'GROK-SOCIAL', status: 'IDLE', color: 'text-magenta-500', icon: 'fa-radar' },
    { name: 'VAULT-SECURE', status: 'SECURE', color: 'text-emerald-500', icon: 'fa-lock' }
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (action: string, details: string, status: 'executing' | 'success' | 'warning' = 'executing') => {
    const newLog: AutonomousLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      action,
      details,
      status
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const updateNode = (name: string, status: string) => {
    setActiveNodes(prev => prev.map(node => node.name === name ? { ...node, status } : node));
  };

  const startTuckerCycle = async () => {
    setIsRunning(true);
    setCycleData('');
    addLog("IGNITION", `Authenticating Anthony J. Tucker Node via IBM Shield [${new Date().toLocaleTimeString()}]`);
    
    try {
      updateNode('IBM-LOGISTICS', 'OPTIMIZING');
      addLog("LOGISTICS", "Optimizing Air-Express routes via IBM reliability nodes...");
      await gemini.getIBMTechnicalSweep();
      updateNode('IBM-LOGISTICS', 'READY');

      updateNode('GROK-SOCIAL', 'SCANNING');
      addLog("SOCIAL-PULSE", "Injecting Grok-Alpha social sentiment for $10-$5000 units...");
      await new Promise(r => setTimeout(r, 1000));
      updateNode('GROK-SOCIAL', 'ADS DEPLOYED');

      updateNode('OPENAI-STRATEGY', 'STRATEGIZING');
      addLog("OPENAI-CORE", "Orchestrating strategic arbitrage pivots via patent moats...");
      await new Promise(r => setTimeout(r, 1200));
      updateNode('OPENAI-STRATEGY', 'LOCKED');

      updateNode('VAULT-SECURE', 'SETTLING');
      addLog("QUANTUM", "Siphoning surplus to Heritage Federal Node 21605...");
      const plan = await gemini.runTuckerOrchestration(`IBM Logistics verified. Ads deployed. Retain $1000 seed.`);
      setCycleData(plan);
      
      const dailyYield = Math.floor(Math.random() * 10000) + 5000 + 0.55;
      await new Promise(r => setTimeout(r, 2000));
      
      addLog("SETTLEMENT", `Success: $${dailyYield.toLocaleString()} settled to Heritage Bank.`);
      onAddProfit(dailyYield);
      
      updateNode('VAULT-SECURE', 'SECURE');
      updateNode('OPENAI-STRATEGY', 'IDLE');
      updateNode('IBM-LOGISTICS', 'IDLE');
      updateNode('GROK-SOCIAL', 'IDLE');
      addLog("CYCLE-END", `Sovereign Cycle Finished [${new Date().toLocaleTimeString()}]`, 'success');
    } catch (e) {
      addLog("ERR-REROUTE", "Interference detected. Rerouting via IBM Quantum...", 'warning');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const formatDate = (ts: number) => new Date(ts).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'short' });

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.5em] uppercase mb-1">Chief Executive AI Engine</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">TUCKER <span className="text-indigo-500">INC</span></h1>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex flex-col items-center justify-center px-8 py-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
             <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Retained Seed</p>
             <p className="text-2xl font-black text-indigo-500 italic">$1,000.00</p>
          </div>
          <button 
            onClick={startTuckerCycle}
            disabled={isRunning}
            className={`flex-[2] md:flex-none px-16 py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl text-sm ${
              isRunning ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white hover:scale-[1.02]'
            }`}
          >
            {isRunning ? 'AGENT ACTIVE' : 'IGNITE DAILY CYCLE'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeNodes.map(node => (
          <div key={node.name} className="iphone-card rounded-3xl p-6 border border-white/5 flex flex-col items-center text-center">
            <i className={`fa-solid ${node.icon} ${node.status === 'IDLE' ? 'text-slate-700' : node.color} mb-3 text-lg`}></i>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{node.name}</span>
            <span className={`text-[11px] font-black italic tracking-tighter ${node.status === 'IDLE' ? 'text-slate-800' : `${node.color} animate-pulse`}`}>
              {node.status}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="iphone-card rounded-[40px] p-8 md:p-16 min-h-[500px] md:min-h-[700px] font-mono relative overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
               <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest italic flex items-center gap-3">
                 <i className={`fa-solid fa-microchip ${isRunning ? 'animate-spin' : ''}`}></i>
                 Tucker Incorporated: Execution Projection
               </h3>
               <span className="text-[10px] text-slate-600 font-black uppercase italic">Direct Siphon: Node 21605</span>
            </div>

            <div className="flex-1 overflow-y-auto text-sm md:text-base leading-relaxed text-indigo-100/90 pr-4">
              {isRunning ? (
                <div className="space-y-10 py-6">
                   <div className="flex items-center gap-6 text-indigo-500 font-black text-sm uppercase italic">
                      <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      Encrypting Sovereign Settlement Chain...
                   </div>
                </div>
              ) : cycleData ? (
                <div className="prose prose-invert prose-indigo max-w-none text-xs md:text-sm">
                   <div className="bg-black/60 p-8 rounded-[40px] border border-white/5 font-mono shadow-inner leading-relaxed">
                      <div className="mb-4 text-[9px] text-indigo-500 font-black uppercase italic tracking-widest border-b border-indigo-500/10 pb-4">
                        STAMPED: {formatDate(Date.now())}
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: cycleData.replace(/\n/g, '<br/>') }} />
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center px-10">
                   <i className="fa-solid fa-satellite-dish text-[12rem] mb-10"></i>
                   <p className="uppercase tracking-[1.2em] font-black text-sm italic">Awaiting Master Auth: Anthony J. Tucker</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="iphone-card rounded-[40px] p-10 h-[400px] md:h-[700px] flex flex-col shadow-2xl">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Sovereign Settlement Ledger</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-[10px]">
              {logs.map((log) => (
                <div key={log.id} className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex justify-between font-black uppercase italic">
                    <span className={log.status === 'success' ? 'text-emerald-500' : 'text-indigo-500'}>{log.action}</span>
                    <span className="text-slate-700 font-mono text-[8px]">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="text-slate-500 leading-tight text-[11px]">{log.details}</p>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPilot;
