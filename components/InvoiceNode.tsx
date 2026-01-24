
import React, { useState, useEffect } from 'react';
import { gemini } from '../services/gemini';
import { Invoice } from '../types';

const InvoiceNode: React.FC<{ onSettle: (amt: number) => void }> = ({ onSettle }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await gemini.generatePredictiveInvoices();
      setInvoices(data);
    } catch (e) {
      console.error("Receivable node disruption.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedInvoices);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedInvoices(newSet);
  };

  const settleSelected = () => {
    let total = 0;
    const remaining = invoices.map(inv => {
      if (selectedInvoices.has(inv.id)) {
        total += inv.amount;
        return { ...inv, status: 'Paid' as const };
      }
      return inv;
    });
    setInvoices(remaining);
    onSettle(total);
    setSelectedInvoices(new Set());
    alert(`Settled $${total.toLocaleString()} across ${selectedInvoices.size} nodes.`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-[11px] font-black text-indigo-500 tracking-[0.5em] uppercase mb-1 italic">Neural Receivable Management</h2>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">INVOICE <span className="text-indigo-500">NODE</span></h1>
        </div>
        <div className="flex gap-4">
           {selectedInvoices.size > 0 && (
             <button 
               onClick={settleSelected}
               className="px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-900/20"
             >
               SETTLE SELECTED (${Array.from(selectedInvoices).reduce((acc, id) => acc + (invoices.find(inv => inv.id === id)?.amount || 0), 0).toLocaleString()})
             </button>
           )}
           <button 
             onClick={fetchInvoices}
             className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all"
           >
             {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'REFRESH GRID'}
           </button>
        </div>
      </div>

      <div className="iphone-card rounded-[50px] overflow-hidden bg-black/60 shadow-3xl border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Select</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID / Entity</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="p-6 text-[10px] font-black text-indigo-500 uppercase tracking-widest">AI Prediction</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Conf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr 
                  key={inv.id} 
                  onClick={() => inv.status !== 'Paid' && toggleSelect(inv.id)}
                  className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedInvoices.has(inv.id) ? 'bg-indigo-500/10' : ''}`}
                >
                  <td className="p-6">
                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedInvoices.has(inv.id) ? 'bg-indigo-500 border-indigo-500' : 'border-white/10'}`}>
                      {selectedInvoices.has(inv.id) && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-sm uppercase italic">{inv.customerName}</span>
                      <span className="text-[10px] text-slate-600 font-mono">#{inv.id}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-lg font-black text-white italic tracking-tighter">${inv.amount.toLocaleString()}</span>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                      inv.status === 'Overdue' ? 'bg-red-500/10 text-red-400' :
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-6 text-[11px] text-slate-400 font-mono">{inv.dueDate}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-brain-circuit text-indigo-500 text-xs"></i>
                      <span className="text-[11px] text-indigo-400 font-black italic">{inv.predictedDate}</span>
                    </div>
                  </td>
                  <td className="p-6 text-[11px] font-mono text-slate-600">{Math.round(inv.probability * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceNode;
