
import React, { useState } from 'react';

interface PayoutCenterProps {
  balance: number;
}

const PayoutCenter: React.FC<PayoutCenterProps> = ({ balance }) => {
  const goal = 1000000;
  const progress = (balance / goal) * 100;

  const cards = [
    { type: 'Visa', last4: '4092', color: 'bg-gradient-to-br from-blue-700 to-blue-900', issuer: 'CHASE SAPPHIRE' },
    { type: 'Mastercard', last4: '2105', color: 'bg-gradient-to-br from-slate-800 to-black', issuer: 'APPLE CARD' },
    { type: 'AMEX', last4: '8810', color: 'bg-gradient-to-br from-amber-600 to-amber-900', issuer: 'PLATINUM' },
  ];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000 pb-24 md:pb-0">
      {/* Security Status Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
         <div className="flex items-center gap-4">
            <div className="relative">
              <i className="fa-solid fa-shield-halved text-emerald-500 text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">IBM Zero-Trust Shield Active</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase italic">AES-256 Quantum Encryption Layer Verified</span>
            </div>
         </div>
         <div className="hidden sm:flex gap-4 text-slate-600 text-[9px] font-black uppercase">
            <span className="flex items-center gap-1"><i className="fa-solid fa-lock text-[8px]"></i> TLS 1.3</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-shield-check text-[8px]"></i> PCI-DSS v4.0</span>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-emerald-500/10 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-emerald-500 tracking-[0.5em] uppercase mb-1">Sovereign Settlement Gateway</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">GLOBAL <span className="text-emerald-500">PAY</span></h1>
        </div>
        <div className="w-full md:w-auto text-left md:text-right space-y-2">
           <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] italic">AUTH: ANTHONY JOHN TUCKER</p>
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
              <i className="fa-solid fa-building-columns text-slate-500 text-xs"></i>
              <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase italic">Heritage Federal Node 21605</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Main Balance Card */}
          <div className="iphone-card rounded-[40px] md:rounded-[60px] p-10 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
              <div className="text-left">
                <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.6em] mb-6 italic">Liquid Arbitrage Capital</p>
                <div className="flex items-start">
                  <span className="text-3xl md:text-5xl font-black text-emerald-500/40 mt-2 mr-2">$</span>
                  <p className="text-7xl md:text-[10rem] font-black text-white tracking-tighter italic leading-none">
                    {balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </p>
                </div>
              </div>
              <button className="w-full md:w-auto bg-emerald-500 text-black px-16 py-8 rounded-[35px] font-black uppercase tracking-[0.3em] text-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all">
                SETTLE
              </button>
            </div>

            <div className="mt-16 md:mt-24 pt-12 border-t border-white/5">
              <div className="flex justify-between items-end mb-6">
                 <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Millionaire Node Velocity</h4>
                 <span className="text-emerald-500 font-black text-lg italic">{progress.toFixed(2)}%</span>
              </div>
              <div className="w-full h-4 bg-black/60 rounded-full overflow-hidden p-1 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-800 via-emerald-500 to-emerald-300 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(52,211,153,0.4)]" 
                  style={{width: `${progress}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* Payment Merchant Grid */}
          <div className="iphone-card rounded-[40px] md:rounded-[50px] p-10">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-10 italic">Authorized Merchant Nodes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cards.map((card, i) => (
                <div key={i} className={`p-8 rounded-[35px] ${card.color} text-white shadow-2xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all`}>
                  <div className="absolute top-0 right-0 p-6 opacity-20">
                    <i className="fa-solid fa-signal-stream rotate-90 text-2xl"></i>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-10 opacity-70 italic">{card.issuer}</p>
                  <div className="flex justify-between items-end">
                    <p className="font-mono text-xl font-bold tracking-widest">•••• {card.last4}</p>
                    <i className={`fa-brands ${card.type === 'Visa' ? 'fa-cc-visa' : card.type === 'Mastercard' ? 'fa-cc-mastercard' : 'fa-cc-amex'} text-3xl opacity-80`}></i>
                  </div>
                </div>
              ))}
              <div className="p-8 rounded-[35px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600 hover:border-emerald-500/40 hover:text-emerald-500 transition-all cursor-pointer group">
                <i className="fa-solid fa-plus-circle text-4xl mb-3 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                <span className="text-[11px] font-black uppercase tracking-widest italic">Link Payment Node</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Matrix Sidebar */}
        <div className="space-y-8">
          <div className="iphone-card rounded-[40px] p-10 flex flex-col shadow-2xl border-emerald-500/10">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">Cybersecurity Matrix</h3>
            <div className="space-y-5">
              {[
                { label: 'IBM Cloud Shield', status: 'VERIFIED', color: 'text-blue-500', icon: 'fa-server' },
                { label: 'AES-256 Siphon', status: 'ENCRYPTED', color: 'text-emerald-500', icon: 'fa-vault' },
                { label: 'Zero-Trust Node', status: 'HARDENED', color: 'text-cyan-500', icon: 'fa-key' },
                { label: 'Grok Threat Scan', status: 'CLEAN', color: 'text-magenta-500', icon: 'fa-radar' },
              ].map((node, i) => (
                <div key={i} className="p-6 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all">
                   <div className="flex items-center gap-4">
                     <i className={`fa-solid ${node.icon} ${node.color} text-sm`}></i>
                     <span className="text-[11px] font-black text-slate-200 uppercase italic">{node.label}</span>
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${node.color}`}>{node.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 text-center">
               <p className="text-[9px] text-emerald-500 font-bold uppercase italic tracking-widest">Auth Protocol 21605-Sovereign Active</p>
            </div>
          </div>

          <div className="p-10 rounded-[40px] bg-gradient-to-br from-slate-900 to-black text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <div className="relative z-10">
               <h4 className="font-black uppercase text-[10px] tracking-[0.5em] mb-6 flex items-center gap-3 italic">
                 <i className="fa-solid fa-fingerprint text-emerald-500"></i>
                 Biometric Sovereign
               </h4>
               <p className="text-lg font-black mb-10 leading-tight italic tracking-tighter opacity-80">
                 IBM Identity Core <br/> verified for Anthony Tucker.
               </p>
               <div className="flex gap-6 opacity-40">
                  <i className="fa-brands fa-apple-pay text-4xl"></i>
                  <i className="fa-brands fa-google-pay text-4xl"></i>
                  <i className="fa-brands fa-stripe text-4xl"></i>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutCenter;
