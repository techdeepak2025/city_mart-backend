import express from "express";
import {
  getAllMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from "../controllers/measurement.controller.js";
import {
  validateCreateMeasurement,
  validateUpdateMeasurement,
  validateDeleteMeasurement,
} from "../validators/measurement.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllMeasurements);
router.post("/", validateCreateMeasurement, validate, createMeasurement);
router.put("/:id", validateUpdateMeasurement, validate, updateMeasurement);
router.delete("/:id", validateDeleteMeasurement, validate, deleteMeasurement);

export default router;
