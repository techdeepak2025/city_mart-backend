import express from "express";
import { createSubCategory, getAllSubCategories, updateSubCategory, deleteSubCategory } from "../controllers/subCategory.controller.js";
import { uploadSubCategoryImage } from "../middlewares/cloudinaryUploader.js";
import { validateCreateSubCategory, validateUpdateSubCategory, validateDeleteSubCategory } from "../validators/subCategory.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllSubCategories);
router.post("/", uploadSubCategoryImage.single("image"), validateCreateSubCategory, validate, createSubCategory );
router.put( "/:id", uploadSubCategoryImage.single("image"), validateUpdateSubCategory, validate, updateSubCategory );
router.delete("/:id", validateDeleteSubCategory, validate, deleteSubCategory );

export default router;
