
import React, { useState } from 'react';
import { gemini } from '../services/gemini';
import { gitOrchestrator } from '../services/git_orchestrator';
import { SovereignRepo, AppView, AtlassianApp } from '../types';

interface SourceIntelProps {
  onViewChange?: (view: AppView) => void;
}

const SourceIntel: React.FC<SourceIntelProps> = ({ onViewChange }) => {
  const [cloneUrl, setCloneUrl] = useState('anthropics/claude-code');
  const [isCloning, setIsCloning] = useState(false);
  const [isEverythingActive, setIsEverythingActive] = useState(false);
  const [everythingLogs, setEverythingLogs] = useState<string[]>([]);
  const [gitStatus, setGitStatus] = useState<string[]>([]);
  
  const [repos, setRepos] = useState<SovereignRepo[]>([
    {
      id: 'r1',
      name: 'tucker-inc/sovereign-node',
      url: 'github.com/tucker-inc/sovereign-node',
      status: 'READY',
      stars: 1240,
      lastCommit: '2 hours ago',
      language: 'TypeScript',
      siphonedLogic: ['NPR_ENGINE_v1.0', 'POSTGIS_SYNC', 'QISKIT_WRAPPERS']
    }
  ]);
  const [discoveredApps, setDiscoveredApps] = useState<AtlassianApp[]>([
    {
      key: "gitkraken.git-integration-for-jira",
      name: "Git Integration for Jira (Azure DevOps, GitHub, GitLab)",
      vendor: "GitKraken",
      products: ["jira-cloud", "jira-dc"],
      tags: ["git", "integration", "devops"],
      installs: 9531,
      trust_signals: ["cloud-fortified", "partner-supported"]
    }
  ]);

  const [selectedRepo, setSelectedRepo] = useState<SovereignRepo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState<any>(null);
  const [siphonProgress, setSiphonProgress] = useState<{ active: boolean; file: string; buffered: number }>({ active: false, file: '', buffered: 0 });

  const handleClone = async () => {
    if (!cloneUrl) return;
    setIsCloning(true);
    await new Promise(r => setTimeout(r, 1000));
    const newRepo: SovereignRepo = {
      id: Math.random().toString(36).substr(2, 9),
      name: cloneUrl,
      url: `github.com/${cloneUrl}`,
      status: 'CLONING',
      stars: Math.floor(Math.random() * 5000),
      lastCommit: 'Just now',
      language: 'Analyzing...',
      siphonedLogic: []
    };
    setRepos(prev => [newRepo, ...prev]);
    await new Promise(r => setTimeout(r, 2000));
    setRepos(prev => prev.map(r => r.id === newRepo.id ? { ...r, status: 'READY', language: 'JavaScript' } : r));
    setIsCloning(false);
    setCloneUrl('');
  };

  const handleGitRocketLaunch = () => {
    if (onViewChange) onViewChange(AppView.MISSION_CONTROL);
  };

  const handleGitStatus = () => {
    const status = gitOrchestrator.getGitStatus('Node-21605');
    setGitStatus(status);
    setEverythingLogs([]); // Clear logs when status is clicked
    setSelectedRepo(null); // Clear main view
    setAnalysisOutput(null);
  };

  const handleGitEverything = async () => {
    setIsEverythingActive(true);
    setGitStatus([]);
    setEverythingLogs(["[INIT] INITIALIZING GLOBAL DISCOVERY RITUAL..."]);
    
    const result = await gitOrchestrator.runGitEverything();
    setEverythingLogs(prev => [
      ...prev,
      ...result.scanned,
      `[COMPLETE] Discovered ${result.discovered} repository nodes across all endpoints.`,
      `[COMPLETE] Scan concluded in ${result.time}.`
    ]);
    setIsEverythingActive(false);
  };

  const analyzeRepo = async (repo: SovereignRepo) => {
    setSelectedRepo(repo);
    setGitStatus([]);
    setEverythingLogs([]);
    setIsAnalyzing(true);
    setAnalysisOutput(null);
    try {
      const data = await gemini.runRepoAnalysis(repo.name);
      setAnalysisOutput(data);
      setRepos(prev => prev.map(r => r.id === repo.id ? { ...r, siphonedLogic: data.patterns } : r));
    } catch (e) {
      console.error("Source scan disrupted.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 font-mono">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.6em] uppercase mb-2 italic leading-none">Sovereign Source Intelligence v12.8</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">SOURCE <span className="text-indigo-500">INTEL</span></h1>
        </div>
        <div className="flex flex-wrap gap-4 justify-end">
           <button 
            onClick={handleGitRocketLaunch}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[25px] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95 flex items-center gap-3"
           >
             <i className="fa-solid fa-rocket animate-pulse"></i>
             ROCKET LAUNCH
           </button>
           <button 
            onClick={handleGitEverything}
            disabled={isEverythingActive}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-[25px] font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3"
           >
             <i className={`fa-solid fa-earth-americas ${isEverythingActive ? 'animate-spin' : ''}`}></i>
             GIT EVERYTHING
           </button>
           <button 
            onClick={handleGitStatus}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-[25px] font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3"
           >
             <i className="fa-solid fa-terminal"></i>
             GIT STATUS
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-10">
           <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Target Repositories</h3>
              <div className="space-y-4">
                {repos.map(repo => (
                  <div key={repo.id} onClick={() => analyzeRepo(repo)} className={`iphone-card rounded-3xl p-6 border-white/5 cursor-pointer transition-all hover:scale-[1.02] ${selectedRepo?.id === repo.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-black/40'}`}>
                      <h4 className="text-white font-black italic uppercase text-sm truncate leading-none">{repo.name}</h4>
                      <p className="text-[9px] text-slate-600 font-mono mt-2">{repo.language} • {repo.lastCommit}</p>
                  </div>
                ))}
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest italic border-b border-indigo-500/10 pb-4">Atlassian Discovery</h3>
              <div className="space-y-4">
                 {discoveredApps.map(app => (
                   <div key={app.key} className="iphone-card rounded-3xl p-6 bg-indigo-600/5 border border-indigo-500/10 group hover:bg-indigo-600/10 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <i className="fa-brands fa-atlassian text-indigo-500"></i>
                         <span className="text-[8px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded italic">MARKETPLACE</span>
                      </div>
                      <h5 className="text-xs font-black text-white uppercase italic leading-tight group-hover:text-indigo-400 transition-colors">{app.name}</h5>
                      <div className="mt-4 flex flex-wrap gap-2">
                         {app.trust_signals.map(sig => (
                           <span key={sig} className="text-[7px] font-black text-slate-500 uppercase border border-white/5 px-2 py-0.5 rounded">{sig}</span>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-3">
          {(selectedRepo || analysisOutput || gitStatus.length > 0 || everythingLogs.length > 0) ? (
            <div className="iphone-card rounded-[60px] p-10 md:p-16 bg-black/80 shadow-3xl border-white/5 relative overflow-hidden min-h-[750px] flex flex-col">
               <div className="scanner-line opacity-20"></div>
               
               <div className="flex justify-between items-start mb-12 border-b border-white/5 pb-8 relative z-10">
                  <div>
                     <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic leading-none mb-3">
                        {gitStatus.length > 0 ? 'Sovereign Shell :: git status' : 
                         everythingLogs.length > 0 ? 'Global Siphon :: Deep Scan' :
                         'Architectural Blueprint :: Siphon Node'}
                     </p>
                     <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        {gitStatus.length > 0 ? 'LOCAL_STATUS' : 
                         everythingLogs.length > 0 ? 'GIT EVERYTHING' :
                         selectedRepo?.name || 'Sovereign Node Capture'}
                     </h2>
                  </div>
               </div>

               <div className="space-y-12 relative z-10 flex-1 flex flex-col">
                  {gitStatus.length > 0 && (
                    <div className="p-10 bg-[#020202] rounded-[50px] border border-white/5 font-mono text-sm leading-relaxed text-indigo-200/80 shadow-inner overflow-y-auto max-h-[500px] scrollbar-hide animate-in fade-in duration-500">
                       {gitStatus.map((line, i) => (
                         <div key={i} className={`mb-1 ${line.includes('modified:') ? 'text-amber-500' : line.includes('new file:') ? 'text-emerald-500' : 'opacity-60'}`}>
                           {line}
                         </div>
                       ))}
                    </div>
                  )}

                  {everythingLogs.length > 0 && (
                    <div className="p-10 bg-[#020202] rounded-[50px] border border-white/5 font-mono text-sm leading-relaxed text-indigo-200/80 shadow-inner overflow-y-auto max-h-[500px] scrollbar-hide animate-in slide-in-from-bottom-4 duration-500">
                       {everythingLogs.map((log, i) => (
                         <div key={i} className="mb-2 flex gap-6">
                            <span className="text-slate-800 select-none w-10 text-right italic">{i + 1}</span>
                            <span className={log.startsWith('[COMPLETE]') ? 'text-emerald-400 font-black italic' : log.startsWith('[INIT]') ? 'text-cyan-400' : ''}>
                               {log}
                            </span>
                         </div>
                       ))}
                       {isEverythingActive && <div className="mt-4 animate-pulse text-indigo-500 italic">Siphoning manifest metadata...</div>}
                    </div>
                  )}

                  {isAnalyzing ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-10 py-32 opacity-30">
                       <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                       <p className="text-indigo-400 font-black text-2xl uppercase tracking-[1em] animate-pulse">Mapping Logic Structures...</p>
                    </div>
                  ) : analysisOutput ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-1000">
                       <div className="space-y-8">
                          <div className="p-10 bg-indigo-500/5 rounded-[50px] border border-indigo-500/10">
                             <h4 className="text-[11px] text-indigo-400 font-black uppercase mb-8 italic border-b border-indigo-500/10 pb-4">Extracted Logic Units</h4>
                             <div className="space-y-4">
                                {analysisOutput.patterns.map((p: string, i: number) => (
                                  <div key={i} className="flex items-center gap-5 text-white text-base font-black italic uppercase leading-tight group hover:translate-x-2 transition-transform">
                                     <div className="w-2 h-2 bg-indigo-500 rounded-full group-hover:scale-150 transition-all"></div>
                                     {p.replace(/[\*\-]/g, '').trim()}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="font-mono text-sm leading-relaxed text-slate-400 italic bg-[#020202] p-12 rounded-[60px] border border-white/5 overflow-y-auto max-h-[600px] scrollbar-hide">
                          <div dangerouslySetInnerHTML={{ __html: analysisOutput.summary.replace(/\n/g, '<br/>') }} />
                       </div>
                    </div>
                  ) : null}
               </div>
            </div>
          ) : (
            <div className="iphone-card rounded-[80px] p-24 flex flex-col items-center justify-center text-center opacity-10 grayscale py-40 h-full border-white/5 bg-black/40">
               <i className="fa-solid fa-folder-tree text-[15rem] mb-16"></i>
               <p className="text-4xl font-black uppercase tracking-[2em] italic ml-[2em]">Awaiting Source</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceIntel;
