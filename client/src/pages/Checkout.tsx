import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import toast from "react-hot-toast";

import { createOrder } from "../services/ordersApi";
import { useCart } from "../features/cart/CartContext";
import { useAuth } from "../features/auth/AuthContext";

/* small secure icon */
function IconSecure() {
  return (
    <svg
      className="h-5 w-5 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M12 2l7 4v4c0 5-3 9-7 11-4-2-7-6-7-11V6l7-4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.5l1.8 1.8L14.5 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Checkout() {
  // small utility for consistent inputs
  const inputBase =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-black transition";

  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Check if we have a "Buy Now" item passed from ProductPage
  const buyNowItem = location.state?.buyNowItem;

  // 2. Decide what to checkout: BuyNow item OR Cart items
  const checkoutItems = useMemo(() => {
    if (buyNowItem) {
      return [buyNowItem];
    }
    return cart;
  }, [cart, buyNowItem]);

  // Calculate total item count locally based on checkoutItems
  const totalItemsCount = useMemo(() => {
    return checkoutItems.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    );
  }, [checkoutItems]);

  // address state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [country, setCountry] = useState("India");

  // payment
  const [selectedPayment, setSelectedPayment] = useState<
    "cod" | "upi" | "card"
  >("cod");

  // loading
  const [loading, setLoading] = useState(false);

  // 3. Calculate subtotal based on checkoutItems (not just cart)
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((total: number, item: any) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [checkoutItems]);

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  // simple front-end validation
  function validate() {
    if (!fullName.trim()) return "Please enter full name.";
    if (!email.trim()) return "Please enter email.";
    if (!phone.trim()) return "Please enter phone number.";
    if (!line1.trim()) return "Please enter address line 1.";
    if (!city.trim()) return "Please enter city.";
    if (!stateField.trim()) return "Please enter state.";
    if (!pincode.trim()) return "Please enter pincode.";

    // Validate checkoutItems
    if (!checkoutItems || checkoutItems.length === 0)
      return "No items to checkout.";
    return null;
  }

  async function handleOrder() {
    // require login
    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login");
      return;
    }

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);

    try {
      // prepare items snapshot from checkoutItems
      const items = checkoutItems.map((it: any) => ({
        productId: it.productId,
        name: it.product?.name || "Unknown product",
        price: it.product?.price || 0,
        quantity: it.quantity,
        size: it.size,
        imageURL: it.product?.imageURL || "",
      }));

      const address = {
        name: fullName,
        email,
        phone,
        line1,
        line2,
        city,
        state: stateField,
        pincode,
        country,
      };

      const payload = {
        items,
        address,
        subtotal,
        shipping: shippingCost,
        total,
        paymentMethod:
          selectedPayment === "cod"
            ? "Cash on Delivery"
            : selectedPayment === "upi"
              ? "UPI"
              : "Card",
      };

      // call backend
      await createOrder(payload);

      // 4. Only clear cart if this was a standard Cart checkout
      if (!buyNowItem) {
        await clearCart();
      }

      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (e: any) {
      console.error("checkout error", e);
      const message =
        e?.response?.data?.message || "Order failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // Check checkoutItems for empty state logic
  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mb-4 text-sm text-gray-600">
            Add items to your cart and return here to checkout.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* LEFT: forms */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping Address
              </h2>
              <div className="text-xs text-gray-500">Secure & private</div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputBase}
                placeholder="Full name"
                autoComplete="name"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                placeholder="Email"
                type="email"
                autoComplete="email"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputBase}
                placeholder="Phone number"
                type="tel"
                autoComplete="tel"
              />
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className={inputBase}
                placeholder="Pincode"
              />

              <input
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className={`${inputBase} sm:col-span-2`}
                placeholder="Address line 1"
              />

              <input
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className={`${inputBase} sm:col-span-2`}
                placeholder="Address line 2 (optional)"
              />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputBase}
                placeholder="City"
              />
              <input
                value={stateField}
                onChange={(e) => setStateField(e.target.value)}
                className={inputBase}
                placeholder="State"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Payment Method
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose a payment option
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  selectedPayment === "cod"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPayment("cod")}
              >
                <input
                  readOnly
                  type="radio"
                  checked={selectedPayment === "cod"}
                  name="payment"
                  className="h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium">Cash on Delivery</div>
                  <div className="text-xs text-gray-500">
                    Pay when you receive
                  </div>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  selectedPayment === "upi"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPayment("upi")}
              >
                <input
                  readOnly
                  type="radio"
                  checked={selectedPayment === "upi"}
                  name="payment"
                  className="h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium">UPI</div>
                  <div className="text-xs text-gray-500">
                    Google Pay, PhonePe, Paytm
                  </div>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  selectedPayment === "card"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPayment("card")}
              >
                <input
                  readOnly
                  type="radio"
                  checked={selectedPayment === "card"}
                  name="payment"
                  className="h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium">Card</div>
                  <div className="text-xs text-gray-500">Debit / Credit</div>
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-medium text-gray-900">Notes</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add delivery instructions or notes for the courier (optional)
            </p>
            <textarea
              placeholder="Leave a note for the delivery..."
              className="mt-3 h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-black"
            />
          </section>
        </div>

        {/* RIGHT: summary (sticky on lg) */}
        <aside className="self-start rounded-2xl border border-gray-100 bg-white p-6 shadow-lg lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {/* 5. Use local totalItemsCount instead of context */}
                {totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="rounded-full bg-gray-50 p-2 shadow-sm">
              <IconSecure />
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ₹{subtotal.toFixed(0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">
                {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
              </span>
            </div>

            <div className="mt-2 flex justify-between border-t pt-2">
              <span className="font-medium text-gray-900">Total</span>
              <span className="text-lg font-semibold text-black">
                ₹{total.toFixed(0)}
              </span>
            </div>
          </div>

          <button
            onClick={handleOrder}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-black py-3 font-semibold text-white shadow transition hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>

          <div className="mt-4 text-center text-xs text-gray-500">
            <div className="mb-2 inline-flex items-center gap-2">
              <IconSecure />
              <span>SSL encrypted & secure checkout</span>
            </div>

            <div className="text-xs">30 days free returns • Fast shipping</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
