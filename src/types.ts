/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'upi';
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  upiId?: string;
  provider?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  storeName?: string;
  kycStatus?: 'unverified' | 'pending' | 'verified';
  kycDetails?: {
    businessName: string;
    taxId: string;
    phone: string;
    documentUrl: string;
  };
  balance?: number;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  followedSellers?: string[]; // Seller IDs
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  stock: number;
  reviewsCount: number;
  isFeatured: boolean;
  isApproved: boolean;
  brand: string;
  specs: Record<string, string>;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  discount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  shippingAddress: Address;
  date: string;
  trackingCode: string;
  estimatedDelivery: string;
  couponUsed?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minSpend: number;
}

export interface SalesForecastingItem {
  month: string;
  predictedSales: number;
  historicalSales: number;
  confidenceInterval: [number, number];
}
