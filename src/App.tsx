/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS,
  INITIAL_REVIEWS
} from './data';
import { 
  Product, 
  User as UserType, 
  Order, 
  Category, 
  OrderItem, 
  Address 
} from './types';

// Importing subcomponents
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import CustomerDashboard from './components/CustomerDashboard';
import VendorDashboard from './components/VendorDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import AISearchAssistant from './components/AISearchAssistant';
import AuthModal from './components/AuthModal';

import { Sparkles, Sliders, ShoppingBag, Eye, Heart, Database, Terminal } from 'lucide-react';

export default function App() {
  // --- DATABASE STATE LAYERS ---
  const [users, setUsers] = useState<UserType[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);

  // --- LOGGED-IN SESSION USER ---
  // Default logged in user is Sarah Chen (Role: Customer)
  const [currentUser, setCurrentUser] = useState<UserType | null>(INITIAL_USERS[0]);

  // --- AUTH MODAL STATE ---
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('home');
  };

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    // Automatically redirect to the correct perspective dashboard for beautiful presentation value
    setCurrentScreen('dashboard');
  };

  const handleRegister = (newUser: UserType) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentScreen('dashboard');
  };

  // --- CUSTOMER TRANSACTION STATES ---
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [followedSellers, setFollowedSellers] = useState<string[]>(['v1']);

  // --- QUERY FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // --- SELECTED INTERACTIVE MODAL VIEWS ---
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // --- ACTIVE MAIN SCREEN ROUTING VIEW ---
  // 'home' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'dashboard'>('home');

  // --- USER PROFILE SYSTEM SYNC ---
  const handleUpdateUserProfile = (updatedUser: UserType) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // --- LOGGED IN ROLE SWITCHER ---
  const handleChangeRole = (role: 'customer' | 'vendor') => {
    // Locate corresponding mock demo account in system list
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      // Create lazy new backup profile if non-existent
      const newBackup: UserType = {
        id: `u_${Date.now()}`,
        name: `${role.toUpperCase()} Sandbox Profile`,
        email: `${role}@markethub.com`,
        role: role,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        addresses: [],
        paymentMethods: []
      };
      setUsers(prev => [...prev, newBackup]);
      setCurrentUser(newBackup);
    }
    // Redirect perspective to dashboard instantly for clean presentation value
    setCurrentScreen('dashboard');
  };

  // --- CART OPERATIONS ---
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const matchIdx = prev.findIndex(item => item.product.id === product.id);
      if (matchIdx > -1) {
        const copy = [...prev];
        copy[matchIdx].quantity = Math.min(product.stock, copy[matchIdx].quantity + quantity);
        return copy;
      } else {
        return [...prev, { product, quantity }];
      }
    });
    // Visual alerts
    alert(`Added ${quantity} unit(s) of "${product.title}" to your checkout bag!`);
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // --- WISHLIST SAVED ---
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const match = prev.find(p => p.id === product.id);
      if (match) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // --- FOLLOW/UNFOLLOW SELLER LISTS ---
  const handleToggleFollowSeller = (sellerId: string) => {
    setFollowedSellers(prev => {
      if (prev.includes(sellerId)) {
        return prev.filter(id => id !== sellerId);
      } else {
        return [...prev, sellerId];
      }
    });
  };

  // --- SEARCH AND AUTOMATION HANDLERS ---
  const handleSearchQuery = (query: string, categoryId: string) => {
    setSearchQuery(query);
    setSelectedCategoryFilter(categoryId);
    setCurrentScreen('home');
  };

  // --- CATALOG STOCK DEDUCTION / PLACE SECURE ORDER SYSTEM ---
  const handlePlaceOrder = (
    items: OrderItem[],
    total: number,
    discount: number,
    couponCode: string,
    shippingAddr: Address,
    payMethodName: string
  ) => {
    if (!currentUser) {
      alert("Please login or register to finalize checkout orders.");
      setAuthModalTab('login');
      setAuthModalOpen(true);
      return;
    }
    // Register order
    const newOrdId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: newOrdId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      items,
      total,
      discount,
      status: 'pending',
      paymentMethod: payMethodName,
      paymentStatus: 'paid', // Autopay sandbox-compliance
      shippingAddress: shippingAddr,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      trackingCode: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      couponUsed: couponCode || undefined
    };

    // Deduct stocks in database
    setProducts(prev => prev.map(p => {
      const purchasedIdx = items.find(it => it.productId === p.id);
      if (purchasedIdx) {
        return { ...p, stock: Math.max(0, p.stock - purchasedIdx.quantity) };
      }
      return p;
    }));

    setOrders(prev => [newOrder, ...prev]);
    // Clear shopping cart
    setCart([]);
  };

  // --- VENDOR INVENTORY MANAGEMENT ---
  const handleAddProduct = (p: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => {
    if (!currentUser) return;
    const newSku: Product = {
      ...p,
      id: `p_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.storeName || 'Custom Store',
      isApproved: true // Auto approved for responsive testing inside our developer portal
    };
    setProducts(prev => [newSku, ...prev]);
    alert(`SKU listing registered successfully! Check out the Landing Page.`);
  };

  const handleEditProduct = (p: Product) => {
    setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    alert(`Catalog item "${p.title}" details updated safely.`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    alert(`Product SKU deleted from MarketHub registers.`);
  };

  const handleBulkUploadProducts = (productsStringOfJson: string) => {
    try {
      const parsed = JSON.parse(productsStringOfJson);
      if (!Array.isArray(parsed)) throw new Error('Root structure must be a list of custom fields.');
      
      if (!currentUser) return;
      const converted: Product[] = parsed.map((item: any, idx) => ({
        id: `p_bulk_${Date.now()}_${idx}`,
        title: item.title || 'Bulk SKU Product Asset',
        description: item.description || 'Verified product characteristics published in packaging schemas.',
        price: parseFloat(item.price) || 29.99,
        rating: 5.0,
        category: item.category || 'electronics',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
        sellerId: currentUser.id,
        sellerName: currentUser.storeName || 'Verified Merchant',
        stock: parseInt(item.stock) || 12,
        reviewsCount: 0,
        isFeatured: false,
        isApproved: true,
        brand: item.brand || 'Generic',
        specs: { 'Origin': 'Worldwide Raw Import', 'Specs Checked': 'Authorized Hub' }
      }));

      setProducts(prev => [...converted, ...prev]);
    } catch (e: any) {
      throw new Error(`JSON parsing parsing error: ${e.message}`);
    }
  };

  const handleRestockProduct = (productId: string, amount: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + amount } : p));
  };

  // --- VENDOR CUSTOM CARRIER SHIFT ---
  const handleChangeOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
  };

  const handleUpdateStoreSettings = (settings: { storeName: string; logo: string; description: string; kycDetails?: UserType['kycDetails'] }) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? ({
      ...prev,
      storeName: settings.storeName,
      avatar: settings.logo,
      kycDetails: settings.kycDetails || prev.kycDetails,
      kycStatus: settings.kycDetails ? 'verified' : prev.kycStatus
    }) : null);

    setUsers(prev => prev.map(u => u.id === currentUser.id ? {
      ...u,
      storeName: settings.storeName,
      avatar: settings.logo,
      kycDetails: settings.kycDetails || u.kycDetails,
      kycStatus: settings.kycDetails ? 'verified' : u.kycStatus
    } : u));
  };

  // --- ADMIN SYSTEMS CORE ACCESS ---
  const handleApproveVendor = (vendorId: string) => {
    setUsers(prev => prev.map(u => u.id === vendorId ? { ...u, kycStatus: 'verified' } : u));
  };
  
  const handleRejectVendor = (vendorId: string) => {
    setUsers(prev => prev.map(u => u.id === vendorId ? { ...u, kycStatus: 'unverified' } : u));
  };

  const handleSuspendVendor = (vendorId: string) => {
    setUsers(prev => prev.map(u => u.id === vendorId ? { ...u, kycStatus: 'unverified', storeName: 'STOREFRONT SUSPENDED' } : u));
  };

  const handleApproveProduct = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isApproved: true } : p));
  };

  const handleAddCategoryGlobal = (newCat: Omit<Category, 'id'>) => {
    const id = newCat.name.toLowerCase().replace(/\s+/g, '-');
    setCategories(prev => [...prev, { ...newCat, id }]);
    alert(`Category layout updated. Node registered!`);
  };

  const handleUpdateOrderStatusGlobal = (orderId: string, status: Order['status'], paymentStatus: Order['paymentStatus']) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status, paymentStatus } : ord));
  };

  const handleReturnRequest = (orderId: string) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: 'cancelled', paymentStatus: 'refunded' } : ord));
  };

  // --- DYNAMIC SEARCH & FILTER EXECUTION ---
  const processedFilteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter ? p.category === selectedCategoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between" id="app-root">
      
      {/* Dynamic Navigation & Role manager */}
      <Header 
        currentUser={currentUser}
        onChangeRole={handleChangeRole}
        categories={categories}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        products={products}
        onOpenCartAndCheckout={() => {
          if (!currentUser) {
            setAuthModalTab('login');
            setAuthModalOpen(true);
            alert("Please sign in or create an account to view your cart!");
          } else if (cart.length === 0) {
            alert("Your shopping cart is empty!");
          } else {
            setCheckoutOpen(true);
          }
        }}
        onOpenWishlist={() => {
          if (!currentUser) {
            setAuthModalTab('login');
            setAuthModalOpen(true);
            alert("Please sign in or create an account to access your wishlist!");
          } else {
            setCurrentScreen('dashboard');
            // Wait mock rendering cycle
            setTimeout(() => {
              const overviewBtn = document.querySelector('[id*="wishlist"]') as HTMLButtonElement;
              if (overviewBtn) overviewBtn.click();
            }, 100);
          }
        }}
        onOpenAIAssistant={() => setAiAssistantOpen(true)}
        onSelectProduct={(p) => setViewingProduct(p)}
        onSearchQuery={handleSearchQuery}
        onNavigateHome={() => {
          setSearchQuery('');
          setSelectedCategoryFilter('');
          setCurrentScreen('home');
        }}
        onOpenAuth={(tab) => {
          setAuthModalTab(tab);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container screen routers */}
      <main className="flex-1">
        {currentScreen === 'home' ? (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            {/* Display search terms if search queries resolved */}
            {(searchQuery || selectedCategoryFilter) && (
              <div className="mb-6 p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-semibold text-slate-600">
                <span>
                  Query Results for: <span className="font-extrabold text-brand-blue">"{searchQuery || 'Category: ' + selectedCategoryFilter}"</span> 
                  • ({processedFilteredProducts.length} items returned)
                </span>
                
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryFilter('');
                  }}
                  className="p-1 px-3 bg-brand-gold-pale hover:bg-brand-gold/20 text-brand-blue font-bold rounded-lg cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}

            <LandingPage 
              products={processedFilteredProducts}
              categories={categories}
              vendors={users.filter(u => u.role === 'vendor')}
              followedSellers={followedSellers}
              onToggleFollowSeller={handleToggleFollowSeller}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onToggleWishlist={handleToggleWishlist}
              wishlistState={wishlist.map(p => p.id)}
              onSelectProduct={(p) => setViewingProduct(p)}
              onBecomeSeller={() => {
                handleChangeRole('vendor');
                setTimeout(() => {
                  const setBtn = document.querySelector('[id*="settings"]') as HTMLButtonElement;
                  if (setBtn) setBtn.click();
                }, 100);
              }}
              onStartShoppingQuery={() => {
                const el = document.getElementById('categories-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          <div className="animate-fade-in" id="dashboard-router-layer">
            
            {/* Quick dashboard back button */}
            <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-between">
              <button
                onClick={() => setCurrentScreen('home')}
                className="text-xs font-bold text-brand-blue hover:text-brand-gold flex items-center gap-1 cursor-pointer"
              >
                ← Back to Marketplace Home
              </button>

              <span className="text-[10px] bg-slate-900 text-slate-300 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Viewing perspective: {currentUser ? currentUser.role : 'Guest'}
              </span>
            </div>

            {currentUser ? (
              <>
                {/* 1. Customer Dashboard */}
                {currentUser.role === 'customer' && (
                  <CustomerDashboard 
                    currentUser={currentUser}
                    orders={orders}
                    onUpdateUser={handleUpdateUserProfile}
                    wishlistProducts={wishlist}
                    onRemoveFromWishlist={handleToggleWishlist}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onViewProduct={(p) => setViewingProduct(p)}
                    onReturnOrderRequest={handleReturnRequest}
                  />
                )}

                {/* 2. Vendor Dashboard */}
                {currentUser.role === 'vendor' && (
                  <VendorDashboard 
                    currentUser={currentUser}
                    products={products}
                    orders={orders}
                    onAddProduct={handleAddProduct}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onBulkUploadProducts={handleBulkUploadProducts}
                    onRestockProduct={handleRestockProduct}
                    onChangeOrderStatus={handleChangeOrderStatus}
                    onUpdateStoreSettings={handleUpdateStoreSettings}
                  />
                )}

                {/* 3. Admin Dashboard */}
                {currentUser.role === 'admin' && (
                  <AdminDashboard 
                    currentUser={currentUser}
                    users={users}
                    products={products}
                    orders={orders}
                    categories={categories}
                    onApproveVendor={handleApproveVendor}
                    onRejectVendor={handleRejectVendor}
                    onSuspendVendor={handleSuspendVendor}
                    onApproveProduct={handleApproveProduct}
                    onAddCategory={handleAddCategoryGlobal}
                    onUpdateOrderStatusGlobal={handleUpdateOrderStatusGlobal}
                  />
                )}
              </>
            ) : (
              <div className="max-w-md mx-auto text-center py-20 px-6 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-6 my-10 animate-fade-in">
                <div className="w-16 h-16 bg-brand-gold/15 text-brand-blue rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto shadow-inner">👤</div>
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-2xl text-slate-900">Dashboard Locked</h3>
                  <p className="text-slate-500 text-xs">You must be logged in as a registered customer or vendor to access the dashboard views.</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); }}
                    className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { setAuthModalTab('signup'); setAuthModalOpen(true); }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Register Account
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </main>



      {/* --- DIALOG COMPONENT RENDERS --- */}

      {/* 1. Conversational AI shopping assistant drawer */}
      <AISearchAssistant 
        products={products}
        onSelectProduct={(p) => setViewingProduct(p)}
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />

      {/* 2. Product Details popup details */}
      {viewingProduct && (
        <ProductDetailModal 
          product={viewingProduct}
          allProducts={products}
          reviews={INITIAL_REVIEWS}
          onClose={() => setViewingProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isInWishlist={wishlist.some(p => p.id === viewingProduct.id)}
          onSelectProduct={(p) => setViewingProduct(p)}
        />
      )}

      {/* 3. Shopping Cart Drawer / Checkout processor */}
      {checkoutOpen && currentUser && (
        <CheckoutModal 
          cart={cart}
          addresses={currentUser.addresses}
          paymentMethods={currentUser.paymentMethods}
          coupons={coupons}
          onClose={() => setCheckoutOpen(false)}
          onUpdateCartQty={handleUpdateCartQty}
          onRemoveFromCart={handleRemoveFromCart}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {/* 4. Credentials Authentication flow modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        users={users}
        onRegister={handleRegister}
        onLogin={handleLogin}
        initialTab={authModalTab}
      />

    </div>
  );
}
