import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./ProductService";
import ProductCard from "./ProductCard";
import type { Product } from "./types";

export default function ProductList({ filters }: { filters: any }) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    // include filter in the queryKey so the query reruns when filter changes
    queryKey: ["products", filters || "all"],
    queryFn: () => fetchProducts(filters),
    // keepPreviousData smooths UX when switching filters
    keepPreviousData: true,
    // optional: short cache time while developing
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
