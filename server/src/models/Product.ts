import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  sku: string;
  name: string;
  brand: string;
  category: string;
  gender: string;
  price: number;
  imageURL: string;
  sizes: number[];
  rating: number;
  reviews: number;
  description: string;
  slug: string;
  trending: boolean;
}

const ProductSchema: Schema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, required: true },
    price: { type: Number, required: true },

    // matches your JSON exactly
    imageURL: { type: String, required: true },

    sizes: [{ type: Number, required: true }],
    rating: { type: Number, default: 4.0 },
    reviews: { type: Number, default: 0 },

    description: { type: String, required: true },
    slug: { type: String, required: true },

    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
