/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Store, 
  Package, 
  FileText, 
  Check, 
  X, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Grid, 
  Plus, 
  TrendingUp, 
  Info,
  Sliders,
  DollarSign
} from 'lucide-react';
import { User as UserType, Product, Order, Category } from '../types';

interface AdminDashboardProps {
  currentUser: UserType;
  users: UserType[];
  products: Product[];
  orders: Order[];
  categories: Category[];
  onApproveVendor: (vendorId: string) => void;
  onRejectVendor: (vendorId: string) => void;
  onSuspendVendor: (vendorId: string) => void;
  onApproveProduct: (productId: string) => void;
  onAddCategory: (newCategory: Omit<Category, 'id'>) => void;
  onUpdateOrderStatusGlobal: (orderId: string, status: Order['status'], paymentStatus: Order['paymentStatus']) => void;
}

export default function AdminDashboard({
  currentUser,
  users,
  products,
  orders,
  categories,
  onApproveVendor,
  onRejectVendor,
  onSuspendVendor,
  onApproveProduct,
  onAddCategory,
  onUpdateOrderStatusGlobal
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'orders' | 'categories'>('users');
  
  // Filtering lists
  const vendorsOnly = users.filter(usr => usr.role === 'vendor');
  const customersOnly = users.filter(usr => usr.role === 'customer');

  // Platform total metrics
  const totalFinancialFlow = orders.reduce((acc, ord) => ord.paymentStatus === 'paid' ? acc + ord.total : acc, 0);

  // New Category form states
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('Sparkles');
  const [catImg, setCatImg] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    onAddCategory({
      name: catName,
      icon: catIcon,
      image: catImg
    });
    setCatName('');
    setShowCatForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="admin-dashboard">
      {/* Top Welcome Title */}
      <div className="bg-brand-blue text-white p-6 rounded-3xl mb-8 flex flex-wrap justify-between items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <h2 className="font-display font-black text-white text-2xl tracking-tight uppercase flex items-center gap-2">
            Platform Command Center <Sparkles className="w-5 h-5 text-brand-gold animate-bounce" />
          </h2>
          <p className="text-xs text-slate-300">Logged in security context: ADMIN AUTHORITY Level 1. Full database state mutations active.</p>
        </div>

        <div className="p-1 px-3 bg-white/10 rounded-lg text-xs font-semibold text-brand-gold font-mono border border-white/5 shrink-0 uppercase tracking-widest">
          Node Host: SECURED PORT 3000
        </div>
      </div>

      {/* Overview indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="absolute top-4 right-4 p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Global Gross Revenue</span>
          <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">${totalFinancialFlow}</span>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="absolute top-4 right-4 p-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg">
            <Store className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Total Registered Sellers</span>
          <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{vendorsOnly.length} Stores</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="absolute top-4 right-4 p-1.5 bg-cyan-500/10 text-cyan-600 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Registered Customers</span>
          <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{customersOnly.length} Buyers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative">
          <div className="absolute top-4 right-4 p-1.5 bg-purple-500/10 text-purple-600 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500 block">Global Order Counter</span>
          <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{orders.length} tickets</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-3 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'users', name: 'Vendor Approval Board', icon: Users },
          { id: 'products', name: 'Product Supervision', icon: Package },
          { id: 'orders', name: 'Global Transaction Dispatch', icon: FileText },
          { id: 'categories', name: 'Platform Categories', icon: Grid }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-brand-blue text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* View render cases */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6 animate-fade-in" id="admin-tab-users">
          <div>
            <h4 className="font-display font-extrabold text-slate-900 text-lg">Merchant List & Tax KYC Board</h4>
            <p className="text-xs text-slate-500">Supervise retail registrations, verify business tax files, or suspend accounts violating code guidelines.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {vendorsOnly.map(vendor => (
              <div key={vendor.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100/60 relative overflow-hidden flex flex-col justify-between h-56">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center min-w-0">
                      <img src={vendor.avatar} alt={vendor.name} className="w-11 h-11 object-cover rounded-xl border border-brand-gold bg-slate-300 shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <h5 className="font-display font-extrabold text-slate-900 text-sm leading-tight truncate">{vendor.storeName}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">Email contact: {vendor.email}</p>
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                      vendor.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      vendor.kycStatus === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-red-100 text-red-00'
                    }`}>{vendor.kycStatus}</span>
                  </div>

                  {vendor.kycDetails && (
                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl space-y-1 text-[10px] text-slate-500 font-semibold mb-3">
                      <p>Business Name: <span className="text-slate-800 font-extrabold">{vendor.kycDetails.businessName}</span></p>
                      <p>Corporate Tax ID: <span className="text-slate-800 font-bold font-mono">{vendor.kycDetails.taxId}</span></p>
                      <p>Tax phone: <span className="text-slate-800 font-medium font-mono">{vendor.kycDetails.phone}</span></p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end font-bold text-[10px]">
                  {vendor.kycStatus !== 'verified' && (
                    <button
                      type="button"
                      onClick={() => onApproveVendor(vendor.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Approve Issuer KYC
                    </button>
                  )}
                  {vendor.kycStatus !== 'unverified' && (
                    <button
                      type="button"
                      onClick={() => onRejectVendor(vendor.id)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Reject Proofs
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSuspendVendor(vendor.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldAlert className="w-3 h-3" /> Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6 animate-fade-in" id="admin-tab-products">
          <div>
            <h4 className="font-display font-extrabold text-slate-900 text-lg">Product Verification Catalogue</h4>
            <p className="text-xs text-slate-500 font-medium">Verify stock profiles before listings appear live in consumer search pipelines.</p>
          </div>

          <div className="grid gap-4">
            {products.map(p => (
              <div key={p.id} className="p-4 border border-slate-100/60 rounded-2xl bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-3 items-center min-w-0">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover rounded-xl border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[280px] sm:max-w-md">{p.title}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Brand: {p.brand} • Seller Store: <span className="text-slate-600 font-bold">{p.sellerName}</span></p>
                    <span className="font-mono text-xs font-black text-brand-blue block">${p.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    p.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>{p.isApproved ? 'Verified approved' : 'Verification pending'}</span>

                  {!p.isApproved && (
                    <button
                      type="button"
                      onClick={() => onApproveProduct(p.id)}
                      className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6 animate-fade-in" id="admin-tab-orders">
          <div>
            <h4 className="font-display font-extrabold text-slate-900 text-lg">Worldwide Shipments Dispatch Board</h4>
            <p className="text-xs text-slate-500 font-medium">Verify payments, alter delivery tracks, and initiate admin refunds for customers.</p>
          </div>

          <div className="space-y-4">
            {orders.map(ord => (
              <div key={ord.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-200/50 text-xs gap-2">
                  <div>
                    <span className="font-mono text-xs font-black text-brand-blue mr-2 uppercase bg-white px-2 py-0.5 rounded border border-slate-100">
                      {ord.id}
                    </span>
                    <span className="text-slate-400 font-medium font-semibold">Customer: <span className="text-slate-800 font-bold">{ord.customerName}</span> • placed on {ord.date}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-200 text-slate-800 font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {ord.paymentStatus.toUpperCase()}
                    </span>
                    <span className="bg-brand-gold-pale text-brand-blue font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                      {ord.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {ord.items.map(it => (
                    <div key={it.id} className="flex gap-3 justify-between items-center text-xs">
                      <span className="text-slate-600 font-semibold truncate max-w-[200px] sm:max-w-md">{it.title} (x{it.quantity})</span>
                      <span className="text-[10px] text-slate-400 font-medium">Seller: <span className="font-bold text-slate-600">{it.sellerName}</span></span>
                    </div>
                  ))}
                  <p className="text-xs font-bold text-slate-900 pt-1">Total billing value: <span className="font-mono text-brand-blue">${ord.total}</span></p>
                </div>

                {/* Status action override controls */}
                <div className="pt-3 border-t border-slate-200/50 flex flex-wrap justify-between items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-400">Carrier Address: {ord.shippingAddress.street}, {ord.shippingAddress.city}</span>
                  
                  <div className="flex gap-1.5 font-bold text-[10px]">
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatusGlobal(ord.id, 'delivered', 'paid')}
                      className="bg-brand-blue hover:bg-brand-blue-light text-white px-3 py-1 rounded-lg cursor-pointer"
                    >
                      Instant Deliver
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateOrderStatusGlobal(ord.id, 'cancelled', 'refunded');
                        alert(`Order ${ord.id} cancelled. User refunded $${ord.total}`);
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg cursor-pointer"
                    >
                      Refund Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6 animate-fade-in" id="admin-tab-categories">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <div>
              <h4 className="font-display font-extrabold text-slate-900 text-lg">Browse Categories Editor</h4>
              <p className="text-xs text-slate-500 font-medium">Edit index nodes in our dynamic category grid.</p>
            </div>
            
            <button
              onClick={() => setShowCatForm(!showCatForm)}
              className="bg-brand-blue hover:bg-brand-blue-light text-white font-extrabold p-2 px-4 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Category Node
            </button>
          </div>

          {showCatForm && (
            <form onSubmit={handleCreateCategory} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid sm:grid-cols-3 gap-3 animate-fade-in">
              <input 
                type="text" 
                placeholder="Category Name (e.g. Health)" 
                required
                value={catName} 
                onChange={(e) => setCatName(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              />
              <input 
                type="text" 
                placeholder="Lucide Icon Label (e.g. Heart)" 
                value={catIcon} 
                onChange={(e) => setCatIcon(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              />
              <input 
                type="url" 
                placeholder="Cover Image URL link" 
                value={catImg} 
                onChange={(e) => setCatImg(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono"
              />
              <div className="sm:col-span-3 flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowCatForm(false)} className="text-slate-500 px-3 py-1">Cancel</button>
                <button type="submit" className="bg-brand-blue text-white px-4 py-1.5 rounded-lg font-bold">Register Category Node</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 border border-slate-100 rounded-xl text-center hover:shadow-xs transition-shadow bg-slate-50/20">
                <img src={cat.image} alt={cat.name} className="w-11 h-11 object-cover rounded-full mx-auto mb-2 border border-slate-200" referrerPolicy="no-referrer" />
                <h5 className="font-bold text-slate-900 text-sm">{cat.name}</h5>
                <span className="text-[10px] text-slate-400 font-mono leading-none">{cat.icon} Node active</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
