import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Allowed image formats
const allowedFormats = ["jpg", "jpeg", "png", "webp", "avif"];

// Cloudinary image transformation (optional)
const transformation = [{ width: 500, height: 500, crop: "limit" }];

// Filter to allow only image types
export const imageFileFilter = (req, file, cb) => {
  const isAllowed = file.mimetype.startsWith("image/");
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Factory function to create Cloudinary storage
const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedFormats,
      transformation,
      public_id: (req, file) => {
        const timestamp = Date.now();
        const cleanName = file.originalname
          .split(".")[0]
          .replace(/\s+/g, "-")
          .toLowerCase();
        return `${timestamp}-${cleanName}`;
      },
    },
  });

// 📦 Multer uploaders by folder
export const uploadCategoryImage = multer({
  storage: createStorage("categories"),
  fileFilter: imageFileFilter,
});

export const uploadBrandImage = multer({
  storage: createStorage("brands"),
  fileFilter: imageFileFilter,
});

export const uploadSubCategoryImage = multer({
  storage: createStorage("sub-categories"),
  fileFilter: imageFileFilter,
});

export const uploadUserAvatar = multer({
  storage: createStorage("users"),
  fileFilter: imageFileFilter,
});

export const uploadProductImages = multer({
  storage: createStorage("products"),
  fileFilter: imageFileFilter,
});
