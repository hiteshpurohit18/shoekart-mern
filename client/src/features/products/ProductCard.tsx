// src/features/products/ProductCard.tsx
import type { Product } from "./types";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? 7);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      return navigate("/login");
    }

    await addItem({
      productId: String(product._id),
      size: selectedSize,
      quantity: 1,
    });
  };

  return (
    <div className="group relative overflow-visible rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={product.imageURL}
          alt={product.name}
          className="h-48 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Shine Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 translate-x-[-150%] bg-linear-to-r from-transparent via-white/30 to-transparent blur-md duration-700 group-hover:translate-x-[150%]"></div>
        </div>

        {/* Size Selector */}
        {product.sizes?.length > 0 && (
          <div className="absolute top-3 right-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              className="rounded-lg border bg-white px-3 py-1 text-sm font-medium shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 left-1/2 w-[85%] -translate-x-1/2 rounded-lg bg-black py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:bottom-4 group-hover:opacity-100"
        >
          Add to Cart
        </button>
      </div>

      <Link to={`/product/${product.slug}`}>
        <h3 className="mt-4 line-clamp-1 text-lg font-semibold">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">{product.brand}</p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold">₹{product.price}</p>
          <span className="text-sm text-gray-600">View Details →</span>
        </div>
      </Link>
    </div>
  );
}
