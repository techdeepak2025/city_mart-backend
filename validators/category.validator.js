import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2 to 50 characters long"),
];

export const validateUpdateCategory = [
  param("id")
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid category ID"),
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2 to 50 characters"),
];

export const validateDeleteCategory = [
  param("id")
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid category ID"),
];
