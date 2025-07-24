import mongoose from "mongoose";
import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

// Utility
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Get all products with filters
export const getProducts = async (req, res) => {
  try {
    const { subcategory, category, brand, exclude } = req.query;

    const filter = {};
    if (subcategory && isValidObjectId(subcategory))
      filter.subcategory = subcategory;
    if (category && isValidObjectId(category)) filter.category = category;
    if (brand && isValidObjectId(brand)) filter.brand = brand;
    if (exclude && isValidObjectId(exclude)) filter._id = { $ne: exclude };

    const products = await Product.find(filter)
      .limit(10)
      .populate(["brand", "category", "subcategory", "measurement"]);

    res.json(products);
  } catch (error) {
    console.error("❌ Get Products Error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ✅ Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "brand category subcategory measurement"
    );

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// ✅ Create product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      subcategory,
      measurement,
      unit,
      mrp,
      sku,
    } = req.body;

    const images =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    const product = await Product.create({
      name,
      description,
      brand,
      category,
      subcategory,
      measurement,
      unit,
      mrp: mrp ? parseFloat(mrp) : undefined,
      sku,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Create Product Error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      brand,
      category,
      subcategory,
      measurement,
      unit,
      mrp,
      sku,
    } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });

    let newImages = [];
    if (req.files?.length) {
      for (const img of existingProduct.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.warn(
              `⚠️ Failed to delete Cloudinary image: ${img.public_id}`,
              err
            );
          }
        }
      }

      // Prepare new images array
      newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // Prepare update object
    const updates = {
      name,
      description,
      brand,
      category,
      subcategory,
      measurement,
      unit,
      sku,
    };

    if (mrp !== undefined) updates.mrp = parseFloat(mrp);
    if (newImages.length > 0) updates.images = newImages;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Update Product Error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// ✅ Delete product and Cloudinary images
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (product?.images?.length) {
      for (const img of product.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.warn(
              `⚠️ Failed to delete Cloudinary image: ${img.public_id}`,
              err
            );
          }
        }
      }
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// ✅ Update partial (price, discount, stock)
export const updateProductPartial = async (req, res) => {
  const { id } = req.params;
  let { price, discount, stock } = req.body;

  const updateData = {};
  if (price !== undefined) updateData.price = parseFloat(price);
  if (discount !== undefined) updateData.discount = parseFloat(discount);
  if (stock !== undefined) updateData.stock = parseInt(stock);

  try {
    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error saving stock:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};
