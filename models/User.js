import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Mobile must be exactly 10 digits",
      },
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // Updated avatar schema to store Cloudinary metadata
    avatar: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },

    accessScope: {
      type: {
        type: String,
        enum: ["global", "City", "Store"],
        required: true,
      },
      refId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "accessScope.type",
      },
    },
  },
  { timestamps: true }
);

// 🔒 Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Password verification method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
