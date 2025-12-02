import { Request, Response } from "express";
import User from "../models/User";
import Product from "../models/Product";

// GET /api/cart
export async function getCart(req: Request, res: Response) {
  try {
    const user = await User.findById((req as any).user._id).populate(
      "cart.productId"
    );

    const cleanedCart = user.cart.map((item: any) => ({
      productId: String(item.productId._id),
      product: item.productId,
      size: item.size,
      quantity: item.quantity,
    }));

    return res.json(cleanedCart);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load cart" });
  }
}

// POST /api/cart/add
export async function addToCart(req: Request, res: Response) {
  try {
    const { productId, size, quantity } = req.body;
    const user = await User.findById((req as any).user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.cart.find(
      (item: any) =>
        String(item.productId) === String(productId) && item.size === size
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({
        productId: String(productId),
        size,
        quantity,
      });
    }

    await user.save();
    return getCart(req, res); // return cleaned cart
  } catch (err) {
    return res.status(500).json({ message: "Unable to add to cart" });
  }
}

// PATCH /api/cart/update
export async function updateCartQuantity(req: Request, res: Response) {
  try {
    const { productId, size, quantity } = req.body;
    const user = await User.findById((req as any).user._id);

    user.cart = user.cart.map((item: any) =>
      String(item.productId) === String(productId) && item.size === size
        ? { ...item, quantity }
        : item
    );

    await user.save();
    return getCart(req, res);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update quantity" });
  }
}

// DELETE /api/cart/remove
export async function removeFromCart(req: Request, res: Response) {
  try {
    const { productId, size } = req.body;
    const user = await User.findById((req as any).user._id);

    user.cart = user.cart.filter(
      (item: any) =>
        !(String(item.productId) === String(productId) && item.size === size)
    );

    await user.save();
    return getCart(req, res);
  } catch (err) {
    return res.status(500).json({ message: "Unable to remove item" });
  }
}

// DELETE /api/cart/clear
export async function clearCart(req: Request, res: Response) {
  try {
    const user = await User.findById((req as any).user._id);
    user.cart = [];
    await user.save();

    return res.json({ message: "Cart cleared" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to clear cart" });
  }
}
