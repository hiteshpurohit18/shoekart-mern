import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
}

const OtpSchema: Schema = new Schema(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IOtp>("Otp", OtpSchema);
