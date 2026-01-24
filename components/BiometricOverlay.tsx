
import React, { useState, useEffect } from 'react';

interface BiometricOverlayProps {
  onAuthenticated: () => void;
}

const BiometricOverlay: React.FC<BiometricOverlayProps> = ({ onAuthenticated }) => {
  const [phase, setPhase] = useState<'IDLE' | 'SCANNING' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start sequence immediately
    const timer = setTimeout(() => handleScan(), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleScan = async () => {
    setPhase('SCANNING');
    
    // Simulate scan progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 60));
    }

    setPhase('VERIFYING');
    await new Promise(r => setTimeout(r, 1200));
    
    setPhase('SUCCESS');
    await new Promise(r => setTimeout(r, 1000));
    onAuthenticated();
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center p-12 overflow-hidden animate-in fade-in duration-500">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative w-full max-w-lg flex flex-col items-center gap-16">
        {/* Verification Icon Container */}
        <div className="relative group">
          <div className={`absolute -inset-16 rounded-full blur-[100px] transition-all duration-1000 ${
            phase === 'SUCCESS' ? 'bg-emerald-500/20' : 'bg-indigo-500/10'
          }`}></div>
          
          <div className={`w-64 h-64 rounded-[60px] border-2 transition-all duration-700 flex items-center justify-center relative overflow-hidden ${
            phase === 'SUCCESS' ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_100px_rgba(16,185,129,0.2)]' :
            phase === 'SCANNING' ? 'border-indigo-500 shadow-[0_0_80px_rgba(79,70,229,0.2)]' :
            'border-white/10'
          }`}>
            <div className="scanner-line opacity-40"></div>
            
            {phase === 'SUCCESS' ? (
              <i className="fa-solid fa-user-check text-8xl text-emerald-500 animate-in zoom-in duration-500"></i>
            ) : (
              <i className={`fa-solid fa-fingerprint text-8xl transition-all duration-500 ${
                phase === 'SCANNING' ? 'text-indigo-400 scale-110' : 'text-slate-800'
              }`}></i>
            )}

            {phase === 'SCANNING' && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transition-all duration-60" style={{ height: `${progress}%`, opacity: 0.1 }}></div>
            )}
          </div>

          {/* Orbiting Elements */}
          <div className="absolute -inset-8 pointer-events-none">
             <div className="w-full h-full border border-white/5 rounded-full animate-[spin_10s_linear_infinite]"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#4f46e5]"></div>
          </div>
        </div>

        <div className="text-center space-y-4 relative z-10">
          <h2 className={`text-[12px] font-black uppercase tracking-[1em] italic transition-colors duration-500 ${
            phase === 'SUCCESS' ? 'text-emerald-500' : 'text-indigo-500'
          }`}>
            {phase === 'IDLE' && 'Awaiting Biometrics'}
            {phase === 'SCANNING' && 'Scanning Identity...'}
            {phase === 'VERIFYING' && 'Verifying Node 21605...'}
            {phase === 'SUCCESS' && 'Verified'}
          </h2>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            {phase === 'SUCCESS' ? 'ANTHONY TUCKER' : 'BIOMETRIC AUTH'}
          </h1>
          <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.5em] italic">
            {phase === 'SUCCESS' ? 'Root Sovereign Access Granted' : 'Sovereign Node v12.8 Security Protocol'}
          </p>
        </div>

        {phase === 'SCANNING' && (
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase text-indigo-400 italic">
               <span>Dermal Pattern Match</span>
               <span>{progress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-20 flex gap-12 opacity-10 grayscale">
         <i className="fa-brands fa-nvidia text-4xl"></i>
         <i className="fa-solid fa-om text-4xl"></i>
         <i className="fa-solid fa-shield-halved text-4xl"></i>
      </div>
    </div>
  );
};

export default BiometricOverlay;
