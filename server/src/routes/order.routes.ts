// src/routes/order.routes.ts
import express from "express";
import  authMiddleware  from "../middleware/auth.middleware";
import {
  createOrder,
  getOrdersForUser,
  getOrderById,
} from "../controllers/order.controller";

const router = express.Router();

// POST /api/orders     -> create order
router.post("/", authMiddleware, createOrder);

// GET /api/orders      -> list orders for user
router.get("/", authMiddleware, getOrdersForUser);

// GET /api/orders/:id  -> get a single order (owner)
router.get("/:id", authMiddleware, getOrderById);

export default router;
