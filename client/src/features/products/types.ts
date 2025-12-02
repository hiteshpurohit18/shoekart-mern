export interface Product {
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
}
