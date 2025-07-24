import { body, param } from "express-validator";
import mongoose from "mongoose";

// Reusable ObjectId validator
const isValidObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value);

// Brand name validation
const brandNameValidator = body("name")
  .trim()
  .notEmpty().withMessage("Brand name is required")
  .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters");

// Create brand validator
export const validateCreateBrand = [brandNameValidator];

// Update brand validator (ID + name)
export const validateUpdateBrand = [
  param("id")
    .custom(isValidObjectId)
    .withMessage("Invalid brand ID"),
  brandNameValidator,
];

// Delete brand validator (ID only)
export const validateDeleteBrand = [
  param("id")
    .custom(isValidObjectId)
    .withMessage("Invalid brand ID"),
];
