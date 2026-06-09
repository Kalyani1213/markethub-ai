/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  Briefcase, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Upload, 
  Sliders, 
  LineChart, 
  Sparkles, 
  Store, 
  Layers, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { Product, Order, User as UserType, SalesForecastingItem } from '../types';
import { fetchSalesForecasting } from '../data';

interface VendorDashboardProps {
  currentUser: UserType;
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBulkUploadProducts: (productsStringOfJson: string) => void;
  onRestockProduct: (productId: string, amount: number) => void;
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateStoreSettings: (settings: { storeName: string; logo: string; description: string; kycDetails?: UserType['kycDetails'] }) => void;
}

export default function VendorDashboard({
  currentUser,
  products,
  orders,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onBulkUploadProducts,
  onRestockProduct,
  onChangeOrderStatus,
  onUpdateStoreSettings
}: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'forecasting' | 'settings'>('overview');

  // Vendor filtered dataset
  const vendorProducts = products.filter(p => p.sellerId === currentUser.id);
  const vendorOrders = orders.filter(ord => ord.items.some(i => i.sellerId === currentUser.id));

  // Statistics calculation
  const totalQtySold = vendorOrders.reduce((acc, ord) => {
    const vItems = ord.items.filter(i => i.sellerId === currentUser.id);
    return acc + vItems.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const totalRevenue = vendorOrders.reduce((acc, ord) => {
    if (ord.paymentStatus !== 'paid') return acc;
    const vItems = ord.items.filter(i => i.sellerId === currentUser.id);
    const orderSum = vItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return acc + orderSum;
  }, 0);

  // Add Product Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newCategory, setNewCategory] = useState('electronics');
  const [newBrand, setNewBrand] = useState('Generic');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');

  // Editing Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Bulk Upload text state
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState(false);

  // Forecasting list
  const forecasts = fetchSalesForecasting(currentUser.id);

  // Store Configuration Settings Form State
  const [storeNameForm, setStoreNameForm] = useState(currentUser.storeName || '');
  const [storeLogoForm, setStoreLogoForm] = useState(currentUser.avatar || '');
  const [storeDesc, setStoreDesc] = useState('Boutique marketplace vendor of verified goods.');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // KYC setup states
  const [taxId, setTaxId] = useState(currentUser.kycDetails?.taxId || '');
  const [businessPhone, setBusinessPhone] = useState(currentUser.kycDetails?.phone || '');
  const [businessName, setBusinessName] = useState(currentUser.kycDetails?.businessName || '');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    onAddProduct({
      title: newTitle,
      description: newDesc || "High quality generic marketplace element manufactured to verified requirements.",
      price: parseFloat(newPrice),
      rating: 5.0,
      category: newCategory,
      images: [newImage],
      stock: parseInt(newStock) || 10,
      reviewsCount: 0,
      isFeatured: false,
      isApproved: true, // Auto approved for demo sandbox
      brand: newBrand,
      specs: { 'Origin': 'Imported', 'Fulfillment': '48h Ground Shipping' }
    });
    setNewTitle('');
    setNewPrice('');
    setNewStock('10');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onEditProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleBulkUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!bulkText.trim()) throw new Error('Please insert JSON or comma separated lists');
      onBulkUploadProducts(bulkText);
      setBulkSuccess(true);
      setBulkText('');
      setBulkError('');
      setTimeout(() => setBulkSuccess(false), 4000);
    } catch (err: any) {
      setBulkError(err.message || 'Invalid product structure. Keep brackets layout intact.');
    }
  };

  const handleStoreUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings({
      storeName: storeNameForm,
      logo: storeLogoForm,
      description: storeDesc,
      kycDetails: {
        businessName: businessName || storeNameForm,
        taxId: taxId || 'US-98XXXXX',
        phone: businessPhone || '+1 (555) 765-4321',
        documentUrl: 'https://example.com/kyc-verified-doc.pdf'
      }
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="vendor-dashboard">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Nav menu */}
        <div className="lg:w-1/4 space-y-4 shrink-0">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-xl" />
            <img 
              src={currentUser.avatar} 
              alt={currentUser.storeName} 
              className="w-16 h-16 object-cover rounded-2xl mx-auto mb-3 border-2 border-brand-gold bg-slate-100" 
              referrerPolicy="no-referrer"
            />
            <h3 className="font-display font-black text-slate-900 text-lg leading-tight">{currentUser.storeName || 'My Store'}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-2">Merchant Account of {currentUser.name}</p>
            
            <div className="flex justify-center gap-1.5 items-center">
              {currentUser.kycStatus === 'verified' ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-mono">
                  ★ KYC PRO GOLD
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-mono animate-pulse">
                  ⚠ KYC PENDING
                </span>
              )}
            </div>
          </div>

          <nav className="bg-white p-2 rounded-2xl border border-slate-100 shadow-xs space-y-1">
            {[
              { id: 'overview', name: 'Sales Stats', icon: TrendingUp },
              { id: 'products', name: 'Products Catalog', icon: Package },
              { id: 'orders', name: 'Vendor Orders Logs', icon: FileText },
              { id: 'inventory', name: 'Inventory & Stock alerts', icon: Briefcase },
              { id: 'forecasting', name: 'AI Sales Forecasting', icon: LineChart },
              { id: 'settings', name: 'Store Customizer', icon: Store }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold font-display flex items-center gap-2.5 transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-brand-blue text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tab Content */}
        <div className="flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in" id="vendor-overview">
              {/* Stats Tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full absolute top-4 right-4">LIVE</span>
                  <span className="text-xs font-semibold text-slate-500 block">Active Revenue</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">${totalRevenue}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Units Dispatched</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{totalQtySold} items</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Total Listing Count</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">{vendorProducts.length} SKU</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block">Incoming Orders</span>
                  <span className="text-2.5xl font-mono font-black text-brand-blue mt-1 block">
                    {vendorOrders.filter(o => o.status !== 'delivered').length}
                  </span>
                </div>
              </div>

              {/* Visual Performance list (Aesthetic bento chart list representation) */}
              <div className="bento-layout grid md:grid-cols-3 gap-6">
                
                {/* Visual Sales List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs md:col-span-2">
                  <h4 className="font-display font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
                    Recent Revenue Stream <Sliders className="w-4 h-4 text-brand-gold animate-spin" />
                  </h4>
                  {vendorOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 py-10">No checkout purchases logged for your products yet.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {vendorOrders.slice(0, 3).map(ord => {
                        const itemsFromMe = ord.items.filter(i => i.sellerId === currentUser.id);
                        const partialSum = itemsFromMe.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        return (
                          <div key={ord.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100/60">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-brand-blue">{ord.id}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-00'
                                }`}>{ord.paymentStatus}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-md mt-0.5">
                                {itemsFromMe.map(i => `${i.title} (x${i.quantity})`).join(', ')}
                              </p>
                            </div>
                            <span className="font-mono font-bold text-brand-blue text-sm">+${partialSum}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Performance Pie List representation */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-900 text-base mb-3">Item Performance</h4>
                    <p className="text-[11px] text-slate-500 leading-tight mb-4">Percentage allocation of listed stock relative to standard retail capacity.</p>
                  </div>
                  
                  <div className="space-y-3 font-mono text-[11px]">
                    {vendorProducts.slice(0, 3).map(p => {
                      const ratio = Math.min(100, Math.round((p.stock / 150) * 100));
                      return (
                        <div key={p.id} className="space-y-1">
                          <div className="flex justify-between text-slate-700 font-bold">
                            <span className="truncate max-w-[120px]">{p.title}</span>
                            <span>{ratio}% Stock</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-blue h-full" style={{ width: `${ratio}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8 animate-fade-in" id="vendor-products">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex flex-wrap gap-4 items-center justify-between pb-4 border-b border-slate-50">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-900 text-lg">Product Listings ({vendorProducts.length})</h4>
                    <p className="text-xs text-slate-500">Edit, remove, or bulk import custom merchandise profiles instantly.</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold p-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Single
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('products');
                        setBulkText(`[
  {
    "title": "Aura Silk Satin Eye Pillow",
    "price": 38,
    "category": "beauty",
    "brand": "Aura Bloom",
    "stock": 25,
    "description": "Premium luxury silk pillow blocks sleep disruptions."
  }
]`);
                        alert("Preset mock JSON injected. Click Submit Bulk to process!");
                      }}
                      className="bg-brand-gold-pale hover:bg-brand-gold/20 text-brand-blue font-bold p-2.5 px-4 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Load Mock Bulk
                    </button>
                  </div>
                </div>

                {/* Add product expandable layer */}
                {showAddForm && (
                  <form onSubmit={handleAddSubmit} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 my-4 animate-fade-in">
                    <p className="text-xs font-extrabold text-brand-blue flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-brand-gold fill-brand-gold" /> NEW LISTING PARAMETERS
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Product Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. AeroSound Gen-4" 
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Unit Price ($)</label>
                          <input 
                            type="number" 
                            required 
                            placeholder="299" 
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Stock Qty</label>
                          <input 
                            type="number" 
                            required 
                            placeholder="10" 
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Merchandise Category</label>
                        <select 
                          value={newCategory} 
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                        >
                          <option value="electronics">Electronics</option>
                          <option value="home">Home & Living</option>
                          <option value="sports">Sports</option>
                          <option value="fashion">Fashion</option>
                          <option value="beauty">Beauty</option>
                          <option value="groceries">Groceries</option>
                          <option value="books">Books</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Brand Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. AeroSound" 
                          value={newBrand}
                          onChange={(e) => setNewBrand(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Product Image Link URL</label>
                      <input 
                        type="url" 
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Consumer Description</label>
                      <textarea
                        rows={3}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Insert key selling specifications..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                      />
                    </div>

                    <div className="flex justify-end gap-2 text-xs pt-1">
                      <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-500 px-3 py-2">Cancel</button>
                      <button type="submit" className="bg-brand-blue text-white px-5 py-2 rounded-xl font-bold">Register SKU</button>
                    </div>
                  </form>
                )}

                {/* Bulk upload form */}
                <div className="my-6 p-5 border border-dashed border-slate-200 bg-slate-50 rounded-2xl">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Layers className="w-4 h-4 text-brand-gold" /> Bulk Upload JSON Payload
                  </h5>
                  <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
                    <textarea
                      rows={4}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder='[{"title":"My New Item","price":45,"category":"sports","brand":"Apex","stock":15,"description":"High elasticity mesh"}]'
                      className="w-full font-mono text-[11px] p-3 border border-slate-200 rounded-xl bg-white text-slate-700"
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">Strict JSON syntax required.</span>
                      <button type="submit" className="bg-brand-blue hover:bg-brand-blue-light text-white font-extrabold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer">
                        Sync Bulk Payload
                      </button>
                    </div>
                    {bulkSuccess && (
                      <p className="text-xs text-teal-600 font-semibold animate-pulse">✓ Bulk uploaded successfully. Listings appended to store register!</p>
                    )}
                    {bulkError && (
                      <p className="text-xs text-red-500 font-bold font-mono">⚠ Error: {bulkError}</p>
                    )}
                  </form>
                </div>

                {/* Edit Product modal layer if editing */}
                {editingProduct && (
                  <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-100 shadow-2xl relative">
                      <h4 className="font-display font-black text-brand-blue text-lg mb-4">Edit Product Listing</h4>
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <input 
                          type="text" 
                          value={editingProduct.title} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                        />
                        <input 
                          type="number" 
                          value={editingProduct.price} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                        />
                        <textarea 
                          rows={3}
                          value={editingProduct.description} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                        />
                        <div className="flex gap-2 justify-end text-xs">
                          <button type="button" onClick={() => setEditingProduct(null)} className="text-slate-500 px-3">Cancel</button>
                          <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-lg">Save Update</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Products registered table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500 border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 border-b border-slate-100">
                        <th className="p-3">Thumbnail</th>
                        <th className="p-3">Product details</th>
                        <th className="p-3">Brand</th>
                        <th className="p-3">Stock Units</th>
                        <th className="p-3">Avg Rate</th>
                        <th className="p-3 text-right">Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorProducts.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-3">
                            <img src={p.images[0]} alt={p.title} className="w-10 h-10 object-cover rounded-lg border border-slate-100" referrerPolicy="no-referrer" />
                          </td>
                          <td className="p-3 min-w-[150px]">
                            <p className="font-bold text-slate-900 truncate max-w-[200px]">{p.title}</p>
                            <span className="font-mono text-xs font-black text-brand-blue">${p.price}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-600 font-mono uppercase text-[10px]">
                            {p.brand}
                          </td>
                          <td className="p-3">
                            <span className={`font-mono font-bold font-black ${p.stock <= 5 ? 'text-red-500' : 'text-slate-700'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-3 text-brand-gold font-bold">★ {p.rating}</td>
                          <td className="p-3 text-right space-x-1">
                            <button onClick={() => setEditingProduct(p)} className="p-1 px-2.5 bg-slate-100 text-slate-600 hover:bg-brand-blue hover:text-white rounded-lg cursor-pointer">Edit</button>
                            <button onClick={() => onDeleteProduct(p.id)} className="p-1 px-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in" id="vendor-orders-panel">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <h4 className="font-display font-extrabold text-slate-900 text-lg mb-4">Incoming Seller Orders ({vendorOrders.length})</h4>
                
                {vendorOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-10 text-center">No transactions have targeted your catalog yet.</p>
                ) : (
                  <div className="space-y-4">
                    {vendorOrders.map(ord => {
                      const myItems = ord.items.filter(i => i.sellerId === currentUser.id);
                      const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                      return (
                        <div key={ord.id} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-4">
                          <div className="flex flex-wrap justify-between items-center pb-2 border-b border-slate-200/50 text-xs">
                            <div>
                              <span className="font-mono font-bold text-brand-blue uppercase">{ord.id}</span>
                              <span className="text-slate-400 font-medium ml-2">• Customer: <span className="font-bold text-slate-600">{ord.customerName}</span></span>
                            </div>
                            
                            <div className="flex gap-2">
                              <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                                ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>{ord.status}</span>
                              
                              <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-1 rounded font-mono font-bold">
                                {ord.paymentStatus.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {myItems.map(it => (
                              <div key={it.id} className="flex gap-4 items-center">
                                <img src={it.image} alt={it.title} className="w-10 h-10 object-cover rounded-lg border border-slate-100" referrerPolicy="no-referrer" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-slate-900 truncate">{it.title}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">Quantity requested: {it.quantity} • Unit: ${it.price}</p>
                                </div>
                                <span className="text-xs font-bold font-mono text-brand-blue">${it.price * it.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-200/50 gap-2">
                            <span className="text-[11px] text-slate-500 font-semibold">Allocated Revenue: <span className="font-bold text-brand-blue">${myTotal}</span></span>
                            
                            <div className="flex gap-1.5 font-bold text-[10px]">
                              {ord.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => onChangeOrderStatus(ord.id, 'processing')}
                                  className="bg-brand-blue hover:bg-brand-blue-light text-white px-3.5 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Process Order
                                </button>
                              )}
                              
                              {ord.status === 'processing' && (
                                <button
                                  type="button"
                                  onClick={() => onChangeOrderStatus(ord.id, 'shipped')}
                                  className="bg-brand-gold text-brand-blue px-3.5 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Dispatch Carrier
                                </button>
                              )}

                              {ord.status === 'shipped' && (
                                <button
                                  type="button"
                                  onClick={() => onChangeOrderStatus(ord.id, 'delivered')}
                                  className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Fulfill Delivery
                                </button>
                              )}

                              {ord.status === 'delivered' && (
                                <span className="text-emerald-600 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Dispatched & fulfilled
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fade-in" id="vendor-inventory">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <h4 className="font-display font-extrabold text-slate-900 text-lg mb-2">Inventory Stock Monitor</h4>
                <p className="text-xs text-slate-500 mb-6">Restock low items immediately to maintain customer buy flows.</p>

                {/* Low stock alerts panel */}
                <div className="space-y-4">
                  {vendorProducts.map(p => {
                    const isLow = p.stock <= 5;
                    return (
                      <div 
                        key={p.id} 
                        className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 transition-colors ${
                          isLow 
                            ? 'bg-red-50 border-red-200 text-red-900 animate-pulse' 
                            : 'bg-slate-50/50 border-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex gap-3 items-center min-w-0">
                          {isLow ? <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" /> : <Package className="w-5 h-5 text-slate-400 shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate max-w-[240px] sm:max-w-md">{p.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">SKU: {p.id} • Current Stock: <span className="font-bold">{p.stock}</span></p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center shrink-0">
                          <button
                            type="button"
                            onClick={() => onRestockProduct(p.id, 10)}
                            className="bg-brand-blue hover:bg-brand-blue-light text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Restock +10
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => onRestockProduct(p.id, 50)}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                          >
                            Restock +50
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forecasting' && (
            <div className="space-y-6 animate-fade-in" id="vendor-forecasting">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-brand-gold/20 rounded-lg text-brand-blue">
                    <Sparkles className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  </div>
                  <h4 className="font-display font-extrabold text-slate-900 text-lg">AI Sales Forecasting Engine</h4>
                </div>
                <p className="text-xs text-slate-500 mb-6">Powered by Google Gemini intelligence parameters. Review predicted merchant turnover schedules for Q3 2026.</p>

                {/* Simulated Chart visual list */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-brand-blue-pale p-4 rounded-xl border border-brand-blue/10">
                    <span className="text-[10px] text-brand-blue font-bold tracking-wider uppercase font-mono block">Estimated Jul Sales</span>
                    <span className="text-2xl font-mono font-black text-brand-blue block mt-1">${Math.round(forecasts[6].predictedSales)}</span>
                    <span className="text-[9px] text-emerald-600 block font-bold mt-1">↑ +14.2% Seasonal Acceleration</span>
                  </div>
                  <div className="bg-brand-blue-pale p-4 rounded-xl border border-brand-blue/10">
                    <span className="text-[10px] text-brand-blue font-bold tracking-wider uppercase font-mono block">Accuracy Confidence</span>
                    <span className="text-2xl font-mono font-black text-brand-blue block mt-1">94.8%</span>
                    <span className="text-[9px] text-blue-600 block font-bold mt-1">Sustained with previous stock counts</span>
                  </div>
                  <div className="bg-brand-blue-pale p-4 rounded-xl border border-brand-blue/10">
                    <span className="text-[10px] text-brand-blue font-bold tracking-wider uppercase font-mono block">Restock advice</span>
                    <span className="text-2xl font-mono font-black text-brand-blue block mt-1">12 SKU</span>
                    <span className="text-[9px] text-amber-600 block font-bold mt-1">Prevent low stock drop margins</span>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Predicted Allocation Table</p>
                  {forecasts.map(fc => (
                    <div key={fc.month} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-slate-800">{fc.month}</span>
                      
                      <div className="flex gap-4 text-xs font-semibold">
                        {fc.historicalSales > 0 && (
                          <span className="text-slate-400">Hist: <span className="text-slate-700">${fc.historicalSales}</span></span>
                        )}
                        <span className="text-brand-blue font-black">Predicted: <span className="text-brand-blue font-extrabold">${fc.predictedSales}</span></span>
                        <span className="text-slate-400 text-[10px]">Range: [${fc.confidenceInterval[0]} - ${fc.confidenceInterval[1]}]</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in" id="vendor-settings">
              
              {/* Profile Configurator */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <h4 className="font-display font-extrabold text-slate-900 text-lg mb-4 pb-2 border-b border-slate-50">Store Layout Customizer</h4>
                <form onSubmit={handleStoreUpdate} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Store Frontplace Name</label>
                      <input 
                        type="text" 
                        required
                        value={storeNameForm} 
                        onChange={(e) => setStoreNameForm(e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Logo Link URL (Demo Asset)</label>
                      <input 
                        type="url" 
                        required
                        value={storeLogoForm} 
                        onChange={(e) => setStoreLogoForm(e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Company Description</label>
                    <textarea 
                      rows={3}
                      value={storeDesc} 
                      onChange={(e) => setStoreDesc(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-hidden"
                    />
                  </div>

                  {/* KYC setup wizard embedded */}
                  <div className="p-4 bg-brand-gold-pale border border-brand-gold/15 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-brand-blue flex items-center gap-1.5 uppercase font-mono">
                      <Clock className="w-4 h-4 text-brand-gold" /> Merchant KYC Setup Wizard
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5 uppercase">Registered Business</label>
                        <input 
                          type="text" 
                          placeholder="e.g. AeroTech LLC"
                          value={businessName} 
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5 uppercase">Business Tax ID</label>
                        <input 
                          type="text" 
                          placeholder="US-XXXXX" 
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 block mb-0.5 uppercase">Contact Number</label>
                        <input 
                          type="text" 
                          placeholder="+1 (555) 765-4321" 
                          value={businessPhone}
                          onChange={(e) => setBusinessPhone(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                        />
                      </div>
                    </div>
                    <span className="text-[9px] block text-slate-400 leading-none">KYC files locked under safe bank protection layer.</span>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-brand-blue hover:bg-brand-blue-light text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Commit Custom Settings
                  </button>
                  {settingsSaved && (
                    <p className="text-xs text-teal-600 font-semibold animate-pulse">✓ Store customization saved onto database layer!</p>
                  )}
                </form>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
