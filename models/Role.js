import mongoose from "mongoose";
import User from "./User.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Role name must be at least 2 characters"],
    },
  },
  { timestamps: true }
);

// Cascade delete users when a role is deleted
roleSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await User.deleteMany({ role: doc._id });
  }
});

export default mongoose.model("Role", roleSchema);
