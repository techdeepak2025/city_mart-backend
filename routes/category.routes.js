import express from "express";
import { getAllCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { uploadCategoryImage } from "../middlewares/cloudinaryUploader.js";
import { validate } from "../middlewares/validate.js";
import { validateCreateCategory, validateUpdateCategory, validateDeleteCategory } from "../validators/category.validator.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.post("/", uploadCategoryImage.single("image"), validateCreateCategory, validate, createCategory);
router.put("/:id", uploadCategoryImage.single("image"), validateUpdateCategory, validate, updateCategory);
router.delete("/:id", validateDeleteCategory, validate, deleteCategory);

export default router;
