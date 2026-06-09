/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  CreditCard, 
  History, 
  ShoppingBag, 
  Heart, 
  Trash2, 
  Download, 
  RefreshCcw, 
  Plus, 
  Check, 
  BadgeCheck, 
  Navigation,
  Eye
} from 'lucide-react';
import { User as UserType, Address, PaymentMethod, Order, Product } from '../types';

interface CustomerDashboardProps {
  currentUser: UserType;
  orders: Order[];
  onUpdateUser: (updatedUser: UserType) => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onViewProduct: (p: Product) => void;
  onReturnOrderRequest: (orderId: string) => void;
}

export default function CustomerDashboard({
  currentUser,
  orders,
  onUpdateUser,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onViewProduct,
  onReturnOrderRequest
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'orders' | 'wishlist'>('overview');
  
  // Profile Form States
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address Form States
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');

  // Payment Form States
  const [showPayForm, setShowPayForm] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      email
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity) return;
    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      name: addrName || 'Other Location',
      street: addrStreet,
      city: addrCity,
      state: addrState || 'CA',
      zip: addrZip || '94043',
      country: 'United States',
      isDefault: currentUser.addresses.length === 0
    };
    onUpdateUser({
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr]
    });
    setShowAddrForm(false);
    setAddrName('');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder) return;
    const newPay: PaymentMethod = {
      id: `pay_${Date.now()}`,
      type: 'card',
      cardNumber: `•••• •••• •••• ${cardNumber.slice(-4) || '1111'}`,
      cardHolder: cardHolder.toUpperCase(),
      expiry: expiry || '05/29',
      isDefault: currentUser.paymentMethods.length === 0
    };
    onUpdateUser({
      ...currentUser,
      paymentMethods: [...currentUser.paymentMethods, newPay]
    });
    setShowPayForm(false);
    setCardNumber('');
    setCardHolder('');
    setExpiry('');
  };

  const handleDeleteAddress = (id: string) => {
    onUpdateUser({
      ...currentUser,
      addresses: currentUser.addresses.filter(a => a.id !== id)
    });
  };

  const handleDeletePayment = (id: string) => {
    onUpdateUser({
      ...currentUser,
      paymentMethods: currentUser.paymentMethods.filter(p => p.id !== id)
    });
  };

  const triggerDownloadInvoice = (ord: Order) => {
    const content = `
========================================
           MARKETHUB INVOICE
========================================
Order ID: ${ord.id}
Date: ${ord.date}
Customer Name: ${ord.customerName}
Payment Method: ${ord.paymentMethod}
Payment Status: ${ord.paymentStatus.toUpperCase()}

SHIPPING DETAILS:
- Address: ${ord.shippingAddress.street}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} ${ord.shippingAddress.zip}

ITEMS PURCHASED:
${ord.items.map(item => `- ${item.title} x${item.quantity} ($${item.price} ea)`).join('\n')}

----------------------------------------
Subtotal: $${ord.total + ord.discount}
Coupon Discount: -$${ord.discount}
Total Paid: $${ord.total}
========================================
Thank you for shopping at MarketHub!
Your trust fuels independent sellers globally.
========================================
    `;
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Invoice-${ord.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="customer-dashboard">
      <div className="grid md:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 object-cover rounded-full border-2 border-brand-gold bg-slate-600 mb-3"
              referrerPolicy="no-referrer"
            />
            <h3 className="font-display font-bold text-slate-900 text-base">{currentUser.name}</h3>
            <p className="text-xs text-slate-500 mb-1">{currentUser.email}</p>
            <span className="text-[9px] bg-brand-gold-pale text-brand-blue font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Role: Customer
            </span>
          </div>

          <nav className="bg-white rounded-2xl border border-slate-100 p-2 space-y-1 shadow-xs flex flex-row md:flex-col overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', name: 'Dashboard Overview', icon: User },
              { id: 'profile', name: 'Profile & Payment', icon: CreditCard },
              { id: 'orders', name: 'Order History', icon: History },
              { id: 'wishlist', name: 'Saved Wishlist', icon: Heart }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold font-display flex items-center gap-2.5 transition-colors shrink-0 ${
                    activeTab === tab.id 
                      ? 'bg-brand-blue text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Major Content Panel */}
        <div className="md:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in" id="customer-overview">
              {/* Stats Tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Total Orders</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{orders.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Saved in Wishlist</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{wishlistProducts.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Addresses Registered</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{currentUser.addresses.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Promo Tokens Wallet</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">$50.00</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
                <h4 className="font-display font-extrabold text-lg text-slate-900 mb-4">Recent Transactions</h4>
                {orders.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6">You have not finalized any order items yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 2).map(ord => (
                      <div key={ord.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100/60 flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-xs text-brand-blue">{ord.id}</span>
                            <span className="text-[10px] text-slate-400">• {ord.date}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {ord.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-bold font-mono block text-brand-blue">${ord.total}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${
                              ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-gold-pale text-brand-blue'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => triggerDownloadInvoice(ord)}
                            className="p-2 bg-white hover:bg-slate-100 rounded-lg text-slate-500 border border-slate-200"
                            title="Download Invoice receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved items quick teaser */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-display font-bold text-base text-slate-900">Your Favorite Items</h4>
                  <button onClick={() => setActiveTab('wishlist')} className="text-xs font-bold text-brand-blue hover:text-brand-gold">See all</button>
                </div>
                {wishlistProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">Your saved favorites list is empty.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                    {wishlistProducts.slice(0, 4).map(p => (
                      <div key={p.id} className="p-3 bg-slate-50 rounded-xl relative group text-center border border-slate-100">
                        <img src={p.images[0]} alt={p.title} className="w-16 h-16 object-cover rounded-md mx-auto mb-2 border border-slate-100" referrerPolicy="no-referrer" />
                        <h5 className="font-bold text-slate-900 text-xs truncate mb-1">{p.title}</h5>
                        <p className="text-xs font-mono font-bold text-brand-blue">${p.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in" id="customer-profile">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <h4 className="font-display font-extrabold text-lg text-slate-900 mb-4 pb-2 border-b border-slate-50">General Contact Information</h4>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-hidden focus:border-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Contact Email</label>
                      <input 
                        type="email" 
                        required
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-hidden focus:border-brand-blue"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                  {profileSuccess && (
                     <p className="text-xs text-teal-600 font-semibold animate-pulse">✓ Profile updated successfully!</p>
                  )}
                </form>
              </div>

              {/* Saved shipping addresses */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-display font-extrabold text-lg text-slate-900">Custom Delivery Addresses</h4>
                  <button 
                    type="button"
                    onClick={() => setShowAddrForm(!showAddrForm)}
                    className="p-2 py-1 bg-brand-gold-pale hover:bg-brand-gold/20 rounded-lg text-xs font-bold text-brand-blue flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New
                  </button>
                </div>

                {showAddrForm && (
                  <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 mb-4 animate-fade-in">
                    <p className="text-xs font-bold text-brand-blue">Add Shipping Address</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Label (e.g. Headquarters, Loft)" 
                        required
                        value={addrName} 
                        onChange={(e) => setAddrName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden"
                      />
                      <input 
                        type="text" 
                        placeholder="Street Address" 
                        required
                        value={addrStreet} 
                        onChange={(e) => setAddrStreet(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                      />
                      <input 
                        type="text" 
                        placeholder="City" 
                        required
                        value={addrCity} 
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="State" 
                          value={addrState} 
                          onChange={(e) => setAddrState(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                        />
                        <input 
                          type="text" 
                          placeholder="Zip Code" 
                          value={addrZip} 
                          onChange={(e) => setAddrZip(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddrForm(false)} className="text-xs py-1.5 px-3 text-slate-500">Cancel</button>
                      <button type="submit" className="text-xs py-1.5 px-4 bg-brand-blue text-white rounded-lg font-bold">Register</button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {currentUser.addresses.map(a => (
                    <div key={a.id} className="p-4 bg-slate-50 rounded-xl relative border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" /> {a.name}
                        </span>
                        <button onClick={() => handleDeleteAddress(a.id)} className="text-slate-400 hover:text-red-500 h-6 w-6 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold mb-1">{a.street}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{a.city}, {a.state} {a.zip}</p>
                      {a.isDefault && (
                        <span className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono uppercase">
                          <BadgeCheck className="w-3 h-3" /> DEFAULT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved payment credentials */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-display font-extrabold text-lg text-slate-900">Registered Vault Cards</h4>
                  <button 
                    type="button"
                    onClick={() => setShowPayForm(!showPayForm)}
                    className="p-2 py-1 bg-brand-gold-pale hover:bg-brand-gold/20 rounded-lg text-xs font-bold text-brand-blue flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Secure Card
                  </button>
                </div>

                {showPayForm && (
                  <form onSubmit={handleAddPayment} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 mb-4 animate-fade-in">
                    <p className="text-xs font-bold text-brand-blue">Securely Vault Credit Card</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input 
                        type="text" 
                        placeholder="Cardholder Full Name" 
                        required
                        value={cardHolder} 
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-00 uppercase"
                      />
                      <input 
                        type="text" 
                        maxLength={16}
                        placeholder="16 Digit Card Number" 
                        required
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                      />
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        required
                        value={expiry} 
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono text-center"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowPayForm(false)} className="text-xs py-1.5 px-3 text-slate-500">Cancel</button>
                      <button type="submit" className="text-xs py-1.5 px-4 bg-brand-blue text-white rounded-lg font-bold">Secure Cards</button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {currentUser.paymentMethods.map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 rounded-xl relative border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-widest">
                          AES SECURE
                        </span>
                        <button onClick={() => handleDeletePayment(p.id)} className="text-slate-400 hover:text-red-500 h-6 w-6 flex items-center justify-center rounded-md hover:bg-red-50 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-mono font-bold text-slate-900 tracking-wider font-bold mb-1">{p.cardNumber}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase leading-none">{p.cardHolder}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Expires {p.expiry}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in" id="customer-orders">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
                <h4 className="font-display font-extrabold text-lg text-slate-900 mb-6 flex items-center gap-2">
                  Completed Transactions <History className="w-5 h-5 text-brand-gold animate-spin" />
                </h4>
                
                {orders.length === 0 ? (
                  <p className="text-sm text-slate-400 py-10 text-center">You have not completed any purchases in this sandbox environment yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orders.map(ord => (
                      <div key={ord.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/50">
                          <div>
                            <span className="font-mono text-xs font-extrabold text-brand-blue uppercase mr-2 bg-brand-gold-pale px-2.5 py-0.5 rounded-md">
                              {ord.id}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Placed on {ord.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                              ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              ord.status === 'cancelled' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                            
                            <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-1 rounded font-mono font-bold">
                              {ord.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Items listed */}
                        <div className="space-y-3">
                          {ord.items.map(item => (
                            <div key={item.id} className="flex gap-4 items-center justify-between">
                              <div className="flex gap-3 items-center min-w-0">
                                <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate max-w-[280px] sm:max-w-md">{item.title}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">Qty: {item.quantity} • Seller: <span className="font-bold text-slate-700">{item.sellerName}</span></p>
                                </div>
                              </div>
                              <span className="text-xs font-bold font-mono text-brand-blue shrink-0">${item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Tracking Timeline tracker */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">Live Carrier Shipment Status</p>
                          <div className="grid grid-cols-4 gap-2 relative">
                            {[
                              { label: 'Confirmed', done: true },
                              { label: 'Processed', done: ord.status !== 'pending' },
                              { label: 'Shipped', done: ord.status === 'shipped' || ord.status === 'delivered' },
                              { label: 'Carrier Out', done: ord.status === 'delivered' }
                            ].map((step, sIdx) => (
                              <div key={sIdx} className="text-center relative">
                                <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center font-bold text-[10px] z-10 relative ${
                                  step.done ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {step.done ? '✓' : sIdx + 1}
                                </div>
                                <span className={`text-[9px] block mt-1.5 font-bold tracking-tight ${
                                  step.done ? 'text-brand-blue' : 'text-slate-400'
                                }`}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center text-[11px] text-slate-500 font-semibold gap-2">
                            <span>Tracking Code: <span className="font-mono text-slate-800">{ord.trackingCode}</span></span>
                            <span>Est. Handover: <span className="text-brand-blue">{ord.estimatedDelivery}</span></span>
                          </div>
                        </div>

                        {/* Order actions */}
                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200/50">
                          <button 
                            type="button" 
                            onClick={() => triggerDownloadInvoice(ord)}
                            className="text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" /> Invoice
                          </button>

                          {ord.status === 'delivered' && (
                            <button 
                              type="button" 
                              onClick={() => {
                                onReturnOrderRequest(ord.id);
                                alert(`Return ticket initiated for order ${ord.id}. Status set to refund-processing.`);
                              }}
                              className="text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl px-4 py-2 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <RefreshCcw className="w-3.5 h-3.5" /> File Return Request
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fade-in" id="customer-wishlist">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
                <h4 className="font-display font-extrabold text-lg text-slate-900 mb-6">Your Saved Items ({wishlistProducts.length})</h4>
                
                {wishlistProducts.length === 0 ? (
                  <p className="text-sm text-slate-400 py-10 text-center">Your favorites collection is hungry! Keep exploring the Landing Page or search with AI.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistProducts.map(p => (
                      <div key={p.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                        <div className="space-y-3">
                          <img src={p.images[0]} alt={p.title} className="w-full h-36 object-cover rounded-xl border border-slate-50" referrerPolicy="no-referrer" />
                          <div>
                            <h5 onClick={() => onViewProduct(p)} className="font-bold text-slate-900 text-sm hover:text-brand-blue cursor-pointer truncate">{p.title}</h5>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{p.specs.Material || p.specs.Battery || 'Premium quality'}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-base font-black font-mono text-brand-blue">${p.price}</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => onRemoveFromWishlist(p)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl cursor-pointer"
                              title="Delete from safe folder"
                            >
                              <Trash2 className="w-3.8 h-3.8" />
                            </button>
                            <button
                              onClick={() => onAddToCart(p)}
                              className="px-3.5 py-1.5 bg-brand-blue hover:bg-brand-blue-light text-white font-bold rounded-xl text-xs cursor-pointer"
                            >
                              Move To Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
