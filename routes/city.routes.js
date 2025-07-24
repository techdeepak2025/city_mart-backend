import express from "express";
import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/city.controller.js";
import {
  validateCreateCity,
  validateUpdateCity,
  validateDeleteCity,
} from "../validators/city.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getCities);
router.post("/", validateCreateCity, validate, createCity);
router.put("/:id", validateUpdateCity, validate, updateCity);
router.delete("/:id", validateDeleteCity, validate, deleteCity);

export default router;
