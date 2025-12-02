// src/features/cart/CartProduct.tsx
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import type { Product, CartItem } from "./types";
import toast from "react-hot-toast";

/**
 * useCountUp - animate number changes (lightweight)
 */
function useCountUp(value: number, duration = 300) {
  const ref = useRef<number>(value);
  const [display, setDisplay] = useState<number>(value);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = ref.current;
    const to = value;
    if (from === to) {
      ref.current = to;
      setDisplay(to);
      return;
    }

    function step(ts: number) {
      const t = Math.min(1, (ts - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease
      const cur = Math.round(from + (to - from) * eased);
      setDisplay(cur);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        ref.current = to;
        setDisplay(to);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

export default function CartProduct({
  item,
  product,
}: {
  item: CartItem;
  product: Product;
}) {
  const { updateQuantity, removeItem } = useCart();
  const [saved, setSaved] = useState(false);

  const total = (product?.price || 0) * item.quantity;
  const animatedTotal = useCountUp(total, 350);

  const increase = () =>
    updateQuantity(String(item.productId), item.size, item.quantity + 1);
  const decrease = () => {
    const next = item.quantity - 1;
    if (next <= 0) {
      removeItem(String(item.productId), item.size);
      toast.success("Removed from cart");
    } else {
      updateQuantity(String(item.productId), item.size, next);
    }
  };

  const remove = () => {
    removeItem(String(item.productId), item.size);
    toast.success("Removed from cart");
  };

  const saveForLater = async () => {
    // placeholder for wishlist API
    setSaved(true);
    removeItem(String(item.productId), item.size);
    toast.success("Saved for later");
  };

  return (
    <article className="w-full rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-lg">
      {/* Mobile-first: column layout that becomes row on md */}
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-start">
        {/* Image */}
        <div className="shrink-0">
          <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-gray-50 md:h-28 md:w-28">
            <img
              src={product?.imageURL || "/placeholder.png"}
              alt={product?.name}
              className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Main details & controls (grows) */}
        <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {/* Title + brand (allow wrapping) */}
            <div className="min-w-0">
              <h3 className="wrap-break-words line-clamp-2 text-sm font-semibold text-gray-900">
                {product?.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{product?.brand}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1">
                  Size {item.size}
                </span>
                <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1">
                  Stock: {product?.stock ?? "—"}
                </span>
              </div>
            </div>

            {/* Qty controls + small actions on mobile */}
            <div className="mt-3 flex items-center gap-3 md:hidden">
              <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1">
                <button
                  onClick={decrease}
                  className="rounded-md px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="min-w-9 text-center text-sm font-medium">
                  {item.quantity}
                </div>
                <button
                  onClick={increase}
                  className="rounded-md px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={saveForLater}
                disabled={saved}
                className="rounded-md px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {saved ? "Saved" : "Save for later"}
              </button>

              <button
                onClick={remove}
                className="rounded-md px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Right column on md: price & actions */}
          <div className="flex w-full flex-col items-start gap-3 md:w-40 md:items-end">
            {/* Price block (keeps right-aligned on md) */}
            <div className="mt-1 flex w-full items-center justify-between md:justify-end">
              <div className="text-base font-semibold text-gray-900 md:text-right">
                ₹{animatedTotal}
              </div>
            </div>

            {/* Qty + actions for md+ */}
            <div className="hidden items-center gap-3 md:flex">
              <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1">
                <button
                  onClick={decrease}
                  className="rounded-md px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="min-w-9 text-center text-sm font-medium">
                  {item.quantity}
                </div>
                <button
                  onClick={increase}
                  className="rounded-md px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={saveForLater}
                  disabled={saved}
                  className="rounded-md px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  {saved ? "Saved" : "Save for later"}
                </button>

                <button
                  onClick={remove}
                  className="rounded-md px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
