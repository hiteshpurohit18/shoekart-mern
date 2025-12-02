import { Routes, Route, Outlet } from "react-router-dom"; // Added Outlet

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import PageNotFound from "./pages/PageNotFoun";
import Checkout from "./pages/Checkout";
import OrdersPage from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails"; // 1. Import OrderDetails

export default function App() {
  return (
    <div>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-20 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* 2. Orders Nested Route Configuration */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                {/* Outlet renders the child route elements */}
                <Outlet />
              </ProtectedRoute>
            }
          >
            {/* Matches /orders */}
            <Route index element={<OrdersPage />} />

            {/* Matches /orders/:id */}
            <Route path=":id" element={<OrderDetails />} />
          </Route>

          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
