import express from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import { uploadUserAvatar } from "../middlewares/cloudinaryUploader.js"; 
import { validateCreateUser, validateUpdateUser, validateDeleteUser } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.post( "/", uploadUserAvatar.single("avatar"), validateCreateUser, validate, createUser );
router.get("/", getAllUsers);
router.get("/:id", validateObjectId, validateDeleteUser, validate, getUserById );
router.put( "/:id", validateObjectId, uploadUserAvatar.single("avatar"), validateUpdateUser, validate, updateUser );
router.delete( "/:id", validateObjectId, validateDeleteUser, validate, deleteUser );

export default router;
