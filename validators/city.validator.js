import { body, param, query } from "express-validator";
import mongoose from "mongoose";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateCreateCity = [
  body("name")
    .trim()
    .notEmpty().withMessage("City name is required")
    .isString().withMessage("City name must be a string")
    .isLength({ min: 2 }).withMessage("City name must be at least 2 characters"),

  body("state")
    .custom(isObjectId)
    .withMessage("Valid state ID is required"),
];

export const validateUpdateCity = [
  param("id")
    .custom(isObjectId)
    .withMessage("Invalid city ID"),

  body("name")
    .trim()
    .notEmpty().withMessage("City name is required")
    .isString().withMessage("City name must be a string")
    .isLength({ min: 2 }).withMessage("City name must be at least 2 characters"),

  body("state")
    .custom(isObjectId)
    .withMessage("Valid state ID is required"),
];

export const validateDeleteCity = [
  param("id")
    .custom(isObjectId)
    .withMessage("Invalid city ID"),
];
