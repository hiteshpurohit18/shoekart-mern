import { useState } from "react";
import { loginUser } from "../services/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await loginUser(form);

      // IMPORTANT ❗ Save token
      localStorage.setItem("token", res.data.token);

      // Save user in context
      login(res.data.user, res.data.token);

      setMessage({ type: "success", text: "Login successful!" });

      setTimeout(() => navigate("/"), 700);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-black opacity-10 blur-2xl"></div>
        <div className="absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-gray-700 opacity-10 blur-2xl"></div>

        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="you@example.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {message && (
          <p
            className={`mb-3 text-sm ${
              message.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-black hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
