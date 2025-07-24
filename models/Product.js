import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    measurement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Measurement",
      required: true,
    },
    unit: { type: String, required: true },
    mrp: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    stock: { type: Number, default: 0, min: 0 },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: /^[a-zA-Z0-9-_]+$/,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
