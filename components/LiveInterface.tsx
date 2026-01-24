
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LiveServerMessage, Modality, Blob } from '@google/genai';
import { gemini } from '../services/gemini';
import { decode, encode, decodeAudioData } from '../services/audio';

const LiveInterface: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopSession = useCallback(() => {
    setIsActive(false);
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
    
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (audioContextRef.current) {
      audioContextRef.current.input.close();
      audioContextRef.current.output.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const updateVisualizer = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);
    }
    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputAudioContext, output: outputAudioContext };

      const analyser = inputAudioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      updateVisualizer();

      const callbacks = {
        onopen: () => {
          setIsActive(true);
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e: any) => {
            if (isMuted) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const pcmBlob: Blob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };

            sessionPromiseRef.current?.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(analyser);
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => [...prev, `Gemini: ${message.serverContent!.outputTranscription!.text}`]);
          } else if (message.serverContent?.inputTranscription) {
            setTranscription(prev => [...prev, `You: ${message.serverContent!.inputTranscription!.text}`]);
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outputAudioContext) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e: any) => {
          console.error('Live API Error:', e);
          stopSession();
        },
        onclose: () => {
          setIsActive(false);
          stopSession();
        },
      };

      sessionPromiseRef.current = gemini.connectLive(callbacks, "You are a witty AI advisor within the Sovereign Node. Assist Anthony Tucker in managing wealth and logistics.");
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest italic mb-2">Voice Intelligence Grid</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">GEMINI <span className="text-indigo-500">LIVE</span></h1>
        </div>
        {isActive && (
          <div className="flex items-center gap-4 px-8 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-500 shadow-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest italic">Node Link Active</span>
          </div>
        )}
      </div>

      <div className="flex-1 iphone-card rounded-[60px] overflow-hidden flex flex-col relative border-white/5 bg-black/60 shadow-3xl">
        <div className="flex-1 p-10 overflow-y-auto space-y-8 scrollbar-hide">
          {transcription.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-16">
              <div className="relative">
                <div 
                  className="w-56 h-56 rounded-full border-2 border-white/5 flex items-center justify-center transition-all duration-300 shadow-inner"
                  style={{ transform: `scale(${1 + (audioLevel / 200)})`, borderColor: isActive ? `rgba(99, 102, 241, ${0.2 + (audioLevel / 255)})` : 'rgba(255,255,255,0.05)' }}
                >
                  <i className={`fa-solid fa-microphone text-7xl ${isActive ? 'text-indigo-500' : 'text-slate-800'} transition-colors duration-500`}></i>
                </div>
                {isActive && (
                   <>
                    <div className="absolute inset-0 w-full h-full rounded-full border border-indigo-500 animate-ping opacity-10"></div>
                    <div className="absolute -inset-10 w-full h-full rounded-full border border-indigo-500/5 blur-2xl opacity-40"></div>
                   </>
                )}
              </div>
              <div className="text-center space-y-4">
                <p className="text-slate-600 font-black uppercase tracking-[0.8em] text-[11px] italic animate-pulse">
                  {isActive ? "Sovereign node is listening..." : "Initialize voice link to consult Core."}
                </p>
                <div className="flex justify-center gap-1.5 opacity-20">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              {transcription.map((line, i) => {
                const isUser = line.startsWith('You:');
                return (
                  <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-10 py-6 rounded-[40px] font-mono text-sm leading-relaxed shadow-2xl transition-all hover:scale-[1.01] ${isUser ? 'bg-indigo-600 text-black font-black italic' : 'bg-white/5 text-slate-100 border border-white/5'}`}>
                      {line.split(': ')[1]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-12 bg-black/60 border-t border-white/5 flex justify-center items-center gap-12">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            disabled={!isActive}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all border shadow-xl ${isMuted ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-900 border-white/10 text-slate-600 hover:text-white disabled:opacity-20'}`}
          >
            <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-2xl`}></i>
          </button>

          <button 
            onClick={isActive ? stopSession : startSession}
            className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all transform active:scale-90 ${isActive ? 'bg-white text-black rotate-45 shadow-white/10' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'}`}
          >
            <i className={`fa-solid ${isActive ? 'fa-plus' : 'fa-play'}`}></i>
          </button>

          <button 
            disabled={!isActive}
            className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 text-slate-600 flex items-center justify-center hover:text-white disabled:opacity-20 shadow-xl"
          >
            <i className="fa-solid fa-waveform-lines text-2xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveInterface;
