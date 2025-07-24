import express from "express";
import {
  getAllStates,
  createState,
  updateState,
  deleteState,
} from "../controllers/state.controller.js";
import {
  validateCreateState,
  validateUpdateState,
  validateDeleteState,
} from "../validators/state.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllStates);
router.post("/", validateCreateState, validate, createState);
router.put("/:id", validateUpdateState, validate, updateState);
router.delete("/:id", validateDeleteState, validate, deleteState);

export default router;
