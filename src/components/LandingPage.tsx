/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Star, 
  Heart, 
  Plus, 
  Check, 
  Mail, 
  Percent, 
  UserPlus, 
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Product, Category, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  products: Product[];
  categories: Category[];
  vendors: User[];
  followedSellers: string[];
  onToggleFollowSeller: (sellerId: string) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  wishlistState: string[]; // List of product IDs
  onSelectProduct: (p: Product) => void;
  onBecomeSeller: () => void;
  onStartShoppingQuery: () => void;
}

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Peterson',
    role: 'Loyal Shopper',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    comment: 'The AI recommendations matched my desk setup perfectly! I bought the Walnut Desk Organizer, and the delivery took just two days. Outstanding quality.',
    rating: 5
  },
  {
    id: 2,
    name: 'Marcus Brody',
    role: 'Founder, Apex Athletics (Vendor)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    comment: 'Moving our storefront onto MarketHub tripled our revenue inside two months. The vendor predictive forecasting graphs helped us optimize inventory levels.',
    rating: 5
  },
  {
    id: 3,
    name: 'Sarah Chen',
    role: 'Lead UX Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    comment: 'The absolute cleanest e-commerce interface I have experienced this decade. Role switching is instantaneous and the smart assistant actually assists.',
    rating: 5
  }
];

export default function LandingPage({
  products,
  categories,
  vendors,
  followedSellers,
  onToggleFollowSeller,
  onAddToCart,
  onToggleWishlist,
  wishlistState,
  onSelectProduct,
  onBecomeSeller,
  onStartShoppingQuery
}: LandingPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const filteredProducts = activeCategory 
    ? products.filter(p => p.category === activeCategory)
    : products;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="space-y-16 pb-20" id="landing-page">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-brand-blue py-16 md:py-24 text-white rounded-b-[2rem]" id="hero-section">
        {/* Abstract design blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-12 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-white/10 p-1 px-3 rounded-full text-xs font-semibold text-brand-gold-light border border-white/5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen E-Commerce AI Marketplace</span>
            </div>
            
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-white">
              Buy, Sell & Grow <br />
              on One <span className="text-brand-gold underline decoration-wavy decoration-1">Marketplace</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed">
              Discover premium products from thousands of trusted independent vendors worldwide. Fueled by artificial intelligent recomendations.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={onStartShoppingQuery}
                className="bg-brand-gold hover:bg-brand-gold-light text-brand-blue font-extrabold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg hover:shadow-brand-gold/10 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Start Shopping 
                <ShoppingBag className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBecomeSeller}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Become a Seller 
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <p className="font-display font-bold text-2xl text-brand-gold">45k+</p>
                <p className="text-xs text-slate-400">Listed Products</p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-brand-gold">1.2k+</p>
                <p className="text-xs text-slate-400">Verified Sellers</p>
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-brand-gold">99.8%</p>
                <p className="text-xs text-slate-400">Fulfillment Rate</p>
              </div>
            </div>
          </div>

          {/* Interactive Hero Banner Graphic */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-slate-800/40 rounded-3xl p-4 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">LIVE FEED: WORLDWIDE LOGISTICS</span>
              </div>

              {/* Dynamic Mock Feed overlay */}
              <div className="space-y-4 my-auto py-4">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blend-normal bg-brand-gold/20 flex items-center justify-center font-bold text-brand-gold text-lg shrink-0">★</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">New Order fulfilled for @SarahC</p>
                    <p className="text-[10px] text-slate-400 truncate">AeroSound Max ANC Headphone • shipped from Ohio NY</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">DELIVERED</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-brand-gold shrink-0 animate-spin" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white">AI Suggestion Mode Active</p>
                    <p className="text-[10px] text-slate-400 truncate">Sartorial Blazer fits customer search intent</p>
                  </div>
                  <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded font-mono font-bold shrink-0">98% SCORE</span>
                </div>
              </div>

              <div className="bg-brand-gold text-brand-blue p-3.5 rounded-2xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span className="text-xs font-extrabold uppercase tracking-wide">MarketHub Hot Deal</span>
                </div>
                <span className="text-xs font-mono font-bold bg-brand-blue text-white px-2 py-0.5 rounded-md">-20% Coupon Added</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Value Features Section */}
      <section className="max-w-7xl mx-auto px-4" id="features">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-extrabold text-3xl text-brand-blue tracking-tight">
            E-Commerce Reimagined
          </h2>
          <p className="text-slate-500 text-sm">
            Experience security, intelligence, speed, and trusted quality in every single purchase.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Multi-Vendor Platform',
              desc: 'Shop from top boutique independent artists, major tech stores, and local organic growers seamlessly.',
              icon: ShoppingBag,
              color: 'bg-indigo-500/10 text-indigo-600'
            },
            {
              title: 'Secure Payments',
              desc: 'Your financial transfers are guarded via AES-256 Stripe, UPI, PayPal encryption protocols.',
              icon: ShieldCheck,
              color: 'bg-emerald-500/10 text-emerald-600'
            },
            {
              title: 'Fast Worldwide Delivery',
              desc: 'Benefit from consolidated vendor parcel pooling for standard 48-hour delivery thresholds.',
              icon: Truck,
              color: 'bg-blue-500/10 text-blue-600'
            },
            {
              title: 'Verified Trusted Sellers',
              desc: 'Every registered store completes high-level KYC tax background checks for consumer security.',
              icon: Check,
              color: 'bg-amber-500/10 text-amber-600'
            },
            {
              title: 'Instant Order Tracking',
              desc: 'Gain real-time GPS telemetry and visual step-tracking directly via your Customer Dashboard.',
              icon: MapPin,
              color: 'bg-cyan-500/10 text-cyan-600'
            },
            {
              title: 'AI Product Recommendation',
              desc: 'Powered by Gemini, our shopping engine understands complex queries and preferences dynamically.',
              icon: Sparkles,
              color: 'bg-purple-500/10 text-purple-600'
            }
          ].map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className={`w-11 h-11 rounded-xl ${feat.color} flex items-center justify-center mb-4 font-bold`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1.5">{feat.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Category Browser Grid */}
      <section className="max-w-7xl mx-auto px-4" id="categories-section">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1.5">
            <h2 className="font-display font-extrabold text-3xl text-brand-blue tracking-tight">
              Browse Categories
            </h2>
            <p className="text-slate-500 text-xs">Filter marketplace items instantly with one click</p>
          </div>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory('')}
              className="text-xs font-bold text-brand-blue hover:text-brand-gold flex items-center gap-1 cursor-pointer"
            >
              Clear Filter <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Responsive Flex / Grid Category selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)}
              className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-blue text-white border-brand-blue shadow-lg scale-105'
                  : 'bg-white text-slate-700 border-slate-100 hover:border-brand-gold/50 hover:scale-[1.02] shadow-xs'
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-10 h-10 object-cover rounded-full mx-auto mb-2.5 border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs font-bold truncate leading-tight">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Products Showcase List */}
      <section className="max-w-7xl mx-auto px-4" id="product-showcase">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <h2 className="font-display font-extrabold text-3xl text-brand-blue tracking-tight flex items-center gap-2">
              Featured Products <TrendingUp className="w-5 h-5 text-brand-gold" />
            </h2>
            <p className="text-slate-500 text-xs px-0.5">Custom-curated stellar quality. Click on any item card for rich spec galleries.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-500">
            <span className="px-3 py-1 bg-white rounded-lg shadow-xs text-brand-blue font-bold">Trending Recommendations</span>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => {
              const inWishlist = wishlistState.includes(p.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col group relative"
                >
                  {/* Category label badge */}
                  <span className="absolute top-3 left-3 bg-brand-blue/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10">
                    {p.category}
                  </span>

                  {/* Rating indicator */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-xs border border-slate-100">
                    <Star className="w-3 h-3 text-brand-gold fill-brand-gold shrink-0" />
                    <span>{p.rating}</span>
                  </div>

                  {/* Thumbnail */}
                  <div 
                    onClick={() => onSelectProduct(p)}
                    className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-brand-blue text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                        Quick View <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Meta desc */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 font-mono tracking-wider block uppercase mb-1">
                        {p.brand}
                      </span>
                      
                      <h4 
                        onClick={() => onSelectProduct(p)}
                        className="font-bold text-slate-900 text-sm hover:text-brand-blue cursor-pointer line-clamp-2 leading-snug mb-1"
                      >
                        {p.title}
                      </h4>

                      <p className="text-[10px] text-slate-500 mb-2 truncate">
                        Seller: <span className="font-semibold text-slate-700">{p.sellerName}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Price</span>
                        <span className="text-lg font-mono font-black text-brand-blue">${p.price}</span>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => onToggleWishlist(p)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            inWishlist
                              ? 'bg-red-50 border-red-200 text-red-500'
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onAddToCart(p)}
                          className="px-3.5 py-2 bg-brand-blue hover:bg-brand-blue-light text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Get
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. Top Sellers Section */}
      <section className="max-w-7xl mx-auto px-4" id="sellers-section">
        <div className="space-y-1.5 mb-8">
          <h2 className="font-display font-extrabold text-3xl text-brand-blue tracking-tight">
            Top Boutique Sellers
          </h2>
          <p className="text-slate-500 text-xs">Support independent makers, digital designers, and high-performance craft brands.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => {
            const isFollowed = followedSellers.includes(vendor.id);
            const totalVendorProds = products.filter(p => p.sellerId === vendor.id).length;
            
            return (
              <div 
                key={vendor.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col justify-between items-center relative overflow-hidden group"
              >
                {/* Visual badge top */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-gold/60" />

                <div className="mt-2 space-y-3">
                  <div className="relative">
                    <img
                      src={vendor.avatar}
                      alt={vendor.storeName}
                      className="w-16 h-16 object-cover rounded-2xl mx-auto border-2 border-brand-gold-pale shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-1/2 translate-x-8 bg-emerald-500 text-white p-0.5 rounded-full border border-white" title="Verified business status">
                      <Check className="w-3 h-3" />
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">{vendor.storeName}</h4>
                    <p className="text-[10px] text-slate-400 mb-1">Managed by {vendor.name}</p>
                    <div className="flex items-center justify-center gap-1 text-xs text-brand-gold font-bold">
                      <Star className="w-3.5 h-3.5 fill-brand-gold" />
                      <span>4.9</span>
                      <span className="text-slate-400 font-medium font-mono">({12 + totalVendorProds * 5} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{totalVendorProds} Products</span>
                  <span>•</span>
                  <span>USA Storefront</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleFollowSeller(vendor.id)}
                  className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isFollowed
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-gold-pale text-brand-blue hover:bg-brand-gold/20'
                  }`}
                >
                  {isFollowed ? 'Following Store' : 'Follow Seller'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="bg-brand-blue-pale/80 py-12 rounded-[2rem] max-w-7xl mx-auto px-4 relative overflow-hidden" id="testimonials">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[10px] bg-brand-gold/10 text-brand-blue font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Client Voices
          </span>
          
          <h3 className="font-display font-bold text-2xl sm:text-3.5xl text-brand-blue tracking-tight">
            What our community values
          </h3>

          <div className="min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed max-w-2xl mx-auto">
                  "{TESTIMONIALS[testimonialIdx].comment}"
                </p>
                
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={TESTIMONIALS[testimonialIdx].avatar}
                    alt={TESTIMONIALS[testimonialIdx].name}
                    className="w-11 h-11 object-cover rounded-full border border-brand-gold"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{TESTIMONIALS[testimonialIdx].name}</p>
                    <p className="text-xs text-slate-500">{TESTIMONIALS[testimonialIdx].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={prevTestimonial}
              className="p-2 bg-white rounded-full text-slate-600 hover:text-brand-blue shadow-xs hover:shadow-md cursor-pointer transition-all border border-slate-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 bg-white rounded-full text-slate-600 hover:text-brand-blue shadow-xs hover:shadow-md cursor-pointer transition-all border border-slate-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Newsletter Section */}
      <section className="bg-brand-blue text-white rounded-[2rem] max-w-7xl mx-auto p-8 sm:p-12 relative overflow-hidden" id="newsletter">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl" />
        
        <div className="max-w-xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 p-1 px-3 rounded-full text-xs font-semibold text-brand-gold-light">
            <Percent className="w-3.5 h-3.5" />
            <span>Unlock 20% Discount for First Order</span>
          </div>

          <h3 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
            Subscribe to market intelligence newsletters
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm">
            Get instant alerts on trending boutique sellers, price updates, coupon drops, and new AI system enhancements. No spam, ever.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-wrap sm:flex-nowrap gap-2 pt-2">
            <input
              type="email"
              required
              placeholder="Enter your personal or business email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-hidden focus:border-brand-gold text-sm"
            />
            <button
              type="submit"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-blue font-extrabold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              Subscribe Newsletter <Mail className="w-4 h-4" />
            </button>
          </form>

          {newsletterSubscribed && (
            <p className="text-xs text-brand-gold-pale font-semibold animate-pulse">
              ✓ Subscribed! Welcome gift coupon WELCOME10 has been sent to your mail inbox!
            </p>
          )}
        </div>
      </section>

      {/* 8. Modern Footer */}
      <footer className="pt-8 border-t border-slate-100" id="footer-section">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand block */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-blue text-white rounded-lg flex items-center justify-center font-display font-black text-lg">M</div>
              <h4 className="font-display font-extrabold text-xl text-brand-blue">MarketHub</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              An ecosystem where trusted vendors connect directly with consumers. Secured with robust financial pipelines and streamlined via semantic AI searches.
            </p>
            <div className="text-[10px] font-semibold text-slate-400 font-mono">
              CLIENT IP: LOCAL DEVELOPER SECURED
            </div>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">Shop</h5>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><button onClick={onStartShoppingQuery} className="hover:text-brand-blue">Browse Electronics</button></li>
              <li><button onClick={onStartShoppingQuery} className="hover:text-brand-blue">Men & Women Fashion</button></li>
              <li><button onClick={onStartShoppingQuery} className="hover:text-brand-blue">Modern Home Furniture</button></li>
              <li><button onClick={onStartShoppingQuery} className="hover:text-brand-blue">Beauty Care</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">Vendor Hub</h5>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><button onClick={onBecomeSeller} className="hover:text-brand-blue">Apply for Storefront</button></li>
              <li><button onClick={onBecomeSeller} className="hover:text-brand-blue">Fulfillment Guidelines</button></li>
              <li><button onClick={onBecomeSeller} className="hover:text-brand-blue">Tax / KYC policies</button></li>
              <li><button onClick={onBecomeSeller} className="hover:text-brand-blue">Drizzle / DB access</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">Legal</h5>
            <ul className="space-y-2.5 text-xs text-slate-500 font-medium">
              <li><a href="#" className="hover:text-brand-blue" onClick={(e) => {e.preventDefault(); alert("Interactive sandbox terms: Safe & simulated.");}}>Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-blue" onClick={(e) => {e.preventDefault(); alert("Simulated sandbox privacy compliance active.");}}>Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-blue" onClick={(e) => {e.preventDefault(); alert("MarketHub supports fully transparent billing.");}}>Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4 text-xs text-slate-400 font-medium font-mono mb-8">
          <span>© 2026 MarketHub, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-blue">GitHub Repo</span>
            <span>•</span>
            <span className="hover:text-brand-blue">API Docs</span>
            <span>•</span>
            <span className="hover:text-brand-blue text-brand-gold">Investor Demo Version</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
