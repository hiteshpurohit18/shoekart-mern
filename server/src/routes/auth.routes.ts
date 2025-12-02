import { Router } from "express";
import { sendOtp, verifyOtp, signup, login, me } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

// OTP ROUTES
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// SIGNUP (requires verified OTP)
router.post("/signup", signup);

// LOGIN
router.post("/login", login);

// GET LOGGED IN USER
router.get("/me", authMiddleware, me);

export default router;
