import api from "../../services/api";
import type { Product } from "./types";

export async function fetchProducts(filters?: any): Promise<Product[]> {
  let url = "/products?";

  // Search
  if (filters?.search) url += `search=${filters.search}&`;

  // Gender filters (men / women)
  if (filters?.gender) url += `gender=${filters.gender}&`;

  // Category (casual / formal / etc.)
  if (filters?.category) url += `category=${filters.category}&`;

  // Trending
  if (filters?.trending) url += `trending=true&`;

  // Sorting
  if (filters?.sort) url += `sort=${filters.sort}&`;

  const res = await api.get(url);

  return res.data as Product[];
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await api.get(`/products/${id}`);
  return res.data as Product;
}
