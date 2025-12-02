import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../features/cart/CartContext";
import CartProduct from "../features/cart/CartProduct";
import EmptyCart from "../features/cart/EmptyCart";
import toast from "react-hot-toast";

/* simple delivery estimator */
function estimateDeliveryRange(country: string) {
  const today = new Date();
  let minDays = 3;
  let maxDays = 7;
  switch (country) {
    case "IN":
      minDays = 2;
      maxDays = 5;
      break;
    case "US":
      minDays = 5;
      maxDays = 10;
      break;
    case "UK":
      minDays = 5;
      maxDays = 9;
      break;
    case "AU":
      minDays = 7;
      maxDays = 14;
      break;
    default:
      minDays = 4;
      maxDays = 10;
  }
  const min = new Date(today);
  min.setDate(today.getDate() + minDays);
  const max = new Date(today);
  max.setDate(today.getDate() + maxDays);
  return { min, max };
}
function formatDateRange(min: Date, max: Date, country: string) {
  let locale = "en-US";
  if (country === "IN") locale = "en-IN";
  if (country === "UK") locale = "en-GB";
  if (country === "AU") locale = "en-AU";

  const fmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  });
  return `${fmt.format(min)} – ${fmt.format(max)}`;
}

export default function CartPage() {
  const { cart, clearCart, getItemCount } = useCart();
  const navigate = useNavigate();

  const [country, setCountry] = useState<"IN" | "US" | "UK" | "AU">("IN");

  const { min, max } = estimateDeliveryRange(country);
  const estimated = formatDateRange(min, max, country);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  if (!cart || cart.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Your Cart
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {getItemCount()} item{getItemCount() !== 1 ? "s" : ""} • Review before
          checkout
        </p>
      </div>

      {/* add items-start to prevent children stretching */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* LEFT: cart items */}
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => {
            // 👇 FIX: Guard clause. If product is missing, don't render.
            if (!item.product) return null;

            return (
              <CartProduct
                key={`${item.productId}-${item.size}`}
                item={item}
                product={item.product}
              />
            );
          })}
        </div>

        {/* add self-start so aside doesn't stretch */}
        <aside className="self-start rounded-2xl border border-gray-100 bg-white/60 p-6 shadow-lg backdrop-blur-sm lg:sticky lg:top-24">
          <div className="absolute -top-5 right-5"></div>

          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Secure checkout & fast delivery
              </p>
            </div>

            <div className="flex items-center gap-2">🛡️</div>
          </div>

          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ₹{subtotal.toFixed(0)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Estimated delivery</span>
              <div className="text-sm font-medium text-gray-900">
                {estimated}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <select
                aria-label="Delivery country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value as any);
                  toast.success("Delivery estimate updated");
                }}
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>

              <div className="ml-auto inline-flex items-center gap-3 rounded-md bg-white/40 px-3 py-2 text-xs">
                <span className="text-gray-600">Free shipping</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white shadow transition hover:bg-gray-900"
            >
              Proceed to Checkout
            </button>
          </div>

          <div className="mt-3 flex gap-3">
            <button
              onClick={async () => {
                await clearCart();
                toast.success("Cart cleared");
              }}
              className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
            >
              Clear Cart
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:shadow"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-md bg-white/60 p-2"></div>
              <div>
                <div className="font-medium text-gray-900">Easy returns</div>
                <div className="text-xs text-gray-500">
                  30 days free returns
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-md bg-white/60 p-2"></div>
              <div>
                <div className="font-medium text-gray-900">Secure payments</div>
                <div className="text-xs text-gray-500">
                  SSL encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
