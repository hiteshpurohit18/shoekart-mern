import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

async function main() {
  if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is missing in .env");
    process.exit(1);
  }

  // shoes_500.json should be in the project root: E-Commerce/shoes_500.json
  const filePath = path.resolve(
    __dirname,
    "../../..",
    "shoes_price_updated.json"
  );

  console.log("Reading file from:", filePath);

  if (!fs.existsSync(filePath)) {
    console.error("❌ shoes_500.json NOT FOUND at:", filePath);
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB Connected");

  const jsonData = fs.readFileSync(filePath, "utf-8");
  const products = JSON.parse(jsonData);

  await Product.deleteMany();
  await Product.insertMany(products);

  console.log(`✅ Successfully inserted ${products.length} products`);
  process.exit();
}

main().catch((err) => {
  console.error("❌ Seed Error:", err.message);
  process.exit(1);
});
