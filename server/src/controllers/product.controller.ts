import { Request, Response } from "express";
import Product from "../models/Product";
import mongoose from "mongoose";

export async function getProducts(_req: Request, res: Response) {
  const query: any = {};

  if (_req.query.gender) query.gender = _req.query.gender;
  if (_req.query.category) query.category = _req.query.category;
  if (_req.query.trending) query.trending = _req.query.trending === "true";
  if (_req.query.search) {
    query.name = { $regex: _req.query.search, $options: "i" };
  }

  let products = Product.find(query);

  // handle sorting
  if (_req.query.sort === "lowToHigh") {
    products = products.sort({ price: 1 });
  }
  if (_req.query.sort === "highToLow") {
    products = products.sort({ price: -1 });
  }
  if (_req.query.sort === "brand") {
    products = products.sort({ brand: 1 });
  }

  const result = await products;
  res.json(result);
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    // 1. Try finding by slug first
    let product = await Product.findOne({ slug: id });

    // 2. If not found, and it LOOKS like a valid ID, try ID
    if (!product && mongoose.isValidObjectId(id)) {
      product = await Product.findById(id);
    }

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Server error" });
  }
}
