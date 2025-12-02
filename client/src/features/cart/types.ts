// src/features/cart/types.ts
export interface CartItem {
  productId: string;
  size: number;
  quantity: number;
  product?: Product;
}

export interface Product {
  _id: string;
  sku?: string;
  name: string;
  brand?: string;
  category?: string;
  gender?: string;
  color?: string;
  price: number;
  sizes?: number[];
  stock?: number;
  images?: string[];
  imageURL?: string;
  description?: string;
  slug?: string;
  rating?: number;
  reviews?: number;
  trending?: boolean;
}
