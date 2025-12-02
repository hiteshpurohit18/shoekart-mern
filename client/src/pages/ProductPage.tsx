import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast"; // Added toast

import { fetchProductById } from "../features/products/ProductService";
import type { Product } from "../features/products/types";
import { useCart } from "../features/cart/CartContext"; // Added useCart
import { useAuth } from "../features/auth/AuthContext"; // Added useAuth

// --- Local Components (Kept as is) ---
function PrimaryButton({ children, onClick, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full rounded-2xl px-5 py-3 font-semibold shadow-md transition-transform focus:outline-none active:scale-95 md:w-auto" +
        " bg-black text-white " + // Fixed bg-linear to bg-gradient (standard Tailwind)
        className
      }
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-3 font-semibold text-gray-800 transition hover:shadow-sm md:w-auto " +
        className
      }
    >
      {children}
    </button>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const total = 5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= full || (half && idx === full + 1);
        return (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            className={filled ? "text-yellow-400" : "text-gray-300"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 .587l3.668 7.431L24 9.748l-6 5.852L19.335 24 12 20.021 4.665 24 6 15.6 0 9.748l8.332-1.73L12 .587z"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const { data, isLoading, error } = useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const priceFormatted = useMemo(() => {
    if (!data) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(data.price);
  }, [data]);

  // --- Handlers ---

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items");
      return navigate("/login");
    }
    if (!selectedSize && data?.sizes && data.sizes.length > 0) {
      return toast.error("Please select a size");
    }

    // Call Context API to add item
    await addItem({
      productId: data!._id,
      size: selectedSize!,
      quantity: qty,
    });
    // Note: addItem typically handles the toast, but if not:
    // toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to buy");
      return navigate("/login");
    }
    if (!selectedSize && data?.sizes && data.sizes.length > 0) {
      return toast.error("Please select a size");
    }

    // Direct Buy: Navigate to checkout with the item in 'state'
    // This allows Checkout.tsx to use this item INSTEAD of the cart
    navigate("/checkout", {
      state: {
        buyNowItem: {
          productId: data!._id,
          product: data, // Pass full product data to avoid re-fetching
          size: selectedSize,
          quantity: qty,
        },
      },
    });
  };

  if (isLoading)
    return (
      <div className="mx-auto max-w-4xl animate-pulse p-6">
        <div className="flex flex-col gap-6">
          <div className="h-64 w-full rounded-lg bg-gray-200" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-32 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <p className="mt-2 text-gray-500">
          We couldn't find the product you're looking for.
        </p>
      </div>
    );

  return (
    <div className="pb-28">
      <div className="mx-auto max-w-4xl p-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* IMAGE */}
            <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
              <div className="w-full max-w-md">
                <img
                  src={data.imageURL}
                  alt={data.name}
                  className="h-80 w-full rounded-xl border border-gray-100 object-cover md:h-96"
                />

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <div>
                    SKU:{" "}
                    <span className="font-medium text-gray-800">
                      {(data as any).sku || "—"}
                    </span>
                  </div>
                  <div>
                    Category:{" "}
                    <span className="font-medium text-gray-800">
                      {data.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="p-4 md:p-6">
              <h1 className="text-xl font-extrabold md:text-2xl">
                {data.name}
              </h1>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Stars rating={data.rating ?? 0} />
                  <span className="text-sm text-gray-500">
                    {data.rating?.toFixed(1)} • {data.reviews} reviews
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">Price</div>
                  <div className="mt-1 text-2xl font-bold">
                    {priceFormatted}
                  </div>
                </div>
              </div>

              <p className="mt-4 leading-relaxed text-gray-600">
                {data.description}
              </p>

              <div className="mt-5">
                <h3 className="text-sm font-medium text-gray-700">
                  Choose Size
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {data.sizes?.map((s: any) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={
                        "min-w-14 rounded-lg border px-4 py-2 text-center text-sm font-medium " +
                        (selectedSize === s
                          ? "border-transparent bg-black text-white shadow"
                          : "border-gray-200 bg-white text-gray-700")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="w-12 text-center font-medium">{qty}</div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="ml-auto hidden gap-3 md:flex">
                  <GhostButton onClick={handleAddToCart}>
                    Add to Cart
                  </GhostButton>
                  <PrimaryButton onClick={handleBuyNow}>Buy Now</PrimaryButton>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2">
                <div>
                  <div className="font-medium">Delivery</div>
                  <div>Free delivery within 5–7 business days.</div>
                </div>

                <div>
                  <div className="font-medium">Return</div>
                  <div>30-day easy returns.</div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                Updated:{" "}
                {new Date(data.updatedAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white px-4 py-3 md:hidden">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="flex-1">
            <div className="text-sm text-gray-500">{data.brand}</div>
            <div className="text-lg font-bold">{priceFormatted}</div>
          </div>

          <div className="w-[48%]">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-lg border bg-white px-4 py-3 font-semibold text-gray-800"
            >
              Add to Cart
            </button>
          </div>

          <div className="w-[48%]">
            <button
              onClick={handleBuyNow}
              className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
