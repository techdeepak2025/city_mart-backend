import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validateCreateUser = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("mobile").matches(/^\d{10}$/).withMessage("Mobile must be exactly 10 digits"),
  body("password").isLength({ min: 6 }),
  body("role").custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid role ID"),
  body("accessScope.type").isIn(["global", "city", "store"]),
  body("accessScope.refId").if(body("accessScope.type").not().equals("global"))
    .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Valid refId is required"),
];

export const validateUpdateUser = [
  param("id").custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid user ID"),
  body("mobile").optional().matches(/^\d{10}$/),
  body("password").optional().isLength({ min: 6 }),
  body("accessScope.type").optional().isIn(["global", "city", "store"]),
  body("accessScope.refId").optional().custom(value => mongoose.Types.ObjectId.isValid(value)),
];

export const validateDeleteUser = [
  param("id").custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage("Invalid user ID"),
];
