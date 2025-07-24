import slugify from "slugify";
import SubCategory from "../models/SubCategory.js";
import { capitalizeWords } from "../utils/format.js";
import { v2 as cloudinary } from "cloudinary";

// Create SubCategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    const formattedName = capitalizeWords(name);

    const image = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : null;

    const newSubCategory = await SubCategory.create({
      name: formattedName,
      category,
      image,
    });

    // 🔥 Populate category before responding
    const populatedSubCategory = await SubCategory.findById(
      newSubCategory._id
    ).populate("category", "name slug");

    res.status(201).json(populatedSubCategory);
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(err.status || 500)
      .json({ error: err.message || "Server error" });
  }
};

// Get All SubCategories
export const getAllSubCategories = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};

    const subCategories = await SubCategory.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sub-categories" });
  }
};

// Get One SubCategory by ID
export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate(
      "category",
      "name slug"
    );
    if (!subCategory)
      return res.status(404).json({ error: "Sub-category not found" });
    res.json(subCategory);
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch sub-category" });
  }
};

// Update SubCategory
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory)
      return res.status(404).json({ error: "Sub-category not found" });

    console.log("🔥 Received file via Multer:", req.file);

    if (req.file) {
      if (subCategory.image?.public_id) {
        await cloudinary.uploader.destroy(subCategory.image.public_id);
      }

      subCategory.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    subCategory.name = capitalizeWords(name);
    subCategory.slug = slugify(subCategory.name, { lower: true, strict: true });
    subCategory.category = category;

    await subCategory.save();

    const updated = await SubCategory.findById(id).populate(
      "category",
      "name slug"
    );

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message || "Failed to update sub-category" });
  }
};

// Delete SubCategory
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id);
    if (!subCategory)
      return res.status(404).json({ error: "Sub-category not found" });

    if (subCategory.image?.public_id) {
      await cloudinary.uploader.destroy(subCategory.image.public_id);
    }

    await subCategory.deleteOne();

    res.json({ message: "Sub-category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete sub-category" });
  }
};
