/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Plus, 
  Minus, 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  User, 
  Store, 
  Share2,
  Bookmark
} from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (p: Product, quantity: number) => void;
  onToggleWishlist: (p: Product) => void;
  isInWishlist: boolean;
  onSelectProduct: (p: Product) => void;
}

export default function ProductDetailModal({
  product,
  allProducts,
  reviews,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct
}: ProductDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  
  // Review rating forms
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [customReviews, setCustomReviews] = useState<Review[]>([]);

  // Filter reviews matching current item
  const productReviews = [
    ...reviews.filter(r => r.productId === product.id),
    ...customReviews
  ];

  // Map similar products based on the same category (excluding current item)
  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const incrementQty = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      userName: 'Sarah Chen (Guest)',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setCustomReviews(prev => [newRev, ...prev]);
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" id="product-detail-root">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header toolbar */}
        <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Product Intelligence Board</span>
          
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 px-3 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 cursor-pointer"
          >
            Close Detail Panel
          </button>
        </div>

        {/* Scrollable specs frame */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Gallery Left */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative shadow-sm">
                <img 
                  src={product.images[activeImageIdx] || product.images[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIdx === idx ? 'border-brand-gold' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info specs Right */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block font-mono mb-1">{product.brand}</span>
                <h2 className="font-display font-extrabold text-2xl text-brand-blue tracking-tight leading-tight mb-2">{product.title}</h2>
                
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1 text-brand-gold">
                    <Star className="w-4 h-4 fill-brand-gold shrink-0" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-mono">({productReviews.length} Verified reviews)</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="text-[10px] bg-slate-100 text-slate-800 uppercase px-2.5 py-0.5 rounded-full font-mono tracking-wider font-bold">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold mb-0.5">Dispatched price</span>
                  <span className="text-3xl font-mono font-black text-brand-blue">${product.price}</span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold mb-1">Store Status</span>
                  {product.stock > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">In Stock ({product.stock} units)</span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-800 bg-red-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">Sold Out</span>
                  )}
                </div>
              </div>

              {/* Product description paragraph */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{product.description}</p>

              {/* Incrementor + Cart Triggers */}
              {product.stock > 0 && (
                <div className="flex flex-wrap gap-4 items-center pt-3 border-t border-slate-50">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 font-mono font-bold shrink-0">
                    <button onClick={decrementQty} className="p-2 text-slate-500 hover:text-brand-blue cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="px-3.5 text-xs text-slate-800">{quantity}</span>
                    <button onClick={incrementQty} className="p-2 text-slate-500 hover:text-brand-blue cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="flex-1 bg-brand-blue hover:bg-brand-blue-light text-white font-extrabold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    Add to Cart Bag <ShoppingBag className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                      isInWishlist 
                        ? 'bg-red-50 border-red-200 text-red-500' 
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                  </button>
                </div>
              )}

              {/* Trust parameters */}
              <div className="grid grid-cols-3 gap-3 border-t border-slate-50 pt-4 text-center">
                <div className="p-2.5 bg-slate-50/50 rounded-xl">
                  <Truck className="w-4 h-4 text-brand-gold mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-700 block">Fast ground delivery</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-700 block">Verified business KYC</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 rounded-xl">
                  <RefreshCw className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-700 block">7 Day returns window</span>
                </div>
              </div>

              {/* Seller details badge */}
              <div className="p-4 border border-slate-100 rounded-2xl bg-brand-gold-pale flex gap-3 items-center">
                <Store className="w-5 h-5 text-brand-gold shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider font-bold">Independent Creator</p>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{product.sellerName}</p>
                </div>
                <span className="text-[10px] bg-brand-blue text-white px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0 font-mono">USA STORE</span>
              </div>
            </div>

          </div>

          {/* Separator specs & reviews buttons */}
          <div className="border-t border-slate-100 pt-8" id="specs-reviews-tab">
            <div className="flex gap-4 border-b border-slate-100 pb-2 mb-4">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 text-sm font-bold font-display relative cursor-pointer ${
                  activeTab === 'specs' ? 'text-brand-blue border-b-2 border-brand-blue font-black' : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                Specifications List
              </button>
              
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-sm font-bold font-display relative cursor-pointer ${
                  activeTab === 'reviews' ? 'text-brand-blue border-b-2 border-brand-blue font-black' : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                Product reviews ({productReviews.length})
              </button>
            </div>

            {/* Spec list representation */}
            {activeTab === 'specs' && (
              <div className="grid sm:grid-cols-2 gap-4 animate-fade-in text-xs font-semibold">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-slate-50 border border-slate-100/60 rounded-xl font-mono text-slate-700">
                    <span className="text-slate-400 font-bold uppercase">{key}</span>
                    <span className="font-extrabold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews list representation */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Form to submit review */}
                <form onSubmit={handlePostReview} className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-wider">Leave a Verified Review</h4>
                  <div className="flex gap-2 items-center">
                    <span className="text-[11px] font-bold text-slate-400">Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(starNum => (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => setReviewRating(starNum)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${reviewRating >= starNum ? 'text-brand-gold fill-brand-gold' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <textarea
                    rows={2}
                    required
                    placeholder="Write your item review details (sound latency, tactile feel, build quality)..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                  
                  <button type="submit" className="bg-brand-blue text-white font-bold p-1.5 px-4 rounded-xl text-xs cursor-pointer">
                    Publish Review
                  </button>
                </form>

                {/* List */}
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">No reviews logged yet. Be the first to publish a review!</p>
                  ) : (
                    productReviews.map(rev => (
                      <div key={rev.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-3.5">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 object-cover rounded-full border border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="font-bold text-slate-900 text-xs">{rev.userName}</h5>
                            <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[10px] text-brand-gold font-bold mb-2">
                            <span className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-brand-gold text-brand-gold' : 'text-slate-300'}`} />
                              ))}
                            </span>
                            <span>({rev.rating}.0)</span>
                          </div>
                          
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold">{rev.comment}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Similar products carousel */}
          {similarProducts.length > 0 && (
            <div className="border-t border-slate-100 pt-8" id="similar-section">
              <h4 className="font-display font-extrabold text-slate-900 text-lg mb-4">Recommended Similar Products</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarProducts.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => onSelectProduct(p)}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] text-center"
                  >
                    <img src={p.images[0]} alt={p.title} className="w-full h-28 object-cover rounded-xl mb-2.5 border border-slate-55" referrerPolicy="no-referrer" />
                    <h5 className="font-bold text-slate-900 text-xs truncate">{p.title}</h5>
                    <span className="font-mono text-xs font-black text-brand-blue">${p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
