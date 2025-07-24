import mongoose from "mongoose";
import Product from "./Product.js";
import { v2 as cloudinary } from "cloudinary";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
    logo: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Cascade delete products + remove logo from Cloudinary
brandSchema.pre("findOneAndDelete", async function (next) {
  try {
    const brand = await this.model.findOne(this.getFilter());

    if (brand) {
      // Delete all products related to the brand
      await Product.deleteMany({ brand: brand._id });

      // Delete logo from Cloudinary if exists
      if (brand.logo?.public_id) {
        await cloudinary.uploader.destroy(brand.logo.public_id);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Brand", brandSchema);
