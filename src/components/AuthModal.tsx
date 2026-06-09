/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User, Store, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserType[];
  onRegister: (newUser: UserType) => void;
  onLogin: (user: UserType) => void;
  initialTab?: 'login' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  users,
  onRegister,
  onLogin,
  initialTab = 'login'
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('customer');
  const [signupStore, setSignupStore] = useState('');
  const [signupError, setSignupError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please fill in all credentials.');
      return;
    }

    // Match mail in database
    const matchedUser = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (matchedUser) {
      onLogin(matchedUser);
      onClose();
    } else {
      setLoginError('Incorrect email or account not found in system state. Try a demonstration preset below!');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setSignupError('All profile fields are mandatory.');
      return;
    }

    if (signupRole === 'vendor' && !signupStore.trim()) {
      setSignupError('Store Name is required for vendors.');
      return;
    }

    // Check email uniqueness
    const exists = users.some(u => u.email.toLowerCase() === signupEmail.trim().toLowerCase());
    if (exists) {
      setSignupError('This email is already linked in transactions.');
      return;
    }

    // Provision new user
    const newUser: UserType = {
      id: `usr_${Date.now()}`,
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      role: signupRole,
      avatar: signupRole === 'customer' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      balance: signupRole === 'customer' ? 500 : 0,
      addresses: signupRole === 'customer' ? [{
        id: `addr_${Date.now()}`,
        name: 'Primary Address',
        street: '123 Avenue of the Americas',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        isDefault: true
      }] : [],
      paymentMethods: signupRole === 'customer' ? [{
        id: `pay_${Date.now()}`,
        type: 'card',
        cardNumber: '•••• •••• •••• 1111',
        cardHolder: signupName.trim().toUpperCase(),
        expiry: '12/28',
        isDefault: true
      }] : [],
      followedSellers: [],
      ...(signupRole === 'vendor' && {
        storeName: signupStore.trim(),
        kycStatus: 'pending',
        kycDetails: {
          businessName: `${signupStore.trim()} Inc.`,
          taxId: `TX-${Math.floor(1000000 + Math.random() * 9000000)}`,
          phone: '+1 (555) 123-4567',
          documentUrl: '#'
        }
      })
    };

    onRegister(newUser);
    onClose();
  };

  const handleQuickLogin = (email: string) => {
    const found = users.find(u => u.email === email);
    if (found) {
      onLogin(found);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="auth-modal">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative transition-all duration-300">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => { setActiveTab('login'); setLoginError(''); }}
            className={`py-4 text-sm font-bold transition-all ${
              activeTab === 'login' 
                ? 'bg-white text-brand-blue border-b-2 border-brand-blue font-extrabold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setSignupError(''); }}
            className={`py-4 text-sm font-bold transition-all ${
              activeTab === 'signup' 
                ? 'bg-white text-brand-blue border-b-2 border-brand-blue font-extrabold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[85vh] space-y-6">
          <div className="text-center">
            <h3 className="font-display font-extrabold text-2xl text-slate-900">
              {activeTab === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'login' 
                ? 'Sign in to access your customized marketplace panel' 
                : 'Become part of our global multi-vendor community'}
            </p>
          </div>

          {activeTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
                  {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="sarah@markethub.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue rounded-xl pl-9 pr-4 py-2.5 text-xs outline-hidden text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue rounded-xl pl-9 pr-4 py-2.5 text-xs outline-hidden text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Sign In to Account
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Presets Grid */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center mb-2.5">
                  ✨ Demontration Quick presets
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('sarah@markethub.com')}
                    className="p-2 border border-slate-200 hover:border-brand-gold bg-slate-50 hover:bg-white rounded-xl text-center cursor-pointer transition-all shrink-0"
                  >
                    <User className="w-4 h-4 text-brand-blue mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-700 block truncate">Customer</span>
                    <span className="text-[8px] font-mono text-slate-400 block truncate">Sarah Chen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('alex@aerotech.com')}
                    className="p-2 border border-slate-200 hover:border-brand-gold bg-slate-50 hover:bg-white rounded-xl text-center cursor-pointer transition-all shrink-0"
                  >
                    <Store className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-700 block truncate">Vendor A</span>
                    <span className="text-[8px] font-mono text-slate-400 block truncate">Alexander</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {signupError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
                  {signupError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Emma Watson"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue rounded-xl pl-9 pr-4 py-2.5 text-xs outline-hidden text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="emma@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue rounded-xl pl-9 pr-4 py-2.5 text-xs outline-hidden text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-1">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue rounded-xl pl-9 pr-4 py-2.5 text-xs outline-hidden text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Register Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue rounded-xl px-3 py-2.5 text-xs outline-hidden text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="customer">Customer Access</option>
                    <option value="vendor">Vendor Shop</option>
                  </select>
                </div>
              </div>

              {signupRole === 'vendor' && (
                <div className="p-3 bg-brand-gold-pale border border-brand-gold-pale rounded-2xl space-y-2 animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold text-brand-blue">Store Details</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Shop / Store Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Athletics"
                      value={signupStore}
                      onChange={(e) => setSignupStore(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-hidden"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Sign Up as {signupRole === 'customer' ? 'Customer' : 'Vendor'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
