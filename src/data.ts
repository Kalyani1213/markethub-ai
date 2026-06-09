/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, User, Review, Order, Coupon, SalesForecastingItem } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'Trophy',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'books',
    name: 'Books',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: 'Apple',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: 'Armchair',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'AeroSound Max Active Noise Cancelling Headphones',
    description: 'Immerse yourself in top-tier acoustic perfection. Boasting 40-hour long-life battery battery, hybrid active noise cancelling, and adaptive ambient audio pass-through mode.',
    price: 299,
    rating: 4.8,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v1',
    sellerName: 'AeroTech Digital',
    stock: 45,
    reviewsCount: 124,
    isFeatured: true,
    isApproved: true,
    brand: 'AeroSound',
    specs: { 'Battery': '40 Hours', 'Bluetooth': 'v5.3', 'Audio Codecs': 'AAC, LDAC', 'Weight': '250g' }
  },
  {
    id: 'p2',
    title: 'Minimalist Walnut Wood Desk Organizer',
    description: 'Handcrafted from single-piece premium sustainably harvested American Walnut. Keeps your writing instruments, tablets, phones, and desk accessories organized in ultimate style.',
    price: 89,
    rating: 4.9,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v2',
    sellerName: 'Timber & Grace Co',
    stock: 12,
    reviewsCount: 88,
    isFeatured: true,
    isApproved: true,
    brand: 'Timber & Grace',
    specs: { 'Material': 'Solid American Walnut', 'Dimensions': '12" x 6" x 2"', 'Finish': 'Natural Beeswax Oil' }
  },
  {
    id: 'p3',
    title: 'Ventus Breathable Knit Running Shoes',
    description: 'Revolutionary hyper-responsive cushioning midsole, made with bio-sustainable fibers. Breathable knit design keeps your feet breezy even during rigorous marathons.',
    price: 145,
    rating: 4.5,
    category: 'sports',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v3',
    sellerName: 'Apex Athletics',
    stock: 4, // low stock alert!
    reviewsCount: 56,
    isFeatured: true,
    isApproved: true,
    brand: 'Apex',
    specs: { 'Midsole Technology': 'Apex Foam Gen-2', 'Arch Support': 'Neutral', 'Drop': '8mm', 'Weight': '210g' }
  },
  {
    id: 'p4',
    title: 'Sartorial Linen Tailored Blazer',
    description: 'Elegantly structural blazer crafted in raw unbleached natural Belgian linen. Designed with high armholes, light canvas shoulders, and double vents for peak modern dapper utility.',
    price: 185,
    rating: 4.6,
    category: 'fashion',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v4',
    sellerName: 'Vogue Craft',
    stock: 22,
    reviewsCount: 42,
    isFeatured: false,
    isApproved: true,
    brand: 'Sartorial',
    specs: { 'Material': '100% Organic Linen', 'Lining': 'Unlined', 'Button style': 'Genuine Horn Buttons' }
  },
  {
    id: 'p5',
    title: 'Radiance C-Complex Organic Glow Serum',
    description: 'Brimming with high potency cold-pressed botanical vitamin C, stabilized ferulic acid, and multi-weight vegan hyaluronic elements to illuminate dry and uneven skin tones.',
    price: 52,
    rating: 4.7,
    category: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v5',
    sellerName: 'Aura Bloom Organics',
    stock: 65,
    reviewsCount: 93,
    isFeatured: true,
    isApproved: true,
    brand: 'Aura Bloom',
    specs: { 'Vol': '30ml / 1 fl. oz', 'Skin Type': 'All Skin Types', 'Scent': 'Light Citrus Orange' }
  },
  {
    id: 'p6',
    title: 'Ergonomic Mesh Contour Task Chair',
    description: 'Engineered for absolute lower spine stability during long typing streaks. Features responsive 3D adjustable armrests, smart tilt lock, and cooling elastic back mesh.',
    price: 349,
    rating: 4.7,
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v2',
    sellerName: 'Timber & Grace Co',
    stock: 8,
    reviewsCount: 31,
    isFeatured: false,
    isApproved: true,
    brand: 'ComfortFlow',
    specs: { 'Weight Capacity': '300 lbs', 'Gas Lift Class': 'Class 4 Heavy Duty', 'Base': 'Polished Aluminum' }
  },
  {
    id: 'p7',
    title: 'Premium Single-Origin Ethiopian Coffee Beans',
    description: 'Medium light roast with crisp floral and citrus notes. Ethically sourced from ancient heights in Yirgacheffe region. Whole beans processed naturally for uncompromised complexity.',
    price: 24,
    rating: 4.9,
    category: 'groceries',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v1',
    sellerName: 'AeroTech Digital',
    stock: 150,
    reviewsCount: 215,
    isFeatured: true,
    isApproved: true,
    brand: 'Roastmasters',
    specs: { 'Roast level': 'Medium Light', 'Origin': 'Yirgacheffe, Ethiopia', 'Process': 'Natural Unwashed' }
  },
  {
    id: 'p8',
    title: 'Designing Tomorrow: The Tech Revolution Handbook',
    description: 'Learn the critical paradigm shifts shaping software, web platforms, intelligence mechanics, and microcomputing architectures of the upcoming decades.',
    price: 19,
    rating: 4.8,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'v4',
    sellerName: 'Vogue Craft',
    stock: 75,
    reviewsCount: 16,
    isFeatured: false,
    isApproved: true,
    brand: 'Pioneer Press',
    specs: { 'Format': 'Hardcover', 'Page count': '342 pages', 'Language': 'English' }
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userName: 'Jessica Miller',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    rating: 5,
    comment: 'The hybrid ANC is absolutely incredible! Blocked out the subway noise completely. Audio quality is so rich.',
    date: 'June 01, 2026'
  },
  {
    id: 'r2',
    productId: 'p1',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    rating: 4,
    comment: 'Exceptional battery life. Charging once every week or so. Only knock is the head pressure is a bit tight at first, but loosens up.',
    date: 'May 28, 2026'
  },
  {
    id: 'r3',
    productId: 'p2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
    rating: 5,
    comment: 'Pure luxury! The wood feels extremely solid and the grain patterns are stunning. Totally cleaned up my messy workstation.',
    date: 'June 05, 2026'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'cust_1',
    name: 'Sarah Chen',
    email: 'sarah@markethub.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    balance: 500,
    followedSellers: ['v1', 'v2'],
    addresses: [
      {
        id: 'addr_1',
        name: 'Home Office',
        street: '1540 Silicon Valley Way, Suite A',
        city: 'San Jose',
        state: 'CA',
        zip: '95110',
        country: 'United States',
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        id: 'pay_1',
        type: 'card',
        cardNumber: '•••• •••• •••• 4242',
        cardHolder: 'SARAH CHEN',
        expiry: '12/28',
        isDefault: true
      }
    ]
  },
  {
    id: 'v1',
    name: 'Alexander Sterling',
    email: 'alex@aerotech.com',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    storeName: 'AeroTech Digital',
    kycStatus: 'verified',
    kycDetails: {
      businessName: 'AeroTech Digital LLC',
      taxId: 'US-9856321-K',
      phone: '+1 (555) 765-4321',
      documentUrl: 'https://example.com/kyc-doc-aerotech.pdf'
    },
    balance: 4210,
    addresses: [],
    paymentMethods: []
  },
  {
    id: 'v2',
    name: 'Evelyn Grace',
    email: 'grace@timberwood.com',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    storeName: 'Timber & Grace Co',
    kycStatus: 'verified',
    kycDetails: {
      businessName: 'Timber & Grace Woodworks Limited',
      taxId: 'US-8711440-S',
      phone: '+1 (555) 234-5678',
      documentUrl: 'https://example.com/kyc-timber.pdf'
    },
    balance: 1850,
    addresses: [],
    paymentMethods: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9854',
    customerId: 'cust_1',
    customerName: 'Sarah Chen',
    items: [
      {
        id: 'ord_p2',
        productId: 'p2',
        title: 'Minimalist Walnut Wood Desk Organizer',
        price: 89,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=100&auto=format&fit=crop&q=80',
        sellerId: 'v2',
        sellerName: 'Timber & Grace Co'
      },
      {
        id: 'ord_p7',
        productId: 'p7',
        title: 'Premium Single-Origin Ethiopian Coffee Beans',
        price: 24,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
        sellerId: 'v1',
        sellerName: 'AeroTech Digital'
      }
    ],
    total: 137,
    discount: 10,
    status: 'delivered',
    paymentMethod: 'Credit Card (Stripe)',
    paymentStatus: 'paid',
    shippingAddress: {
      id: 'addr_order',
      name: 'Sarah Chen',
      street: '1540 Silicon Valley Way, Suite A',
      city: 'San Jose',
      state: 'CA',
      zip: '95110',
      country: 'United States',
      isDefault: false
    },
    date: 'June 02, 2026',
    trackingCode: 'TRK-9854228941',
    estimatedDelivery: 'June 05, 2026',
    couponUsed: 'WELCOME10'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 50 },
  { code: 'GOLDEN20', type: 'flat', value: 20, minSpend: 100 },
  { code: 'FREESHIP', type: 'flat', value: 5, minSpend: 20 }
];

// Foreasting mock generator
export const fetchSalesForecasting = (sellerId: string): SalesForecastingItem[] => {
  const seed = sellerId === 'v1' ? 1.2 : 0.8;
  return [
    { month: 'Jan', historicalSales: Math.round(1500 * seed), predictedSales: Math.round(1550 * seed), confidenceInterval: [Math.round(1400 * seed), Math.round(1700 * seed)] },
    { month: 'Feb', historicalSales: Math.round(1800 * seed), predictedSales: Math.round(1850 * seed), confidenceInterval: [Math.round(1700 * seed), Math.round(2000 * seed)] },
    { month: 'Mar', historicalSales: Math.round(2100 * seed), predictedSales: Math.round(2150 * seed), confidenceInterval: [Math.round(1950 * seed), Math.round(2350 * seed)] },
    { month: 'Apr', historicalSales: Math.round(2400 * seed), predictedSales: Math.round(2500 * seed), confidenceInterval: [Math.round(2300 * seed), Math.round(2700 * seed)] },
    { month: 'May', historicalSales: Math.round(2900 * seed), predictedSales: Math.round(3100 * seed), confidenceInterval: [Math.round(2800 * seed), Math.round(3400 * seed)] },
    { month: 'Jun (Now)', historicalSales: Math.round(3200 * seed), predictedSales: Math.round(3450 * seed), confidenceInterval: [Math.round(3150 * seed), Math.round(3750 * seed)] },
    { month: 'Jul (Pred)', historicalSales: 0, predictedSales: Math.round(3900 * seed), confidenceInterval: [Math.round(3600 * seed), Math.round(4200 * seed)] },
    { month: 'Aug (Pred)', historicalSales: 0, predictedSales: Math.round(4100 * seed), confidenceInterval: [Math.round(3800 * seed), Math.round(4400 * seed)] },
    { month: 'Sep (Pred)', historicalSales: 0, predictedSales: Math.round(4350 * seed), confidenceInterval: [Math.round(4000 * seed), Math.round(4700 * seed)] }
  ];
};
