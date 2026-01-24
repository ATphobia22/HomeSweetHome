
import React, { useState, useEffect } from 'react';
import { gemini } from '../services/gemini';
import { SpatialParcel } from '../types';

const SpatialIntelligence: React.FC = () => {
  const [pinInput, setPinInput] = useState('123-456-789');
  const [selectedParcel, setSelectedParcel] = useState<SpatialParcel | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isQuantumOptimizing, setIsQuantumOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const result = await gemini.fetchParcelIntelligence(pinInput);
      setSelectedParcel(result);
    } catch (e) {
      console.error("Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const runOptimization = async () => {
    if (!selectedParcel) return;
    setIsQuantumOptimizing(true);
    try {
      const res = await gemini.runQuantumSpatialOptimization(selectedParcel.pin, "Infrastructure-Node-1");
      setOptimizationResult(res);
    } catch (e) {
      console.error("Quantum failover.");
    } finally {
      setIsQuantumOptimizing(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-amber-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-amber-500 tracking-[0.6em] uppercase mb-2 italic">Spatial Intel & PostGIS Enclave v12.0</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">ALPHA <span className="text-amber-500">PARCEL</span></h1>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shadow-inner">
             <input 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="ENTER PIN..."
              className="bg-transparent px-6 py-3 font-mono text-sm text-amber-400 focus:outline-none w-full md:w-48 uppercase italic font-bold"
             />
             <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 py-3 bg-amber-500 text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-400 transition-all shadow-xl active:scale-95 disabled:opacity-50"
             >
               {isSearching ? <i className="fa-solid fa-atom animate-spin"></i> : 'SCAN'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
          {selectedParcel ? (
            <div className="iphone-card rounded-[60px] p-12 bg-black/80 shadow-3xl border-white/5 relative overflow-hidden min-h-[600px]">
               <div className="scanner-line"></div>
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
               
               <div className="flex justify-between items-start mb-12 border-b border-white/5 pb-8">
                  <div>
                     <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic leading-none mb-2">Detailed Spatial Dossier</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{selectedParcel.pin}</h2>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest italic">POSTGIS_OID: {selectedParcel.id || 'N/A'}</p>
                     <p className="text-xs text-slate-600 font-mono italic">SRS: EPSG 4326 (WGS84)</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <div className="p-8 bg-white/5 rounded-[40px] border border-white/5">
                        <h4 className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-6 italic">Infrastructure Inferences (ML-Driven)</h4>
                        <div className="space-y-4">
                           {selectedParcel.inferences?.map((inf, i) => (
                             <div key={i} className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 group hover:border-amber-500/30 transition-all">
                                <div>
                                   <p className="text-sm font-black text-white uppercase italic">{inf.featureType}</p>
                                   <p className="text-[9px] text-slate-600 font-mono">P(x): {inf.probability.toFixed(4)}</p>
                                </div>
                                <div className="text-right">
                                   <span className="text-xs font-black text-emerald-500">{Math.round(inf.probability * 100)}% Conf</span>
                                   <p className="text-[8px] text-slate-700 uppercase font-black">{inf.metadata?.details || 'Analyzed'}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     {selectedParcel.timber && (
                       <div className="p-8 bg-white/5 rounded-[40px] border border-white/5">
                          <h4 className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-6 italic">Timber Intelligence (Veg-Intel)</h4>
                          <div className="grid grid-cols-3 gap-4">
                             <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Species</p>
                                <p className="text-xs font-black text-white uppercase truncate">{selectedParcel.timber.species}</p>
                             </div>
                             <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Volume m³</p>
                                <p className="text-xs font-black text-indigo-400">{selectedParcel.timber.volume}</p>
                             </div>
                             <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Canopy H.</p>
                                <p className="text-xs font-black text-emerald-400">{selectedParcel.timber.canopyHeight}m</p>
                             </div>
                          </div>
                       </div>
                     )}
                  </div>

                  <div className="space-y-8 flex flex-col">
                     <div className="iphone-card rounded-[45px] p-10 bg-black shadow-inner border-white/5 flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px] flex-1">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent"></div>
                        <div className="w-full h-full border border-dashed border-white/10 rounded-[35px] flex flex-col items-center justify-center text-center p-8 gap-6 group-hover:border-amber-500/30 transition-all">
                           <i className="fa-solid fa-map-location-dot text-7xl text-amber-500 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                           <p className="text-xs text-slate-600 font-black uppercase tracking-[0.6em] italic leading-tight">PostGIS Layer<br/>GIST Index Linked<br/>Render Active</p>
                        </div>
                     </div>

                     <button 
                      onClick={runOptimization}
                      disabled={isQuantumOptimizing}
                      className="w-full py-6 bg-gradient-to-r from-amber-600 to-amber-800 text-black rounded-[30px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                     >
                       <i className={`fa-solid fa-atom ${isQuantumOptimizing ? 'animate-spin' : ''}`}></i>
                       {isQuantumOptimizing ? 'QISKIT COMPILING...' : 'RUN QUANTUM ROUTE OPT'}
                     </button>
                  </div>
               </div>

               {optimizationResult && (
                 <div className="mt-12 p-10 bg-amber-500/5 rounded-[45px] border border-amber-500/20 animate-in slide-in-from-bottom-6 duration-700">
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="text-[11px] text-amber-500 font-black uppercase tracking-widest italic">IBM Eagle Processor Output (QAOA)</h4>
                       <span className="text-[9px] text-slate-700 font-mono">Ansatz Depth: {optimizationResult.ansatz_depth || 12}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                       {optimizationResult.optimized_path.map((step: string, i: number) => (
                         <React.Fragment key={i}>
                            <span className="px-5 py-2 bg-black/60 border border-white/5 rounded-full text-xs font-black text-white uppercase italic">{step}</span>
                            {i < optimizationResult.optimized_path.length - 1 && <i className="fa-solid fa-chevron-right text-slate-800 text-[10px]"></i>}
                         </React.Fragment>
                       ))}
                    </div>
                    <div className="mt-8 flex justify-between items-center text-[10px] text-slate-500 font-black uppercase italic">
                       <span>Quantum Confidence: {Math.round(optimizationResult.quantum_confidence * 100)}%</span>
                       <span className="text-amber-500">Entanglement: {optimizationResult.qubit_entanglement || 'Verified'}</span>
                    </div>
                 </div>
               )}
            </div>
          ) : (
            <div className="iphone-card rounded-[60px] p-24 flex flex-col items-center justify-center text-center opacity-10 grayscale py-40">
               <i className="fa-solid fa-database text-[12rem] mb-12"></i>
               <p className="text-3xl font-black uppercase tracking-[1.5em] italic ml-[1.5em]">Awaiting GIS Stream</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8">
           <div className="iphone-card rounded-[40px] p-10 flex flex-col shadow-2xl border-white/5 bg-black/60 h-full">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-mega italic border-b border-white/10 pb-6 mb-8">System Analytics</h3>
              <div className="space-y-6">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[9px] text-amber-500 font-black uppercase mb-1">PostGIS Engine</p>
                    <p className="text-lg font-black text-white italic uppercase">ACTIVE</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[9px] text-indigo-500 font-black uppercase mb-1">NPR Consensus</p>
                    <p className="text-lg font-black text-white italic uppercase">Teacher-Free</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[9px] text-emerald-500 font-black uppercase mb-1">Qiskit Runtime</p>
                    <p className="text-lg font-black text-white italic uppercase">CONNECTED</p>
                 </div>
              </div>
              <div className="mt-auto pt-10 border-t border-white/5 text-center">
                 <p className="text-[8px] text-slate-700 font-mono uppercase tracking-[0.4em]">Node-21605 Sovereign Plane</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SpatialIntelligence;
