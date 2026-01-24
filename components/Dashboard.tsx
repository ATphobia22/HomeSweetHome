
import React, { useState, useRef, useEffect } from 'react';
import { MediaAsset } from '../types';
import { gemini } from '../services/gemini';

interface DashboardProps {
  assets: MediaAsset[];
  onAddAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assets, onAddAsset, onDeleteAsset }) => {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
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
      console.error("Camera access denied", err);
      alert("Sovereign permission for camera is required for mobile scanning.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        
        const newAsset: MediaAsset = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          url: dataUrl,
          name: `Scan_${new Date().toLocaleTimeString()}`,
          timestamp: Date.now(),
        };
        
        onAddAsset(newAsset);
        analyzeForProfit(newAsset);
        stopCamera();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      const newAsset: MediaAsset = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'image',
        url: result,
        name: file.name,
        timestamp: Date.now(),
      };
      onAddAsset(newAsset);
    };
    reader.readAsDataURL(file);
  };

  const analyzeForProfit = async (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setIsAnalyzing(true);
    setReport('');
    try {
      const res = await gemini.analyzeQuantumArbitrage(asset.url, 'image/png');
      setReport(res || "Analysis failed.");
    } catch (err) {
      setReport("Quantum link disrupted. Retry requested.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-cyan-500/10 pb-10">
        <div>
          <h2 className="text-sm font-black text-cyan-500 tracking-[0.4em] uppercase mb-2">Supply Logistics</h2>
          <h1 className="text-5xl font-black text-white italic tracking-tighter">INVENTORY <span className="text-cyan-500">SCOUT</span></h1>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={startCamera}
            className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all shadow-xl"
          >
            <i className="fa-solid fa-camera"></i>
            <span>Live Scan</span>
          </button>
          
          <label className="cursor-pointer">
            <div className="flex items-center gap-3 bg-cyan-500 text-black px-8 py-4 rounded-lg font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <i className="fa-solid fa-upload"></i>
              <span>Upload</span>
            </div>
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
        </div>
      </div>

      {isCameraActive && (
        <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
           <div className="relative w-full max-w-2xl aspect-[3/4] rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20">
                 <div className="w-full h-full border-2 border-dashed border-cyan-500/50 rounded-xl relative">
                    <div className="scanner-line"></div>
                 </div>
              </div>
           </div>
           <div className="mt-12 flex gap-8">
              <button 
                onClick={stopCamera}
                className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"
              >
                <i className="fa-solid fa-xmark text-3xl"></i>
              </button>
              <button 
                onClick={captureFrame}
                className="w-24 h-24 rounded-full bg-cyan-500 text-black flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-110 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-circle-notch animate-pulse"></i>
              </button>
           </div>
           <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer"
            onClick={() => analyzeForProfit(asset)}
          >
            <img src={asset.url} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="p-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase truncate pr-4">{asset.name}</span>
              <button className="text-cyan-500/30 group-hover:text-cyan-500">
                <i className="fa-solid fa-bolt-lightning"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-6xl bg-[#020617] border border-cyan-500/20 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(6,182,212,0.1)]">
            <div className="md:w-1/2 bg-black flex items-center justify-center p-8 border-r border-cyan-500/10">
              <img src={selectedAsset.url} className="max-w-full max-h-[60vh] object-contain shadow-2xl" />
            </div>
            
            <div className="md:w-1/2 p-10 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-cyan-500 font-black text-[10px] tracking-widest uppercase mb-1">Arbitrage Analysis</h3>
                  <h2 className="text-3xl font-black text-white italic uppercase">{selectedAsset.name}</h2>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-2xl"></i></button>
              </div>

              <div className="flex-1 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6 font-mono text-sm leading-relaxed overflow-y-auto">
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-cyan-500/20 rounded animate-pulse"></div>
                    <div className="h-4 bg-cyan-500/20 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-cyan-500/20 rounded animate-pulse w-5/6"></div>
                  </div>
                ) : (
                  <div className="text-cyan-100 whitespace-pre-wrap">{report}</div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button className="bg-cyan-500 text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-400 shadow-lg shadow-cyan-900/20 transition-all">
                  Setup Storefront
                </button>
                <button className="border border-cyan-500/30 text-cyan-500 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-500/10 transition-all">
                  Find Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
