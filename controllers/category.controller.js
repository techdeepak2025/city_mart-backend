import Category from "../models/Category.js";
import { capitalizeWords } from "../utils/format.js";
import cloudinary from "../utils/cloudinary.js";

// GET /categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// GET /categories/slug/:slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// POST /categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const formattedName = capitalizeWords(name);
    const file = req.file;

    const image = file ? { url: file.path, public_id: file.filename } : null;

    const newCategory = new Category({ name: formattedName, image });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch {
    res.status(500).json({ error: "Failed to create category" });
  }
};

// PUT /categories/:id
export const updateCategory = async (req, res) => {
  try {
    console.log("🔥🔥 Backend: updateCategory handler triggered");

    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Handle image replacement
    if (req.file && req.file.path) {
      console.log(">>> New image uploaded:", req.file.filename);

      // Delete old image from Cloudinary
      if (category.image?.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
        console.log(">>> Old image deleted:", category.image.public_id);
      }

      category.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    } else {
      console.log(">>> No new image received or image was reused");
    }

    // Update name
    if (name) {
      category.name = capitalizeWords(name);
    }

    await category.save();
    res.status(200).json(category);
  } catch (error) { 
    console.error(">>> Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE /categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
