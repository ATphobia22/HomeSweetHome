
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/gemini';
import { VisionInsight, AlphaColorResult } from '../types';

const QuantumAILens: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<VisionInsight | null>(null);
  const [activeLayer, setActiveLayer] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Camera access required for Quantum Lens triangulation.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureAndAnalyze = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        
        stopCamera();
        setIsScanning(true);
        setScanResult(null);

        try {
          // Perform full vision analysis with simulated ToTriad AC Parametrization
          const analysis = await gemini.analyzeQuantumArbitrage(dataUrl, 'image/png');
          
          // Construct high-fidelity result
          const result: VisionInsight = {
            source: 'Node-21605-Vision',
            entities: [
              { id: '1', label: 'Primary Arbitrage Node', confidence: 0.99 },
              { id: '2', label: 'Latent Value Signal', confidence: 0.92 },
              { id: '3', label: 'Supply Chain Cluster', confidence: 0.88 }
            ],
            summary: analysis,
            acParametrization: [
              { color: '#4f46e5', intensity: 0.85, maskId: 'AC_ALPHA', entropy: 0.12 },
              { color: '#ec4899', intensity: 0.65, maskId: 'AC_BETA', entropy: 0.44 },
              { color: '#10b981', intensity: 0.45, maskId: 'AC_GAMMA', entropy: 0.08 }
            ]
          };
          
          setScanResult(result);
        } catch (e) {
          console.error(e);
        } finally {
          setIsScanning(false);
        }
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.8em] uppercase mb-4 italic leading-none">Quantum-Augmented Vision Intelligence</h2>
          <h1 className="text-5xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.7]">QUANTUM <span className="text-indigo-500">AI LENS</span></h1>
        </div>
        <div className="flex items-center gap-6 px-10 py-5 bg-black border border-indigo-500/20 rounded-[40px] shadow-3xl">
           <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
           <span className="text-[12px] font-black text-indigo-300 uppercase tracking-[0.4em] italic leading-none">LENS_STATUS: READY</span>
        </div>
      </div>

      {!isCameraActive && !scanResult && !isScanning && (
        <div className="h-[600px] iphone-card rounded-[80px] flex flex-col items-center justify-center text-center p-20 gap-12 group hover:border-indigo-500/30 transition-all cursor-pointer" onClick={startCamera}>
           <div className="relative">
              <i className="fa-solid fa-microscope text-[12rem] text-indigo-500 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"></i>
              <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full"></div>
           </div>
           <div className="space-y-4">
              <p className="text-4xl font-black text-white italic uppercase tracking-tighter">Initialize Siphon Lens</p>
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest italic max-w-lg mx-auto leading-relaxed">
                Activate the Node 21605 optical relay to perform Alpha-color parametrization and strategic asset triangulation.
              </p>
           </div>
           <button className="px-16 py-6 bg-indigo-600 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-indigo-500 active:scale-95 transition-all">
              AUTHENTICATE OPTICS
           </button>
        </div>
      )}

      {isCameraActive && (
        <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="scanner-line opacity-30"></div>
           <div className="relative w-full max-w-4xl aspect-[4/3] rounded-[60px] overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_100px_rgba(79,70,229,0.2)]">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-96 h-96 border border-indigo-500/40 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-1/2 h-1/2 border border-indigo-500/20 rounded-full"></div>
                 </div>
              </div>
           </div>
           <div className="mt-16 flex gap-10">
              <button onClick={stopCamera} className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl">
                <i className="fa-solid fa-xmark text-3xl"></i>
              </button>
              <button onClick={captureAndAnalyze} className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(79,70,229,0.4)] hover:scale-110 active:scale-95 transition-all group">
                <i className="fa-solid fa-atom group-hover:rotate-180 transition-transform duration-1000"></i>
              </button>
           </div>
        </div>
      )}

      {isScanning && (
        <div className="h-[600px] iphone-card rounded-[80px] flex flex-col items-center justify-center gap-12 py-40">
           <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_100px_rgba(79,70,229,0.2)]"></div>
           <div className="text-center space-y-6">
              <p className="text-indigo-400 font-black text-4xl uppercase tracking-[1em] animate-pulse leading-none">TRIANGULATING ALPHA...</p>
              <p className="text-slate-700 text-sm uppercase font-black tracking-[0.4em] italic">Synthesizing ToTriad Layers • Entropy Reduction Active</p>
           </div>
        </div>
      )}

      {scanResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-10 duration-1000">
           {/* Visual Layer Stack */}
           <div className="space-y-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.6em] italic leading-none">ToTriad Layer Parametrization</h3>
                 <span className="text-[9px] text-slate-700 font-mono">NODE_21605_VHD_RENDER</span>
              </div>
              
              <div className="relative h-[500px] perspective-1000 flex items-center justify-center">
                 {scanResult.acParametrization?.map((layer, i) => (
                   <div 
                    key={i}
                    onClick={() => setActiveLayer(i)}
                    className={`absolute w-full max-w-sm aspect-square rounded-[40px] border-2 transition-all duration-700 cursor-pointer shadow-3xl overflow-hidden group`}
                    style={{ 
                      backgroundColor: layer.color,
                      opacity: activeLayer === i ? 0.9 : 0.1,
                      transform: `translateZ(${i * -150}px) translateY(${i * -40}px) rotateX(45deg) rotateZ(-15deg) scale(${1 - (i * 0.1)})`,
                      borderColor: activeLayer === i ? layer.color : 'rgba(255,255,255,0.05)',
                      zIndex: 100 - i
                    }}
                   >
                      <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                         <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest">{layer.maskId}</span>
                            <i className="fa-solid fa-wave-square text-lg opacity-40"></i>
                         </div>
                         <div className="space-y-1">
                            <p className="text-2xl font-black italic tracking-tighter">Layer Entropy: {(layer.entropy * 100).toFixed(2)}%</p>
                            <p className="text-[10px] font-black opacity-40 uppercase">Intensity: {layer.intensity}</p>
                         </div>
                      </div>
                      {/* Grid Pattern Overlay */}
                      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                   </div>
                 ))}
              </div>

              <div className="flex justify-center gap-6">
                 {scanResult.acParametrization?.map((_, i) => (
                   <button 
                    key={i}
                    onClick={() => setActiveLayer(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${activeLayer === i ? 'bg-indigo-500 scale-150 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-800'}`}
                   />
                 ))}
              </div>
           </div>

           {/* Analysis Output */}
           <div className="space-y-10">
              <div className="iphone-card rounded-[60px] p-12 bg-black/80 shadow-3xl border-white/5 space-y-10 min-h-[600px] flex flex-col">
                 <div className="flex justify-between items-start border-b border-white/5 pb-8">
                    <div>
                       <p className="text-[11px] text-indigo-400 font-black uppercase tracking-widest italic mb-2">Alpha Verdict Summary</p>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Strategic Arbitrage Triangulation</h3>
                    </div>
                    <button onClick={() => setScanResult(null)} className="text-slate-700 hover:text-white transition-colors">
                       <i className="fa-solid fa-rotate-left text-xl"></i>
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide space-y-8">
                    <div className="prose prose-invert prose-xl max-w-none text-slate-300 font-mono italic leading-relaxed">
                       {scanResult.summary}
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-8">
                       {scanResult.entities.map((e, i) => (
                         <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-6">
                               <span className="text-[10px] font-black text-indigo-500 w-6">0{i+1}</span>
                               <span className="text-lg font-black text-white italic uppercase tracking-tight">{e.label}</span>
                            </div>
                            <span className="text-xs font-mono text-emerald-400">{(e.confidence * 100).toFixed(1)}% Conf</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-8 flex gap-6">
                    <button className="flex-1 py-6 bg-indigo-600 text-white rounded-[35px] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-indigo-500 transition-all active:scale-95">
                       DEPLOY ASSET NODE
                    </button>
                    <button className="px-10 py-6 bg-white/5 border border-white/10 text-slate-500 rounded-[35px] font-black uppercase tracking-widest text-[11px] hover:text-white transition-all">
                       EXPORT DOSSIER
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <style>{`
        .perspective-1000 { perspective: 1500px; }
      `}</style>
    </div>
  );
};

export default QuantumAILens;
