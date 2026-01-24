
import React, { useState } from 'react';
import { AdCampaign, Shipment } from '../types';

const OperationsCenter: React.FC = () => {
  const [ads] = useState<AdCampaign[]>([
    { platform: 'X', status: 'active', spend: 450, reach: 24500, conversions: 120, lastUpdate: Date.now() },
    { platform: 'TikTok', status: 'active', spend: 1200, reach: 180000, conversions: 450, lastUpdate: Date.now() - 50000 },
    { platform: 'Instagram', status: 'active', spend: 800, reach: 56000, conversions: 210, lastUpdate: Date.now() - 120000 },
  ]);

  const [shipments] = useState<Shipment[]>([
    { id: 'TUC-8812', destination: 'New York, USA', method: 'Air-Express', status: 'In-Transit', value: 4500, timestamp: Date.now() },
    { id: 'TUC-4409', destination: 'London, UK', method: 'Logistics-Nexus', status: 'Clearing-Customs', value: 12800, timestamp: Date.now() - 3600000 },
    { id: 'TUC-1205', destination: 'Tokyo, JP', method: 'Sea-Freight', status: 'Processing', value: 25000, timestamp: Date.now() - 7200000 },
  ]);

  const formatDate = (ts: number) => new Date(ts).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'short' });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.5em] uppercase mb-1">Global Scale & Logistics</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">OPERATIONS <span className="text-indigo-500">HUB</span></h1>
        </div>
        <div className="text-right">
           <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em] italic mb-2">TUCKER INCORPORATED</p>
           <span className="px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[9px] font-black uppercase italic text-indigo-400">99.9% Fulfillment Node</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Social Media Ads */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <i className="fa-solid fa-rectangle-ad text-indigo-500"></i>
              Active Ad Campaigns
            </h3>
            <span className="text-[8px] text-slate-700 font-mono uppercase">Nodes: X, TikTok, IG</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {ads.map((ad, i) => (
              <div key={i} className="iphone-card rounded-3xl p-6 flex items-center justify-between group hover:border-indigo-500/40 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-2xl text-indigo-400">
                    <i className={`fa-brands ${ad.platform === 'X' ? 'fa-x-twitter' : ad.platform === 'TikTok' ? 'fa-tiktok' : 'fa-instagram'}`}></i>
                  </div>
                  <div>
                    <h4 className="text-xl font-black italic uppercase text-white leading-tight">{ad.platform} Pulse</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Update: {formatDate(ad.lastUpdate)}</p>
                  </div>
                </div>
                <div className="flex gap-10 text-right">
                  <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-tighter">Reach</p>
                    <p className="text-lg font-black italic text-white">{ad.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-tighter">Budget</p>
                    <p className="text-lg font-black italic text-white">${ad.spend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-indigo-600/10 border border-indigo-600/30 rounded-2xl font-black uppercase tracking-widest text-[10px] text-indigo-400 hover:bg-indigo-600/20 transition-all">
            Launch New Campaign
          </button>
        </div>

        {/* Global Logistics */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <i className="fa-solid fa-truck-fast text-emerald-500"></i>
              Shipping & Distribution
            </h3>
            <span className="text-[8px] text-slate-700 font-mono uppercase">IBM Reliability Optimized</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {shipments.map((ship, i) => (
              <div key={i} className="iphone-card rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black border border-emerald-500/20">{ship.id}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{formatDate(ship.timestamp)}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic animate-pulse">{ship.status}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-2xl font-black italic uppercase text-white tracking-tighter">{ship.destination}</h4>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">{ship.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter">Asset Value</p>
                    <p className="text-xl font-black italic text-white">${ship.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 w-full h-1 bg-black/40 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: ship.status === 'Delivered' ? '100%' : ship.status === 'In-Transit' ? '65%' : '25%' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <i className="fa-solid fa-globe-americas text-emerald-500 text-xl"></i>
               <span className="text-[11px] font-black text-slate-200 uppercase italic">Multi-Warehouse Routing: ON</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">IBM CLOUD SYNCED</span>
          </div>
        </div>
      </div>

      {/* Corporate Dashboard Stats */}
      <div className="iphone-card rounded-[40px] md:rounded-[60px] p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase text-white leading-none tracking-tighter mb-4">Scale <span className="text-indigo-500">Fast</span></h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto md:mx-0 font-mono opacity-80 leading-relaxed">
               Tucker Incorporated orchestrates OpenAI strategy with Grok's social pulse and IBM's global reliability. 
               All logistics and ad deployments for Anthony Tucker are timestamped and cryptographically verified.
            </p>
         </div>
         <div className="flex gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-4xl md:text-6xl font-black italic text-indigo-500 tracking-tighter">1.2M+</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Total Reach</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-6xl font-black italic text-emerald-500 tracking-tighter">99.2%</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">ROI Velocity</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OperationsCenter;
