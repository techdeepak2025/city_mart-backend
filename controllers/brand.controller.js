import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import { capitalizeWords } from "../utils/format.js";
import { v2 as cloudinary } from "cloudinary";

// GET /brands
export const getBrands = async (_req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

// POST /brands
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    let logo = { url: null, public_id: null };

    if (file) {
      logo = {
        url: file.path,
        public_id: file.filename,
      };
    }

    const brand = await Brand.create({
      name: capitalizeWords(name),
      logo,
    });

    res.status(201).json(brand);
  } catch (err) {
    console.error("❌ Brand creation error:", err);
    res.status(500).json({ error: "Failed to create brand" });
  }
};

// PUT /brands/:id
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const file = req.file;

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    if (file) {
      if (brand.logo?.public_id) {
        await cloudinary.uploader.destroy(brand.logo.public_id);
      }

      brand.logo = {
        url: file.path,
        public_id: file.filename,
      };
    }

    brand.name = capitalizeWords(name);
    await brand.save();

    res.json(brand);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Failed to update brand" });
  }
};

// DELETE /brands/:id
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    // Delete logo from Cloudinary
    if (brand.logo?.public_id) {
      await cloudinary.uploader.destroy(brand.logo.public_id);
    }

    // Delete related products and their images
    await Product.deleteMany({ brand: brand._id });

    await brand.deleteOne();

    res.json({ message: "Brand and related products deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete brand" });
  }
};
