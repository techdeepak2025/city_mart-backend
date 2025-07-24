import express from "express";
import { getBrands, createBrand, updateBrand, deleteBrand } from "../controllers/brand.controller.js";
import { uploadBrandImage } from "../middlewares/cloudinaryUploader.js";
import { validateCreateBrand, validateUpdateBrand, validateDeleteBrand } from "../validators/brand.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getBrands);
router.post( "/", uploadBrandImage.single("logo"), validateCreateBrand, validate, createBrand );
router.put( "/:id", uploadBrandImage.single("logo"), validateUpdateBrand, validate, updateBrand );
router.delete( "/:id", validateDeleteBrand, validate, deleteBrand );

export default router;
