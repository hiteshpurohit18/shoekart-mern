// src/controllers/order.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import User from "../models/User";

function toObjectIdIfValid(val: any) {
  // if already an ObjectId instance, leave it
  if (val && typeof val === "object" && (val as any)._bsontype === "ObjectID") {
    return val;
  }
  // if it's a string and valid hex, create new ObjectId
  if (typeof val === "string" && mongoose.isValidObjectId(val)) {
    return new mongoose.Types.ObjectId(val);
  }
  // otherwise return as-is (controller can still save raw value)
  return val;
}

/**
 * Create an order for the logged-in user.
 */
export async function createOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      items,
      address,
      subtotal,
      shipping = 0,
      total,
      paymentMethod,
    } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items required" });
    }

    // Normalize and validate items
    const normalizedItems = items.map((it: any) => {
      return {
        productId: toObjectIdIfValid(it.productId),
        name: it.name,
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        size: it.size,
        imageURL: it.imageURL,
      };
    });

    const order = new Order({
      user: new mongoose.Types.ObjectId(userId),
      items: normalizedItems,
      address,
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total) || 0,
      paymentMethod,
      status: "created",
    });

    await order.save();

    // Optionally push to user's orders array (non-fatal)
    try {
      await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
    } catch (e) {
      console.warn("Could not push order id to user:", e);
    }

    return res.status(201).json({ order });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Failed to create order" });
  }
}

export async function getOrdersForUser(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ orders });
  } catch (err) {
    console.error("getOrdersForUser:", err);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user) !== String(userId))
      return res.status(403).json({ message: "Forbidden" });

    return res.json({ order });
  } catch (err) {
    console.error("getOrderById:", err);
    return res.status(500).json({ message: "Failed to fetch order" });
  }
}
