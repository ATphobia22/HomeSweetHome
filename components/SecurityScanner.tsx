
import React, { useState } from 'react';
import { gemini } from '../services/gemini';

const SecurityScanner: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.216');
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState('');
  const [detectedPorts, setDetectedPorts] = useState<number[]>([]);

  const handleScan = async () => {
    setIsScanning(true);
    setReport('');
    setDetectedPorts([]);
    
    // Simulating port discovery sequence
    await new Promise(r => setTimeout(r, 1500));
    const ports = [80, 443, 8080].filter(() => Math.random() > 0.3);
    setDetectedPorts(ports);

    try {
      const res = await gemini.runSecuritySweep(ip, ports);
      setReport(res);
    } catch (e) {
      setReport("Security node disrupted. Vault remains secure.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-red-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-red-500 tracking-[0.6em] uppercase mb-2 italic">Infrastructure Security Sweep v4.2</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">INTEGRITY <span className="text-red-500">SCAN</span></h1>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-inner">
             <input 
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="TARGET IP..."
              className="bg-transparent px-6 py-3 font-mono text-sm text-red-400 focus:outline-none w-full md:w-64 uppercase italic font-bold placeholder:text-red-950"
             />
             <button 
              onClick={handleScan}
              disabled={isScanning}
              className="px-10 py-3 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
             >
               {isScanning ? <i className="fa-solid fa-atom animate-spin"></i> : 'INITIATE SWEEP'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
           <div className="iphone-card rounded-[40px] p-8 space-y-8 bg-black/60 border-white/5 h-full">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Target Intel</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[8px] text-slate-700 font-black uppercase">Gateway Status</label>
                    <p className="text-xs font-black text-emerald-500 uppercase italic flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Active Zero-Trust
                    </p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] text-slate-700 font-black uppercase">Open Node Inferences</label>
                    <div className="flex flex-wrap gap-2">
                       {detectedPorts.length > 0 ? detectedPorts.map(p => (
                         <span key={p} className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md font-mono text-[9px] border border-red-500/20">{p}</span>
                       )) : <span className="text-[10px] text-slate-800 italic">No nodes detected</span>}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3">
          <div className="iphone-card rounded-[60px] p-10 md:p-16 min-h-[600px] relative overflow-hidden flex flex-col bg-black/80 shadow-3xl border-white/5">
             <div className="scanner-line opacity-40 animate-[scan_1.5s_infinite]"></div>
             
             <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide font-mono">
                {isScanning ? (
                  <div className="h-full flex flex-col items-center justify-center gap-10 py-32 opacity-30">
                     <div className="w-20 h-20 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                     <p className="text-red-400 font-black text-xl uppercase tracking-[0.8em] animate-pulse">Scanning Integrity Rails...</p>
                  </div>
                ) : report ? (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="p-8 bg-red-500/5 rounded-[40px] border border-red-500/20 text-sm leading-relaxed text-red-100/80 italic prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-5 grayscale select-none py-20 text-center">
                     <i className="fa-solid fa-shield-halved text-[15rem] mb-10 text-red-500"></i>
                     <p className="uppercase tracking-[2em] font-black text-4xl italic ml-[2em]">Vault Secure</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScanner;
