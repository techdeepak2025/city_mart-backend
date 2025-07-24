import express from "express";
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} from "../controllers/store.controller.js";
import {
  validateCreateStore,
  validateUpdateStore,
  validateDeleteStore,
} from "../validators/store.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.post("/", validateCreateStore, validate, createStore);
router.put("/:id", validateUpdateStore, validate, updateStore);
router.delete("/:id", validateDeleteStore, validate, deleteStore);

export default router;
