import React, { useState } from "react";
import { sendOtp, verifyOtp, signupUser } from "../services/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  async function handleSendOtp() {
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      await sendOtp(email);
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (err: any) {
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp) return toast.error("Please enter the OTP.");
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Email verified. Continue to create account.");
      setStep(3);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    setMessage(null);
    e.preventDefault();
    if (!form.name || !form.password || !form.confirmPassword) {
      return setMessage({ type: "error", text: "Fill all fields." });
    }
    if (form.password !== form.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match." });
    }
    setLoading(true);
    try {
      // capture response from signup API
      const res = await signupUser({
        name: form.name,
        email,
        password: form.password,
      });

      // 👇 Fixed: Access .data explicitly
      const token = res.data.token;
      const user = res.data.user;

      if (token && user) {
        try {
          localStorage.setItem("token", token);
        } catch (err) {
          console.error("Failed to store token", err);
        }

        try {
          login(user, token);
        } catch (err) {
          try {
            login(user);
          } catch {
            /* swallow */
          }
        }

        toast.success("Signup successful.");
        navigate("/");
        return;
      }

      toast.success("Signup successful.");
      setStep(1);
      setEmail("");
      setOtp("");
      setForm({ name: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
        <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-black opacity-10 blur-2xl" />
        <div className="absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-gray-700 opacity-10 blur-2xl" />

        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          Create Account
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600 sm:text-base">
          Secure signup using email OTP verification
        </p>

        {step === 1 && (
          <div className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            />
            <button
              onClick={handleSendOtp}
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Already have an account?</span>
              <Link to="/login" className="font-semibold text-black">
                Login
              </Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              An OTP was sent to <strong>{email}</strong>
            </p>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={handleVerifyOtp}
                className="flex-1 rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={handleSendOtp}
                className="flex-1 rounded-lg border py-3 transition hover:bg-gray-50"
              >
                Resend
              </button>
            </div>

            <div className="text-sm text-gray-500">
              <button
                onClick={() => setStep(1)}
                className="text-black underline"
              >
                Change Email
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              type="text"
              placeholder="Full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            />

            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            />

            <input
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* OR social buttons kept for UI parity */}
        <div className="mt-6">
          <div className="my-4 flex items-center">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="px-3 text-sm text-gray-500">or continue with</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 transition hover:bg-gray-50">
              <img
                src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
                className="h-5 w-5"
                alt="google"
              />
              Continue with Google
            </button>

            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 transition hover:bg-gray-50">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                className="h-5 w-5"
                alt="facebook"
              />
              Continue with Facebook
            </button>

            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 transition hover:bg-gray-50">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                className="h-5 w-5"
                alt="apple"
              />
              Continue with Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
