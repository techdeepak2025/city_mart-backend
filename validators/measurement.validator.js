import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateCreateMeasurement = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("units")
    .isArray({ min: 1 }).withMessage("Units must be a non-empty array")
    .custom((units) => units.every((u) => typeof u === "string" && u.trim()))
    .withMessage("Each unit must be a non-empty string"),
];

export const validateUpdateMeasurement = [
  param("id").custom((id) => mongoose.Types.ObjectId.isValid(id)).withMessage("Invalid ID"),
  ...validateCreateMeasurement,
];

export const validateDeleteMeasurement = [
  param("id").custom((id) => mongoose.Types.ObjectId.isValid(id)).withMessage("Invalid ID"),
];
