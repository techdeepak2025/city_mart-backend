import express from "express";
import { loginUser, getCurrentUser } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

export default router;
