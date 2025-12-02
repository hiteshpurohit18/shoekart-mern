import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useCart } from "../features/cart/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cart, getItemCount } = useCart();

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // 1. Added a ref for the mobile toggle button to fix the "Close/Open" loop
  const buttonRef = useRef<HTMLButtonElement>(null);

  // CLICK OUTSIDE TO CLOSE
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;

      // Desktop profile dropdown
      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      // Mobile dropdown closing logic
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen, profileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold">
          ShoeKart
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-6 text-gray-700 md:flex">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden items-center gap-4 md:flex">
          {/* CART ONLY IF LOGGED IN */}
          {user && (
            <>
              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 hover:bg-gray-200"
              >
                🛒 <span className="text-sm font-medium">Cart</span>
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {getItemCount()}
                  </span>
                )}
              </Link>
              <Link
                to="/orders"
                className="relative flex items-center rounded-lg px-3 py-1 hover:bg-gray-200"
              >
                Orders
              </Link>
            </>
          )}

          {/* LOGIN / SIGNUP */}
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}

          {/* PROFILE DROPDOWN (DESKTOP) */}
          {user && (
            <div className="relative" ref={profileRef}>
              <div
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                👤
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-xl border bg-white p-4 text-sm shadow-lg">
                  <div className="flex flex-col items-center border-b pb-3">
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-2xl">
                      👤
                    </div>

                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full rounded px-2 py-2 text-right text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl transition-transform duration-300 md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        ref={menuRef}
        className={`overflow-hidden bg-white shadow-md transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-4 py-4">
          <Link
            className="mb-1 block px-1"
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>

          <Link
            className="block px-1"
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>

          {/* MOBILE CART */}
          {user && (
            <>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative mb-2 flex items-center gap-2 rounded bg-gray-100 px-1 py-1 hover:bg-gray-200"
              >
                🛒 <span>Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -right-[-300px] mb-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cart.reduce((s, it) => s + it.quantity, 0)}
                  </span>
                )}
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="relative flex items-center rounded px-1 hover:bg-gray-200"
              >
                Orders
              </Link>
            </>
          )}

          {/* MOBILE PROFILE DROPDOWN */}
          {user && (
            <div className="border-t pt-4">
              <div
                className="flex cursor-pointer items-center gap-3"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  👤
                </div>

                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <div
                className={`mt-3 max-h-20 overflow-hidden opacity-100 transition-all duration-200`}
              >
                <button
                  onClick={handleLogout}
                  className="block w-full cursor-pointer pl-1 text-left text-sm text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* MOBILE LOGIN/SIGNUP */}
          {!user && (
            <div className="border-t pt-4">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mb-1 block px-1"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block px-1"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
