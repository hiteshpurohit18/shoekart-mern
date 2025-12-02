import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId | string;
  name?: string;
  price: number;
  quantity: number;
  size?: number | string;
  imageURL?: string;
}

export interface IAddress {
  name: string;
  email?: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  address: IAddress;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: Schema.Types.Mixed,
  imageURL: String,
});

const AddressSchema = new Schema<IAddress>({
  name: String,
  email: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    address: { type: AddressSchema, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String },
    status: { type: String, default: "created" },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
