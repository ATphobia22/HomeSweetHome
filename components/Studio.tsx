import React, { useState, useEffect } from 'react';
import { MediaAsset } from '../types';
import { gemini } from '../services/gemini';

const VEO_MESSAGES = [
  "Initializing neural weight distribution...",
  "Veo engine is crafting temporal coherence...",
  "Rendering latent space frames...",
  "Optimizing cinematic motion vectors...",
  "Synthesizing high-fidelity textures...",
  "Finalizing creative alignment...",
  "Polishing pixel-perfect transitions...",
  "Sovereign Node 21605: Output Ready."
];

interface StudioProps {
  onAssetGenerated: (asset: MediaAsset) => void;
}

const Studio: React.FC<StudioProps> = ({ onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [quality, setQuality] = useState<'standard' | 'high'>('standard');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [hasPaidKey, setHasPaidKey] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          const hasKey = await aistudio.hasSelectedApiKey();
          setHasPaidKey(hasKey);
        }
      } catch (e) {
        console.warn("Key check skipped.");
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isGenerating && type === 'video') {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % VEO_MESSAGES.length);
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, type]);

  const handleKeySelection = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        await aistudio.openSelectKey();
        // Mitigate race condition by proceeding immediately
        setHasPaidKey(true);
      }
    } catch (e) {
      console.error("Auth bridge error:", e);
    }
  };

  const generate = async () => {
    if (!prompt) return;
    
    const needsAuth = type === 'video' || quality === 'high';
    if (needsAuth && !hasPaidKey) {
      await handleKeySelection();
      return;
    }

    setIsGenerating(true);
    setPreview(null);
    setStatus(type === 'video' ? VEO_MESSAGES[0] : 'Igniting Sovereign Core...');

    try {
      let resultUrl = '';
      if (type === 'image') {
        resultUrl = await gemini.generateImage(prompt, { aspectRatio, quality });
      } else {
        resultUrl = await gemini.generateVideo(prompt, aspectRatio === '1:1' ? '16:9' : (aspectRatio as any));
      }

      setPreview(resultUrl);
      const newAsset: MediaAsset = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        url: resultUrl,
        name: `Sovereign ${type === 'image' ? 'IMG' : 'VEO'}: ${prompt.slice(0, 15)}...`,
        timestamp: Date.now(),
        description: prompt
      };
      onAssetGenerated(newAsset);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasPaidKey(false);
        setStatus('Auth invalidated. Re-selection required.');
        await handleKeySelection();
      } else {
        setStatus('Orchestration failed. Neural disruption detected.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const needsPaidKey = type === 'video' || quality === 'high';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest italic mb-2">Creative Assets Node</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">AI <span className="text-indigo-500">STUDIO</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] text-slate-700 font-black uppercase italic tracking-widest">
           <i className="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
           Imagen 3 & Veo v3.1 Ready
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="iphone-card rounded-[50px] p-10 space-y-8 bg-black/60 shadow-3xl border-white/5 relative overflow-hidden">
          <div className="scanner-line opacity-20"></div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Modality Selection</label>
            <div className="flex gap-4 p-1.5 bg-black/40 rounded-3xl border border-white/10">
              <button 
                onClick={() => setType('image')}
                className={`flex-1 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest ${type === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
              >
                <i className="fa-solid fa-image"></i> Image
              </button>
              <button 
                onClick={() => { setType('video'); setAspectRatio('16:9'); }}
                className={`flex-1 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest ${type === 'video' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
              >
                <i className="fa-solid fa-film"></i> Video
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Sovereign Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the cinematic asset..."
              className="w-full h-32 bg-black/40 border border-white/10 rounded-[30px] p-8 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-white font-mono text-lg italic shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Ratio</label>
              <select 
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 outline-none text-[11px] font-black text-white uppercase italic appearance-none"
              >
                <option value="1:1">1:1 Square</option>
                <option value="16:9">16:9 Cinema</option>
                <option value="9:16">9:16 Portrait</option>
              </select>
            </div>
            {type === 'image' && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Fidelity</label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 outline-none text-[11px] font-black text-white uppercase italic appearance-none"
                >
                  <option value="standard">Flash (Fast)</option>
                  <option value="high">Pro (Imagen 3)</option>
                </select>
              </div>
            )}
          </div>

          {needsPaidKey && !hasPaidKey && (
            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex flex-col items-center text-center gap-4 animate-in zoom-in-95">
              <p className="text-amber-200 text-[10px] font-black uppercase tracking-widest italic leading-relaxed">
                <i className="fa-solid fa-key mr-2"></i>
                Requires Paid Google Cloud Project
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="block underline mt-2">Billing Docs</a>
              </p>
              <button 
                onClick={handleKeySelection}
                className="w-full py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-amber-400 transition-all shadow-xl active:scale-95"
              >
                Authorize Paid API Key
              </button>
            </div>
          )}

          <button 
            onClick={generate}
            disabled={isGenerating || !prompt}
            className={`w-full py-8 rounded-[35px] font-black uppercase tracking-[0.4em] text-lg shadow-3xl transition-all active:scale-95 ${
              needsPaidKey && !hasPaidKey 
                ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:shadow-indigo-500/30'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-4">
                <i className="fa-solid fa-atom animate-spin"></i>
                {type === 'video' ? VEO_MESSAGES[messageIndex] : 'In Progress...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-4">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                {needsPaidKey && !hasPaidKey ? 'Authorization Required' : 'Ignite Creation'}
              </span>
            )}
          </button>
        </div>

        <div className="relative">
          <div className="w-full aspect-square rounded-[60px] border border-white/5 bg-black/80 flex flex-col items-center justify-center overflow-hidden shadow-3xl relative">
            <div className="absolute inset-0 pointer-events-none border-[30px] border-black/10"></div>
            {preview ? (
              type === 'image' ? (
                <img src={preview} alt="Alpha Output" className="w-full h-full object-cover animate-in fade-in duration-1000" />
              ) : (
                <video src={preview} controls autoPlay className="w-full h-full object-contain bg-black animate-in fade-in duration-1000" />
              )
            ) : isGenerating ? (
              <div className="flex flex-col items-center gap-10 p-12 text-center">
                <div className="relative">
                   <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                   <i className="fa-solid fa-bolt-lightning absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse text-2xl"></i>
                </div>
                <div className="space-y-4">
                  <p className="text-white font-black text-2xl italic tracking-tighter uppercase">{type === 'video' ? 'Synthesizing Cinematics' : 'Rendering Pixels'}</p>
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">{type === 'video' ? VEO_MESSAGES[messageIndex] : 'Awaiting latent space alignment...'}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 opacity-5 grayscale pointer-events-none">
                <i className="fa-solid fa-chess-king text-[15rem]"></i>
                <p className="font-black uppercase tracking-[2em] text-sm italic ml-[2em]">Canvas Idle</p>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-center gap-10 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
             <i className="fa-brands fa-nvidia text-3xl"></i>
             <i className="fa-brands fa-apple text-3xl"></i>
             <i className="fa-brands fa-google text-3xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;