import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateCreateState = [
  body("name")
    .trim()
    .notEmpty().withMessage("State name is required")
    .isString().withMessage("State name must be a string")
    .isLength({ min: 2 }).withMessage("State name must be at least 2 characters"),
];

export const validateUpdateState = [
  param("id")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid state ID"),
  body("name")
    .trim()
    .notEmpty().withMessage("State name is required")
    .isString().withMessage("State name must be a string")
    .isLength({ min: 2 }).withMessage("State name must be at least 2 characters"),
];

export const validateDeleteState = [
  param("id")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid state ID"),
];
