import { body, param } from "express-validator";
import mongoose from "mongoose";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateCreateStore = [
  body("storeNumber")
    .trim()
    .notEmpty().withMessage("Store number is required")
    .matches(/^[A-Z]{2,5}\d{3,5}$/).withMessage("Store number must be in format e.g., HR001"),

  body("state")
    .custom(isObjectId).withMessage("Invalid state ID"),

  body("city")
    .custom(isObjectId).withMessage("Invalid city ID"),

  body("address")
    .trim()
    .isLength({ min: 5 }).withMessage("Address must be at least 5 characters"),

  body("pincode")
    .matches(/^\d{6}$/).withMessage("Pincode must be a 6-digit number"),
];

export const validateUpdateStore = [
  param("id")
    .custom(isObjectId).withMessage("Invalid store ID"),

  body("storeNumber")
    .optional()
    .trim()
    .matches(/^[A-Z]{2,5}\d{3,5}$/).withMessage("Invalid store number format"),

  body("state")
    .optional()
    .custom(isObjectId).withMessage("Invalid state ID"),

  body("city")
    .optional()
    .custom(isObjectId).withMessage("Invalid city ID"),

  body("address")
    .optional()
    .isLength({ min: 5 }).withMessage("Address must be at least 5 characters"),

  body("pincode")
    .optional()
    .matches(/^\d{6}$/).withMessage("Pincode must be a 6-digit number"),
];

export const validateDeleteStore = [
  param("id")
    .custom(isObjectId).withMessage("Invalid store ID"),
];
