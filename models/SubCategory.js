import mongoose from "mongoose";
import slugify from "slugify";
import Product from "./Product.js";
import { v2 as cloudinary } from "cloudinary";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub-category name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// Slug generation before save
subCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Slug generation before update
subCategorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
    this.setUpdate(update);
  }
  next();
});

// Cascade delete products + Cloudinary image
subCategorySchema.pre("findOneAndDelete", async function (next) {
  try {
    const subCategory = await this.model.findOne(this.getFilter());

    if (subCategory) {
      // Delete related products
      await Product.deleteMany({ subCategory: subCategory._id });

      // Delete image from Cloudinary if exists
      if (subCategory.image?.public_id) {
        await cloudinary.uploader.destroy(subCategory.image.public_id);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("SubCategory", subCategorySchema);
