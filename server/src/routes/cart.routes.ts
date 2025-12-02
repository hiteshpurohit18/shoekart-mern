import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";

const router = Router();

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.patch("/update", authMiddleware, updateCartQuantity);
router.delete("/remove", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
