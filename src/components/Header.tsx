/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Sparkles, 
  ChevronDown, 
  User, 
  Store, 
  Sliders, 
  Mic, 
  LogOut, 
  Grid,
  Menu
} from 'lucide-react';
import { Product, Category, User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType | null;
  onChangeRole: (role: 'customer' | 'vendor') => void;
  categories: Category[];
  cartCount: number;
  wishlistCount: number;
  products: Product[];
  onOpenCartAndCheckout: () => void;
  onOpenWishlist: () => void;
  onOpenAIAssistant: () => void;
  onSelectProduct: (product: Product) => void;
  onSearchQuery: (query: string, categoryId: string) => void;
  onNavigateHome: () => void;
  onOpenAuth: (tab: 'login' | 'signup') => void;
  onLogout: () => void;
}

export default function Header({
  currentUser,
  onChangeRole,
  categories,
  cartCount,
  wishlistCount,
  products,
  onOpenCartAndCheckout,
  onOpenWishlist,
  onOpenAIAssistant,
  onSelectProduct,
  onSearchQuery,
  onNavigateHome,
  onOpenAuth,
  onLogout
}: HeaderProps) {
  const [searchTxt, setSearchTxt] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [showAutoSuggest, setShowAutoSuggest] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Suggest products matching search query
  const suggestions = searchTxt.trim().length > 1
    ? products.filter(p => p.title.toLowerCase().includes(searchTxt.toLowerCase()) || p.brand.toLowerCase().includes(searchTxt.toLowerCase()))
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQuery(searchTxt, selectedCat);
    setShowAutoSuggest(false);
  };

  const handleSelectSuggestion = (p: Product) => {
    onSelectProduct(p);
    setSearchTxt('');
    setShowAutoSuggest(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-blue text-white shadow-md" id="app-header">
      {/* Top Banner (Investor Roles Switcher) */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider text-slate-400">DEMO SANDBOX STATUS: ACTIVE</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-semibold text-brand-gold-light">⚡ Quick Switch Role (Investor Preset):</span>
          <div className="flex items-center gap-1.5 bg-slate-800 p-0.5 px-1.5 rounded-lg border border-slate-700">
            {(['customer', 'vendor'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onChangeRole(r)}
                className={`px-2 py-0.5 rounded-md font-bold transition-all text-[10px] uppercase tracking-wider ${
                  currentUser?.role === r
                    ? 'bg-brand-gold text-brand-blue shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        
        {/* Brand Logo & Platform Name */}
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={onNavigateHome}>
          <div className="w-10 h-10 bg-brand-gold text-brand-blue rounded-xl flex items-center justify-center font-display font-black text-xl shadow-inner transform transition-transform hover:scale-105">
            M
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-white leading-none">
              Market<span className="text-brand-gold">Hub</span>
            </h1>
            <p className="text-[9px] text-slate-300 font-mono tracking-wider uppercase mt-0.5">Global Multi-Vendor Hub</p>
          </div>
        </div>

        {/* Categories Drawer & Dynamic Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
          <div className="flex bg-white text-slate-800 rounded-xl overflow-hidden shadow-xs border border-slate-200">
            {/* Category Dropdown option */}
            <div className="relative hidden lg:block shrink-0 border-r border-slate-100 bg-slate-50">
              <select
                value={selectedCat}
                onChange={(e) => {
                  setSelectedCat(e.target.value);
                  onSearchQuery(searchTxt, e.target.value);
                }}
                className="appearance-none pl-4 pr-8 py-2.5 bg-transparent font-medium text-slate-700 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Input field */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search premium headphones, walnut desks, running tracks..."
                value={searchTxt}
                onChange={(e) => {
                  setSearchTxt(e.target.value);
                  setShowAutoSuggest(true);
                }}
                onFocus={() => setShowAutoSuggest(true)}
                className="w-full pl-3 pr-10 py-2.5 text-sm outline-hidden text-slate-800 font-medium placeholder-slate-400"
              />
              <button 
                type="button" 
                onClick={onOpenAIAssistant}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-brand-blue"
                title="Voice / AI search assist"
              >
                <Mic className="w-4 h-4 hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Search submit button */}
            <button
              type="submit"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-blue font-bold px-5 flex items-center justify-center transition-colors border-none cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Autocomplete suggestions dropdown panel */}
          {showAutoSuggest && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden text-slate-800 max-h-80 overflow-y-auto">
              <div className="p-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Matching marketplace Products</span>
                <button type="button" onClick={() => setShowAutoSuggest(false)} className="hover:text-brand-blue">Close</button>
              </div>
              {suggestions.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelectSuggestion(p)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-gold-pale cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-9 h-9 object-cover rounded-md border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.title}</p>
                    <p className="text-xs text-slate-400 truncate">by <span className="font-medium text-slate-600">{p.sellerName}</span> • {p.specs.Material || p.specs.Battery || p.specs.Origin || 'Premium Quality'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold font-mono text-brand-blue">${p.price}</p>
                    <p className="text-[10px] font-semibold text-brand-gold">★ {p.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Right side controls */}
        <div className="flex items-center gap-2 lg:gap-4 md:shrink-0">
          
          {/* AI Sparkles Assistant Activator (Glorified action badge) */}
          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-brand-gold-light hover:to-yellow-400 text-brand-blue px-3.5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 group shrink-0"
            id="header-ai-btn"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform animate-pulse" />
            <span className="hidden sm:inline">Ask Shopping Assistant</span>
            <span className="sm:hidden">AI Assist</span>
          </button>

          {/* Customer Wishlist indicator */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="p-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl relative transition-colors cursor-pointer"
            title="Wishlist Items"
          >
            <Heart className="w-5.3 h-5.3" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-blue">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Indicator */}
          <button
            type="button"
            onClick={onOpenCartAndCheckout}
            className="p-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl relative transition-colors cursor-pointer"
            title="Checkout Cart"
          >
            <ShoppingCart className="w-5.3 h-5.3" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-blue font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-blue">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account/Role Avatar Display */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 p-1 px-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6.5 h-6.5 object-cover rounded-full border border-brand-gold shrink-0 bg-slate-600"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden lg:block text-left select-none">
                  <p className="text-xs font-bold text-white truncate max-w-[100px] leading-tight">{currentUser.name}</p>
                  <span className="text-[9px] text-brand-gold font-mono uppercase tracking-wider block font-bold mt-0.5">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Quick user role selector dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden text-slate-800">
                  <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  
                  <div className="p-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 font-mono">Switch Role Preset</p>
                    
                    <button
                      type="button"
                      onClick={() => {
                        onChangeRole('customer');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                        currentUser.role === 'customer' ? 'bg-brand-gold-pale text-brand-blue font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Customer View
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeRole('vendor');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                        currentUser.role === 'vendor' ? 'bg-brand-gold-pale text-brand-blue font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Store className="w-4 h-4 text-slate-500" />
                      Vendor Dashboard
                    </button>
                  </div>

                  <div className="border-t border-slate-100 p-1 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="text-slate-200 hover:text-white font-bold text-xs py-2 px-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="bg-brand-gold hover:bg-brand-gold-light text-brand-blue font-extrabold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
