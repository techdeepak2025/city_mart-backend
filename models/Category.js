import mongoose from "mongoose";
import slugify from "slugify";
import SubCategory from "./SubCategory.js";
import Product from "./Product.js";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true,
    minlength: 2,
    maxlength: 50,
  },
  image: {
    url: { type: String, default: null },
    public_id: { type: String, default: null },
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
}, { timestamps: true });

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.pre("findOneAndDelete", async function (next) {
  const category = await this.model.findOne(this.getFilter());
  if (category) {
    await Promise.all([
      SubCategory.deleteMany({ category: category._id }),
      Product.deleteMany({ category: category._id }),
    ]);
  }
  next();
});

export default mongoose.model("Category", categorySchema);
