import { body, param } from "express-validator";
import mongoose from "mongoose";

// Reusable ObjectId validator
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Field validators
const nameValidator = body("name")
  .trim()
  .notEmpty().withMessage("Sub-category name is required")
  .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters");

const categoryValidator = body("category")
  .notEmpty().withMessage("Category is required")
  .custom(isValidObjectId).withMessage("Invalid category ID");

// Validators
export const validateCreateSubCategory = [nameValidator, categoryValidator];

export const validateUpdateSubCategory = [
  param("id")
    .custom(isValidObjectId).withMessage("Invalid sub-category ID"),
  nameValidator,
  categoryValidator,
];

export const validateDeleteSubCategory = [
  param("id")
    .custom(isValidObjectId).withMessage("Invalid sub-category ID"),
];
