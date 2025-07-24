import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Store from "../models/Store.js";

export const loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ mobile })
      .select("+password")
      .populate("role");

    if (!user) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    if (!user.role || !user.role.name) {
      return res.status(403).json({ message: "User role is not assigned" });
    }

    const payload = {
      userId: user._id,
      role: user.role.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        avatar: user.avatar,
        role: user.role.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    let storeInfo = null;

    if (user.accessScope?.type === "store" && user.accessScope?.refId) {
      storeInfo = await Store.findById(user.accessScope.refId);
    }

    res.json({
      name: user.name,
      avatar: user.avatar,
      store: storeInfo
        ? {
            _id: storeInfo._id,
            number: storeInfo.storeNumber,
          }
        : null,
    });
  } catch (err) {
    console.error("❌ Error in getCurrentUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};
