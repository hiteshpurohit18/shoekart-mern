import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-10">
      {/* Animated Illustration */}
      <div className="relative">
        <img
          src="https://static.vecteezy.com/system/resources/previews/005/006/007/non_2x/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
          alt="Empty Cart"
          className=" w-56 opacity-90 drop-shadow-xl sm:w-72"
        />

        {/* Glow effect */}
        <div className="absolute -bottom-6 left-1/2 h-10 w-32 -translate-x-1/2 rounded-full bg-gray-300 opacity-40 blur-2xl"></div>
      </div>

      {/* Title */}
      <h2 className="mt-10 text-2xl font-semibold text-gray-900 sm:text-3xl">
        Your Cart is Empty
      </h2>

      {/* Subtitle */}
      <p className="mt-2 max-w-md text-center text-sm text-gray-600 sm:text-base">
        Looks like you haven’t added anything to your cart yet. Browse through
        our collection and find your perfect pair!
      </p>

      {/* CTA Button */}
      <Link
        to="/"
        className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white shadow-md transition hover:bg-gray-800"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
