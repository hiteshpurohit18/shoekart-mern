import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Otp from "../models/Otp";
import { sendMail } from "../utils/mail";

/**
 * Generate a 6-digit numeric OTP
 */
function generateOtp(): string {
  // crypto.randomInt is good for numeric OTPs
  const num = crypto.randomInt(100000, 999999);
  return String(num);
}

/**
 * POST /api/auth/send-otp
 * body: { email }
 */
export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Remove previous unused otps (optional safety)
    await Otp.deleteMany({ email, used: false });

    const code = generateOtp();
    const ttlMinutes = 10;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await Otp.create({ email, code, expiresAt });

    const html = `
      <div style="font-family: sans-serif; line-height:1.4; color:#111;">
        <h3 style="margin-bottom:0.5rem">Your ShoeKart verification code</h3>
        <p style="margin:0 0 0.5rem">Use this code to complete your signup:</p>
        <h2 style="letter-spacing:4px; margin:0 0 0.75rem">${code}</h2>
        <p style="margin:0; color:#555">This code expires in ${ttlMinutes} minutes.</p>
      </div>
    `;

    try {
      await sendMail(email, "ShoeKart verification code", html);
    } catch (err) {
      console.error("Error sending OTP email:", err);
      // still return success to avoid leaking info, but warn
      return res
        .status(500)
        .json({ message: "Failed to send OTP. Check SMTP configuration." });
    }

    return res.json({ message: "OTP sent" });
  } catch (err: any) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
}

/**
 * POST /api/auth/verify-otp
 * body: { email, code }
 */
export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and code required" });

    const otpDoc = await Otp.findOne({ email, code, used: false }).sort({
      createdAt: -1,
    });
    if (!otpDoc)
      return res.status(400).json({ message: "Invalid or expired code" });

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    otpDoc.used = true;
    await otpDoc.save();

    return res.json({ message: "OTP verified" });
  } catch (err: any) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
}

/**
 * POST /api/auth/signup
 * body: { name, email, password }
 * Requires previously verified OTP for this email (used = true)
 */

// src/controllers/auth.controller.ts

export const signup = async (req: Request, res: Response) => {
  // Added types
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🛡️ SECURITY FIX: Verify OTP was actually used/verified recently
    const recentOtp = await Otp.findOne({
      email,
      used: true,
    }).sort({ updatedAt: -1 }); // Get the latest used OTP

    if (!recentOtp) {
      return res
        .status(400)
        .json({ message: "Please verify your email first." });
    }

    // Optional: Ensure the OTP verification happened recently (e.g., within 15 mins)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (recentOtp.updatedAt < fifteenMinsAgo) {
      return res
        .status(400)
        .json({ message: "Verification expired. Please verify again." });
    }

    // 2. Create User
    const user = new User({
      name,
      email,
      password, // Pre-save hook will hash this
    });

    await user.save();

    // 3. Create Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // 4. Cleanup OTPs (Optional)
    await Otp.deleteMany({ email });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

function createToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = createToken(user._id.toString());

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function me(_req: Request, res: Response) {
  const user = (_req as any).user;
  if (!user) return res.status(401).json({ message: "Not authorized" });
  res.json(user);
}
