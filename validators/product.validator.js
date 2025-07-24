import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateCreateProduct = [
  body("name").notEmpty().withMessage("Name is required"),
  body("brand").custom(isValidObjectId).withMessage("Invalid brand ID"),
  body("category").custom(isValidObjectId).withMessage("Invalid category ID"),
  body("measurement")
    .custom(isValidObjectId)
    .withMessage("Invalid measurement ID"),
  body("unit").notEmpty().withMessage("Unit is required"),

  body("mrp")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("MRP must be a non-negative number"),

  body("sku")
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9-_]+$/)
    .withMessage("SKU must be alphanumeric (including hyphen and underscore)"),
];

export const validateUpdateProduct = [
  param("id").custom(isValidObjectId).withMessage("Invalid Product ID"),
  ...validateCreateProduct,
];

export const validateDeleteProduct = [
  param("id").custom(isValidObjectId).withMessage("Invalid Product ID"),
];

function isValidObjectId(value) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
}

export const validatePartialUpdate = [
  param("id").custom(isValidObjectId).withMessage("Invalid Product ID"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];
