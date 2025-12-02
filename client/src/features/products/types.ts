export interface Product {
  _id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  gender: string;
  price: number;
  imageURL: string;
  sizes: number[];
  rating: number;
  reviews: number;
  description: string;
  slug: string;
  trending: boolean;
  updatedAt?: string;
  stock?: number;
}
