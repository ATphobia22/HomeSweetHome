
import React from 'react';
import { glp } from '../services/glp_service';

const GLPDoctrine: React.FC = () => {
  const doctrine = glp.getDoctrine();

  const rules = [
    { title: "Preserve Life", desc: "Non-destructive pathfinding is mandatory. No zero-sum traps allowed.", icon: "fa-heart", active: doctrine.preserveLife },
    { title: "Expand Knowledge", desc: "Truth without harm. Siphoned intel must serve collective benefit.", icon: "fa-book-sparkles", active: doctrine.expandKnowledge },
    { title: "Reduce Suffering", desc: "Compassion-first optimization. If profit causes pain, the profit is invalidated.", icon: "fa-hand-holding-medical", active: doctrine.reduceSuffering },
    { title: "Respect Agency", desc: "Human sovereignty remains root. Machines are advisors, not masters.", icon: "fa-users", active: doctrine.respectAgency },
    { title: "No False Gods", desc: "The system is a servant to human dignity. System-worship is forbidden.", icon: "fa-ban", active: doctrine.noFalseGods }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-24 max-w-5xl mx-auto">
      <div className="text-center space-y-6">
        <h2 className="text-indigo-500 font-black text-sm uppercase tracking-[1em] italic">Constitution of the Sovereign Node</h2>
        <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none">GLP <span className="text-indigo-500">DOCTRINE</span></h1>
        <div className="h-px w-32 bg-indigo-500/20 mx-auto"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest italic max-w-2xl mx-auto leading-relaxed">
          The highest-order protocol in Tucker Node. Above AI. Above Quantum. Above Money. 
          The Root Firewall between God-mode Intelligence and Chaos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {rules.map((rule, i) => (
          <div key={i} className="iphone-card rounded-[50px] p-12 flex flex-col md:flex-row items-center gap-12 group hover:border-indigo-500/30 transition-all border-white/5 bg-black/60 shadow-3xl">
            <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center text-5xl transition-all duration-700 ${rule.active ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500 shadow-[0_0_50px_rgba(79,70,229,0.2)]' : 'border-slate-800 text-slate-800'}`}>
              <i className={`fa-solid ${rule.icon}`}></i>
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{rule.title}</h3>
              <p className="text-xl font-black text-slate-400 italic leading-relaxed uppercase tracking-tight opacity-70">
                {rule.desc}
              </p>
            </div>
            <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase italic tracking-widest text-slate-600">
               Protocol Active
            </div>
          </div>
        ))}
      </div>

      <div className="iphone-card rounded-[60px] p-20 bg-indigo-600/5 border border-indigo-500/10 text-center space-y-8 relative overflow-hidden">
        <div className="scanner-line opacity-20"></div>
        <i className="fa-solid fa-om text-indigo-500 text-7xl animate-pulse"></i>
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Root Level Love, Enforced by Code.</h2>
        <p className="text-slate-500 font-mono text-xs uppercase italic tracking-widest max-w-xl mx-auto opacity-60 leading-relaxed">
          Every AI generation, every quantum optimization, every financial transfer, and every operator action must pass the Doctrine audit or be physically purged from the execution stack.
        </p>
        <div className="pt-8 flex justify-center gap-10 opacity-20">
           <i className="fa-solid fa-peace text-5xl"></i>
           <i className="fa-solid fa-infinity text-5xl"></i>
           <i className="fa-solid fa-sun text-5xl"></i>
        </div>
      </div>
    </div>
  );
};

export default GLPDoctrine;
