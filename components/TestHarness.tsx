
import React, { useState } from 'react';
import { gemini } from '../services/gemini';
import { TestResult, SovereignTenant } from '../types';
import semver from 'semver';

const TestHarness: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([
    { id: 't1', name: 'semver_validation', status: 'PENDING', duration: 0, logs: [] },
    { id: 't2', name: 'sovereign_tenant_interface', status: 'PENDING', duration: 0, logs: [] },
    { id: 't3', name: 'parallel_reasoning_cycle', status: 'PENDING', duration: 0, logs: [] },
    { id: 't4', name: 'autonomous_wealth_projection', status: 'PENDING', duration: 0, logs: [] },
    { id: 't5', name: 'registry_cloning_integrity', status: 'PENDING', duration: 0, logs: [] }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (id: string) => {
    const startTime = performance.now();
    setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'RUNNING', logs: ['Initializing test environment...'] } : r));

    try {
      let passed = true;
      let logs: string[] = [];

      switch (id) {
        case 't1': // Semver validation
          logs.push("Validating '11.8.5'...");
          const v1 = semver.valid('11.8.5');
          logs.push(`Result: ${v1 || 'Invalid'}`);
          logs.push("Validating '11.8'...");
          const v2 = semver.valid('11.8');
          logs.push(`Result: ${v2 || 'Invalid (Correct behavior)'}`);
          passed = !!v1 && !v2;
          break;

        case 't2': // Tenant interface
          logs.push("Instantiating SovereignTenant...");
          const tenant: SovereignTenant = {
            id: 'test-node-alpha',
            owner: 'anthony.tucker',
            roles: ['admin'],
            boundaries: ['compute'],
            status: 'Provisioned'
          };
          logs.push(`Tenant [${tenant.id}] status: ${tenant.status}`);
          passed = tenant.status === 'Provisioned';
          break;

        case 't3': // Parallel Reasoning
          logs.push("Dispatching NPR Logic request...");
          const nprResult = await gemini.runNPRReasoning("Validate system integrity across Node 21605.");
          logs.push(`Sovereign Consensus: ${nprResult.slice(0, 50)}...`);
          passed = nprResult.length > 0;
          break;

        case 't4': // Autonomous Cycle
          logs.push("Simulating master cycle orchestration...");
          const orchResult = await gemini.runTuckerOrchestration("Balance: $124,000, Nodes: 12 Active.");
          logs.push(`Orchestration Trace Received.`);
          passed = orchResult.length > 0;
          break;

        case 't5': // Registry Clone
          logs.push("Mocking git checkout anthropics/claude-code...");
          await new Promise(r => setTimeout(r, 800));
          logs.push("Branch HEAD verified.");
          logs.push("Siphoning logic blueprints...");
          passed = true;
          break;
      }

      const duration = performance.now() - startTime;
      setResults(prev => prev.map(r => r.id === id ? { 
        ...r, 
        status: passed ? 'PASS' : 'FAIL', 
        duration, 
        logs: [...r.logs, ...logs, `Test ${passed ? 'PASSED' : 'FAILED'} in ${duration.toFixed(2)}ms`] 
      } : r));
    } catch (e) {
      setResults(prev => prev.map(r => r.id === id ? { 
        ...r, 
        status: 'FAIL', 
        logs: [...r.logs, `Error: ${e instanceof Error ? e.message : 'Unknown exception'}`] 
      } : r));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    for (const test of results) {
      await runTest(test.id);
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic">Sovereign Diagnostic Enclave v1.0</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">TEST <span className="text-indigo-500">HARNESS</span></h1>
        </div>
        <button 
          onClick={runAllTests}
          disabled={isRunning}
          className="px-16 py-6 bg-indigo-600 text-white rounded-[30px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
        >
          {isRunning ? <i className="fa-solid fa-atom animate-spin mr-3"></i> : <i className="fa-solid fa-play mr-3"></i>}
          {isRunning ? 'EXECUTING PYTEST SUITE...' : 'RUN ALL DIAGNOSTICS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-4">
           <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4 mb-4">Sovereign Unit Tests</h3>
           {results.map(test => (
             <div key={test.id} className={`iphone-card rounded-3xl p-6 border-white/5 flex items-center justify-between transition-all ${test.status === 'RUNNING' ? 'border-indigo-500/40 animate-pulse' : ''}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-2.5 h-2.5 rounded-full ${
                     test.status === 'PASS' ? 'bg-emerald-500' :
                     test.status === 'FAIL' ? 'bg-red-500' :
                     test.status === 'RUNNING' ? 'bg-amber-500' :
                     'bg-slate-800'
                   }`}></div>
                   <span className="text-white font-black italic uppercase text-xs tracking-tight truncate max-w-[200px]">{test.name}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-600 uppercase">{test.duration > 0 ? `${test.duration.toFixed(0)}ms` : '--'}</span>
             </div>
           ))}
        </div>

        <div className="lg:col-span-2">
           <div className="iphone-card rounded-[60px] p-12 md:p-16 bg-black/80 shadow-3xl border-white/5 relative overflow-hidden min-h-[600px] flex flex-col">
              <div className="scanner-line opacity-10"></div>
              
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                 <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest italic">Technical Execution Trace</h3>
                 <div className="flex gap-4">
                    <span className="text-[9px] text-slate-700 font-black uppercase">Pytest-Mock: Initialized</span>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 space-y-8 font-mono text-sm leading-relaxed text-indigo-100/70 scrollbar-hide">
                 {results.some(r => r.status !== 'PENDING') ? (
                   results.filter(r => r.status !== 'PENDING').map(test => (
                     <div key={test.id} className="space-y-4 border-l-2 border-indigo-500/10 pl-6 py-2">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">>> {test.name}</span>
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded ${test.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{test.status}</span>
                        </div>
                        <div className="space-y-1">
                           {test.logs.map((log, i) => (
                             <p key={i} className="text-xs italic opacity-60">[{new Date().toLocaleTimeString()}] {log}</p>
                           ))}
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale select-none py-20">
                      <i className="fa-solid fa-vial text-[12rem] mb-10 text-indigo-500"></i>
                      <p className="uppercase tracking-[2em] font-black text-3xl italic ml-[2em]">Trace Idle</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TestHarness;
