import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token = (req.headers.authorization as string) || "";
    if (!token) return res.status(401).json({ message: "Not authorized" });
    token = token.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized" });
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
}
