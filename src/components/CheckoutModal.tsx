/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Percent, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Minus, 
  CheckCircle, 
  Truck,
  DollarSign
} from 'lucide-react';
import {   
  Product, 
  Address, 
  PaymentMethod, 
  Coupon, 
  OrderItem 
} from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutModalProps {
  cart: CartItem[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  coupons: Coupon[];
  onClose: () => void;
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (items: OrderItem[], total: number, discount: number, couponCode: string, address: Address, payMethodName: string) => void;
}

export default function CheckoutModal({
  cart,
  addresses,
  paymentMethods,
  coupons,
  onClose,
  onUpdateCartQty,
  onRemoveFromCart,
  onPlaceOrder
}: CheckoutModalProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // States of selection
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [selectedPaymentIdx, setSelectedPaymentIdx] = useState(0);
  const [selectedPayType, setSelectedPayType] = useState<'card' | 'razorpay' | 'paypal' | 'upi'>('card');
  const [upiFormId, setUpiFormId] = useState('');

  // Coupon promo state
  const [couponText, setCouponText] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // Generated Order state context for Tracking visual
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{
    id: string;
    trackingCode: string;
    total: number;
    shipping: string;
  } | null>(null);

  // Totals calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Coupon deduction
  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountValue = Math.round(subtotal * (appliedCoupon.value / 100));
    } else {
      discountValue = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const shippingCharges = (subtotal > 150 || (appliedCoupon?.code === 'FREESHIP')) ? 0 : 15;
  const grandTotal = Math.max(0, subtotal - discountValue + shippingCharges);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponText.trim().toUpperCase();
    const matched = coupons.find(c => c.code === cleanCode);
    
    if (matched) {
      if (subtotal < matched.minSpend) {
        setCouponError(`Min spend $${matched.minSpend} required.`);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(matched);
        setCouponError('');
        setCouponText('');
      }
    } else {
      setCouponError('Invalid token code. Try: WELCOME10 or GOLDEN20');
      setAppliedCoupon(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
  };

  const handleCheckoutSubmit = () => {
    if (cart.length === 0) return;
    
    const activeAddress = addresses[selectedAddressIdx] || {
      id: 'addr_temp',
      name: 'Registered Guest',
      street: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zip: '94043',
      country: 'United States',
      isDefault: true
    };

    const paymentLabel = selectedPayType === 'card' 
      ? `Credit Card (${paymentMethods[selectedPaymentIdx]?.cardNumber || '•••• 4242'})`
      : selectedPayType === 'upi' ? `BHIM UPI (${upiFormId || 'user@paytm'})`
      : selectedPayType === 'paypal' ? 'PayPal Digital Secure' : 'Razorpay Secure Net';

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const itemsForOrder: OrderItem[] = cart.map(item => ({
      id: `oi_${Date.now()}_${item.product.id}`,
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      sellerId: item.product.sellerId,
      sellerName: item.product.sellerName
    }));

    // Trigger state cascade in host
    onPlaceOrder(
      itemsForOrder,
      grandTotal,
      discountValue,
      appliedCoupon?.code || '',
      activeAddress,
      paymentLabel
    );

    setPlacedOrderDetails({
      id: orderId,
      trackingCode: trackCode,
      total: grandTotal,
      shipping: `${activeAddress.street}, ${activeAddress.city}`
    });

    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs" id="checkout-root">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header bar */}
        <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-5 h-5 text-brand-blue" />
            <h3 className="font-display font-black text-brand-blue text-base">
              {step === 'cart' ? 'Shopping Cart review' : step === 'checkout' ? 'Billing Delivery Secure Pipeline' : 'Purchase Receipt Verified'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-bold transition-colors cursor-pointer">
            Return to Store
          </button>
        </div>

        {/* Modal content body frame */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <div className="grid md:grid-cols-3 gap-8 h-full" id="checkout-step-cart">
              
              {/* Left Item list */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-display font-extrabold text-slate-900 text-base border-b border-slate-50 pb-2">Bagged Items ({cart.length})</h4>
                {cart.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-sm text-slate-400">Your shopping cart is empty.</p>
                    <button onClick={onClose} className="bg-brand-blue text-white px-5 py-2 rounded-xl text-xs font-bold">Go browse items</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center gap-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.title} 
                          className="w-14 h-14 object-cover rounded-xl border border-slate-100 shrink-0 bg-white" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-slate-900 text-xs truncate">{item.product.title}</h5>
                          <span className="text-[10px] text-slate-400 block font-semibold">Store: {item.product.sellerName}</span>
                          <span className="font-mono text-xs font-black text-brand-blue mt-1 block">${item.product.price} ea</span>
                        </div>

                        {/* Qty incrementors */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5 text-xs font-bold font-mono">
                            <button 
                              type="button"
                              onClick={() => {
                                if (item.quantity > 1) onUpdateCartQty(item.product.id, item.quantity - 1);
                              }}
                              className="p-1 px-1.5 text-slate-500 hover:text-brand-blue cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs text-slate-800">{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                if (item.quantity < item.product.stock) onUpdateCartQty(item.product.id, item.quantity + 1);
                              }}
                              className="p-1 px-1.5 text-slate-500 hover:text-brand-blue cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button 
                            type="button"
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Discard item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Summary calculator */}
              <div className="md:col-span-1 space-y-6">
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                  <h4 className="font-display font-black text-slate-900 text-sm">Summary Checkout</h4>
                  
                  <div className="space-y-2 text-xs font-semibold text-slate-600 border-b border-slate-250 pb-3">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-mono text-slate-800 font-bold">${subtotal}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span className="flex items-center gap-1">Promo: {appliedCoupon.code} <X className="w-3 h-3 bg-red-100 rounded-full cursor-pointer p-0.5" onClick={handleRemovePromo} /></span>
                        <span className="font-mono">-${discountValue}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Dispatch Charges</span>
                      <span className="font-mono text-slate-800 font-bold">{shippingCharges === 0 ? 'FREE' : `$${shippingCharges}`}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-900 font-bold pt-1">
                    <span className="text-xs">Estimate Total Bill</span>
                    <span className="text-xl font-mono font-black text-brand-blue">${grandTotal}</span>
                  </div>

                  {/* Coupon form */}
                  <form onSubmit={handleApplyPromo} className="pt-2 border-t border-slate-200">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Apply promo code</label>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        placeholder="e.g. WELCOME10" 
                        value={couponText}
                        onChange={(e) => setCouponText(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden text-center uppercase font-bold"
                      />
                      <button type="submit" className="bg-brand-blue text-white font-bold p-1 px-3 rounded-lg text-xs cursor-pointer">
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-red-500 font-bold mt-1 font-mono">{couponError}</p>}
                    {!appliedCoupon && <p className="text-[9px] text-slate-400 mt-1">Hint: Try WELCOME10 (10% Off) or GOLDEN20</p>}
                  </form>

                  <button
                    onClick={() => {
                      if (cart.length > 0) setStep('checkout');
                    }}
                    disabled={cart.length === 0}
                    className="w-full bg-brand-blue hover:bg-brand-blue-light disabled:opacity-50 text-white font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md"
                  >
                    Proceed Secure Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {step === 'checkout' && (
            <div className="grid md:grid-cols-3 gap-8 h-full" id="checkout-step-secure">
              
              {/* Left Shipping + Card info selection */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Delivery address selection */}
                <div className="space-y-3">
                  <h4 className="font-display font-extrabold text-slate-900 text-base">Select Shipment Address</h4>
                  {addresses.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <p className="text-xs text-slate-500">No custom addresses vault. Demo delivery defaults to the main shipping hub.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {addresses.map((addr, idx) => (
                        <div 
                          key={addr.id} 
                          onClick={() => setSelectedAddressIdx(idx)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedAddressIdx === idx
                              ? 'bg-brand-gold-pale border-brand-gold text-brand-blue scale-[1.01]'
                              : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-xs font-bold leading-none mb-1.5 flex items-center gap-1.5 uppercase font-mono mb-2">
                            <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {addr.name}
                          </p>
                          <p className="text-xs font-semibold">{addr.street}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{addr.city}, {addr.state} {addr.zip}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Secure multigateway payment interface selection */}
                <div className="space-y-4">
                  <h4 className="font-display font-extrabold text-slate-900 text-base">Select Secure Payment Gateway</h4>
                  
                  {/* Select Payment Method Tabs */}
                  <div className="grid grid-cols-4 gap-2 bg-slate-50 p-1 rounded-xl text-xs font-bold">
                    {(['card', 'razorpay', 'paypal', 'upi'] as const).map(pType => (
                      <button
                        key={pType}
                        onClick={() => setSelectedPayType(pType)}
                        className={`py-2 rounded-lg text-center transition-all cursor-pointer ${
                          selectedPayType === pType 
                            ? 'bg-brand-blue text-white shadow-xs' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {pType.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Render parameters */}
                  {selectedPayType === 'card' && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 animate-fade-in">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-brand-gold" /> Credit Card Secure Stripe Vault</p>
                      {paymentMethods.length === 0 ? (
                        <p className="text-xs text-slate-400">No cards synced. Simulated card processing activated.</p>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {paymentMethods.map((pm, idx) => (
                            <div 
                              key={pm.id} 
                              onClick={() => setSelectedPaymentIdx(idx)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                selectedPaymentIdx === idx
                                  ? 'bg-brand-blue text-white border-brand-blue'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <p className="text-sm font-bold font-mono tracking-wider mb-1">{pm.cardNumber}</p>
                              <p className="text-[10px] uppercase font-bold text-brand-gold leading-none">{pm.cardHolder}</p>
                              <p className="text-[9px] text-slate-400 font-mono">Exp {pm.expiry}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedPayType === 'razorpay' && (
                    <div className="p-5 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-2xl animate-fade-in text-center space-y-3">
                      <div className="p-1 px-3 bg-[#3B82F6] text-white rounded text-[10px] font-extrabold uppercase inline-block font-mono tracking-widest">Razorpay Instant Secured Checkout</div>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto">Click through checkout to instantly call standard Razorpay tokenized billing gateways.</p>
                    </div>
                  )}

                  {selectedPayType === 'paypal' && (
                    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-fade-in text-center space-y-3">
                      <div className="p-1 px-3 bg-amber-500 text-brand-blue rounded text-[10px] font-black uppercase inline-block font-mono">PayPal Secure checkout API</div>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto">Frictionless PayPal login popup is simulated securely without exposing personal cookie scopes.</p>
                    </div>
                  )}

                  {selectedPayType === 'upi' && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 animate-fade-in">
                      <p className="text-xs font-bold text-slate-800">Unified Payments Interface (BHIM UPI / Net Banking)</p>
                      <input 
                        type="text" 
                        placeholder="Enter Virtual Payment Address (e.g. user@upi)" 
                        value={upiFormId} 
                        onChange={(e) => setUpiFormId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  )}

                </div>

              </div>

              {/* Right Summary summary column */}
              <div className="md:col-span-1 space-y-4">
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <h4 className="font-display font-extrabold text-slate-900 text-sm">Purchase Breakdown</h4>
                  
                  <div className="space-y-2 text-xs text-slate-600 border-b border-slate-200 pb-3">
                    <div className="flex justify-between font-bold">
                      <span>Products Subtotal</span>
                      <span>${subtotal}</span>
                    </div>
                    {discountValue > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Promo Code Deduct</span>
                        <span>-${discountValue}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Worldwide dispatch</span>
                      <span>{shippingCharges === 0 ? 'FREE' : `$${shippingCharges}`}</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-black text-slate-900 items-center">
                    <span className="text-xs">Secure Total</span>
                    <span className="text-xl font-mono text-brand-blue">${grandTotal}</span>
                  </div>

                  <button
                    onClick={handleCheckoutSubmit}
                    className="w-full bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-brand-gold-light hover:to-yellow-400 text-brand-blue font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    Commit Verified Transaction <CheckCircle className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {step === 'success' && placedOrderDetails && (
            <div className="text-center py-12 max-w-md mx-auto space-y-6 animate-fade-in" id="checkout-step-success">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-slate-900">Purchase Authorized!</h3>
                <p className="text-xs text-slate-500">Your order has been filed directly onto the blockchain/database. A confirmation transaction details have been generated below.</p>
              </div>

              {/* Live Tracking Visual Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-4">
                <div className="flex justify-between text-xs font-bold font-mono text-slate-400 border-b border-slate-200/50 pb-2">
                  <span>TICKET ID: {placedOrderDetails.id}</span>
                  <span className="text-brand-blue font-extrabold font-black">${placedOrderDetails.total} Paid</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase leading-none">Shipping Carrier Track Number</p>
                  <p className="text-sm font-mono font-extrabold text-slate-900 font-bold">{placedOrderDetails.trackingCode}</p>
                </div>

                {/* Visual shipment track visual progress bar */}
                <div className="space-y-2 pt-2 border-t border-slate-200/40">
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Real-Time Transit Progress</p>
                  <div className="relative flex justify-between items-center text-center">
                    <div className="absolute inset-x-0 h-1 bg-slate-200 top-2 z-0" />
                    <div className="absolute left-0 h-1 bg-brand-blue top-2 z-0" style={{ width: '33%' }} />
                    
                    {[
                      { label: 'Authorized', done: true },
                      { label: 'Under Verification', done: true },
                      { label: 'Shipped from Hub', done: false },
                      { label: 'Carrier Fulfill', done: false }
                    ].map((step, sIdx) => (
                      <div key={sIdx} className="relative z-10 text-center flex flex-col items-center">
                        <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[9px] ${
                          step.done ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {step.done ? '✓' : sIdx + 1}
                        </div>
                        <span className={`text-[8px] mt-1 font-bold ${step.done ? 'text-brand-blue' : 'text-slate-400'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-normal bg-brand-gold-pale p-3 rounded-xl border border-brand-gold/10 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-gold shrink-0 animate-bounce" /> 
                  <span>Estimated ground courier handover delivery scheduled in 3 days.</span>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-brand-blue hover:bg-brand-blue-light text-white font-extrabold px-8 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
