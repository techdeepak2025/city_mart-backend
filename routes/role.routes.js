import express from "express";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controller.js";
import {
  validateCreateRole,
  validateUpdateRole,
  validateDeleteRole,
} from "../validators/role.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllRoles);
router.post("/", validateCreateRole, validate, createRole);
router.put("/:id", validateUpdateRole, validate, updateRole);
router.delete("/:id", validateDeleteRole, validate, deleteRole);

export default router;
