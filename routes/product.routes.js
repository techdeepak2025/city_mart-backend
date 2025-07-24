import express from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, updateProductPartial } from "../controllers/product.controller.js";
import { uploadProductImages } from "../middlewares/cloudinaryUploader.js"; 
import { validate } from "../middlewares/validate.js";
import { validateCreateProduct, validateUpdateProduct, validateDeleteProduct, validatePartialUpdate } from "../validators/product.validator.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post( "/", uploadProductImages.array("images", 5), validateCreateProduct, validate, createProduct );
router.put( "/:id", uploadProductImages.array("images", 5), validateUpdateProduct, validate, updateProduct );
router.delete("/:id", validateDeleteProduct, validate, deleteProduct);
router.patch("/:id", validatePartialUpdate, validate, updateProductPartial);

export default router;
