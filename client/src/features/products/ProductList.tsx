import { useQuery, keepPreviousData } from "@tanstack/react-query"; // 👈 Import keepPreviousData
import { fetchProducts } from "./ProductService";
import ProductCard from "./ProductCard";
import type { Product } from "./types";

export default function ProductList({ filters }: { filters: any }) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<Product[]>({ // 👈 Explicitly type as Product[]
    queryKey: ["products", filters || "all"],
    queryFn: () => fetchProducts(filters),
    // 👇 FIX: Use placeholderData instead of keepPreviousData
    placeholderData: keepPreviousData, 
    staleTime: 1000 * 30,
  });

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Failed to load products</div>;

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((product: Product) => (
        <ProductCard key={product.sku} product={product} />
      ))}
    </div>
  );
}