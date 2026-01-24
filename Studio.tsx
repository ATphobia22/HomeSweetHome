
import React, { useState, useEffect } from 'react';
import { MediaAsset } from './types';
// Fixed the import path and ensured it targets the exported gemini instance
import { gemini } from './services/gemini';

const VEO_MESSAGES = [
  "Initializing neural weight distribution...",
  "Veo engine is crafting temporal coherence...",
  "Rendering latent space frames...",
  "Optimizing cinematic motion vectors...",
  "Synthesizing high-fidelity textures...",
  "Finalizing creative alignment...",
  "Polishing pixel-perfect transitions...",
  "Almost ready to debut in the Enclave..."
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
        console.error("Error checking API key", e);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isGenerating && type === 'video') {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % VEO_MESSAGES.length);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, type]);

  const handleKeySelection = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        await aistudio.openSelectKey();
        setHasPaidKey(true);
      }
    } catch (e) {
      console.error("Error opening key selector", e);
    }
  };

  const generate = async () => {
    if (!prompt) return;
    
    if ((type === 'video' || quality === 'high') && !hasPaidKey) {
      await handleKeySelection();
      return;
    }

    setIsGenerating(true);
    setPreview(null);
    setStatus(type === 'video' ? VEO_MESSAGES[0] : 'Contacting Gemini vision...');

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
        name: `AI ${type === 'image' ? 'Image' : 'Video'}: ${prompt.slice(0, 20)}...`,
        timestamp: Date.now(),
        description: prompt
      };
      onAssetGenerated(newAsset);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasPaidKey(false);
        setStatus('Invalid Project/Key. Please re-select.');
      } else {
        setStatus('Generation failed. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const needsPaidKey = type === 'video' || quality === 'high';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">AI Studio</h1>
        <p className="text-slate-400 mt-1">Harness the power of Gemini and Veo to create digital masterpieces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Generation Type</label>
            <div className="flex gap-4">
              <button 
                onClick={() => { setType('image'); }}
                className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${type === 'image' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
              >
                <i className="fa-solid fa-image text-2xl"></i>
                <span className="font-bold">Image</span>
              </button>
              <button 
                onClick={() => { setType('video'); setAspectRatio('16:9'); }}
                className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${type === 'video' ? 'bg-purple-600/10 border-purple-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
              >
                <i className="fa-solid fa-film text-2xl"></i>
                <span className="font-bold">Video (Veo)</span>
              </button>
            </div>
          </div>

          {type === 'image' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Model Quality</label>
              <div className="flex gap-4 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button 
                  onClick={() => setQuality('standard')}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${quality === 'standard' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}
                >
                  Standard (2.5 Flash)
                </button>
                <button 
                  onClick={() => setQuality('high')}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all ${quality === 'high' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}
                >
                  High Res (3 Pro)
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full h-32 bg-slate-900 border border-slate-800 rounded-2xl p-6 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-lg"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Aspect Ratio</label>
              <select 
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none"
              >
                <option value="1:1">1:1 Square</option>
                <option value="16:9">16:9 Cinematic</option>
                <option value="9:16">9:16 Portrait</option>
              </select>
            </div>
          </div>

          {needsPaidKey && !hasPaidKey && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/50 rounded-2xl">
              <p className="text-amber-200 text-sm mb-3">
                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                This model requires a paid Google Cloud project.
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Learn more</a>
              </p>
              <button 
                onClick={handleKeySelection}
                className="w-full py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-all"
              >
                Select Paid API Key
              </button>
            </div>
          )}

          <button 
            onClick={generate}
            disabled={isGenerating || !prompt}
            className={`w-full py-5 rounded-2xl font-extrabold text-xl shadow-xl transition-all transform active:scale-95 disabled:opacity-50 ${
              needsPaidKey && !hasPaidKey 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-900/40 hover:scale-[1.02]'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <i className="fa-solid fa-spinner animate-spin"></i>
                {type === 'video' ? VEO_MESSAGES[messageIndex] : status}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Generate Magic
              </span>
            )}
          </button>
        </div>

        <div className="relative">
          <div className="w-full aspect-square rounded-3xl border-2 border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center overflow-hidden">
            {preview ? (
              type === 'image' ? (
                <img src={preview} alt="AI Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={preview} controls className="w-full h-full object-contain bg-black" />
              )
            ) : isGenerating ? (
              <div className="flex flex-col items-center gap-6 p-8 text-center">
                <div className="relative">
                   <div className="w-24 h-24 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin"></div>
                   <i className="fa-solid fa-bolt absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse"></i>
                </div>
                <div>
                  <p className="text-white font-bold text-xl mb-1">{type === 'video' ? VEO_MESSAGES[messageIndex] : status}</p>
                  <p className="text-slate-500 text-sm">Our neural networks are weaving your creation...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-700">
                <i className="fa-solid fa-brush text-8xl opacity-10"></i>
                <p className="font-medium">Canvas Awaiting Instructions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
