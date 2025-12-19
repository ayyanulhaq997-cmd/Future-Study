
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User } from '../types';

const AgentDashboard: React.FC<{ user: User; onBuy: (pid: string, qty: number) => void }> = ({ user, onBuy }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [p, o] = await Promise.all([api.getProducts(), api.getOrders()]);
      setProducts(p);
      setOrders(o);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCodes = orders.reduce((acc, o) => acc + o.quantity, 0);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Reseller Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Partner <span className="text-primary-400">Portal</span></h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Tier {user.tier} Reseller</span>
            <span className="text-slate-500 text-sm">{user.name}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-2xl border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Spent</p>
            <p className="text-2xl font-bold font-mono text-emerald-500">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="glass px-6 py-4 rounded-2xl border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Vouchers Procured</p>
            <p className="text-2xl font-bold font-mono">{totalCodes}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl font-bold">Bulk Inventory Procurement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => {
              const agentDiscount = (user.tier || 0) * 2;
              const basePrice = p.basePrice * (1 - agentDiscount/100);
              
              return (
                <div key={p.id} className="glass p-6 rounded-3xl border-slate-800 hover:border-primary-500/30 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl">{p.icon}</span>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">-{agentDiscount}% TIER DISCOUNT</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                  <p className="text-2xl font-bold text-primary-400 font-mono mb-6">${basePrice.toFixed(2)} <span className="text-xs text-slate-500 font-normal">/ unit</span></p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 50, 100].map(qty => (
                      <button 
                        key={qty}
                        onClick={() => onBuy(p.id, qty)}
                        className="bg-slate-900 hover:bg-primary-600 border border-slate-700 py-3 rounded-xl text-xs font-bold transition-all"
                      >Buy {qty}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Order History</h2>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-slate-600 italic text-sm p-8 glass rounded-2xl text-center border-dashed border-slate-800">No orders placed yet.</p>
            ) : (
              orders.map(o => (
                <div key={o.id} className="glass p-4 rounded-2xl border-slate-800 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-primary-400 font-bold">{o.id}</span>
                    <span className="text-slate-500 text-xs">{new Date(o.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">{o.quantity}x {o.productName}</span>
                    <span className="font-bold text-emerald-500">${o.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
