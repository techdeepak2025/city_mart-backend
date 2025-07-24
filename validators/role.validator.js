import { body, param } from "express-validator";
import mongoose from "mongoose";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateCreateRole = [
  body("name")
    .notEmpty().withMessage("Role name is required")
    .isLength({ min: 2 }).withMessage("Role name must be at least 2 characters"),
];

export const validateUpdateRole = [
  param("id").custom((value) => isObjectId(value)).withMessage("Invalid role ID"),
  body("name")
    .notEmpty().withMessage("Role name is required")
    .isLength({ min: 2 }).withMessage("Role name must be at least 2 characters"),
];

export const validateDeleteRole = [
  param("id").custom((value) => isObjectId(value)).withMessage("Invalid role ID"),
];
