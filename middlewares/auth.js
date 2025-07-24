import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { _id: user._id };
    req.userId = user._id; 
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
