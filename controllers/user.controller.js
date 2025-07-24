import User from "../models/User.js";
import { capitalizeWords } from "../utils/format.js";
import { v2 as cloudinary } from "cloudinary";

const normalizeAccessType = (type) => {
  if (type === "store") return "Store";
  if (type === "city") return "City";
  return "global";
};

// ✅ Create User
export const createUser = async (req, res) => {
  try {
    const {
      name,
      mobile,
      role,
      password,
      "accessScope.type": type,
      "accessScope.refId": refId,
    } = req.body;

    if (["store", "city"].includes(type) && !refId) {
      return res.status(400).json({
        error: `RefId is required for access scope "${type}"`,
      });
    }

    const exists = await User.findOne({ mobile });
    if (exists) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }

    const user = new User({
      name: capitalizeWords(name),
      mobile,
      role,
      password,
      accessScope: {
        type: normalizeAccessType(type),
        refId: refId || undefined,
      },
    });

    if (req.file) {
      user.avatar = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "name")
      .populate("accessScope.refId", "name storeNumber")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get User By ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("role", "name")
      .populate("accessScope.refId", "name storeNumber");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const {
      name,
      mobile,
      role,
      password,
      "accessScope.type": type,
      "accessScope.refId": refId,
    } = req.body;

    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (mobile && mobile !== user.mobile) {
      const exists = await User.findOne({ mobile, _id: { $ne: user._id } });
      if (exists)
        return res.status(400).json({ error: "Mobile number already exists" });
      user.mobile = mobile;
    }

    if (name) user.name = capitalizeWords(name);
    if (role) user.role = role;
    if (password) user.password = password;

    if (req.file) {
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      user.avatar = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    if (type) {
      user.accessScope.type = normalizeAccessType(type);
      user.accessScope.refId = ["store", "city"].includes(type)
        ? refId
        : undefined;
    }

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Delete avatar from Cloudinary
    if (user.avatar?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      } catch (err) {
        console.warn("Failed to delete avatar from Cloudinary:", err);
      }
    }

    await User.findByIdAndDelete(user._id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
