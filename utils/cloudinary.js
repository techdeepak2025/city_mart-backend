import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 OPTIONAL: Debug cloudinary uploads
const originalUpload = cloudinary.uploader.upload_stream;
cloudinary.uploader.upload_stream = (...args) => {
  console.log("🔥 Cloudinary upload triggered with args:", args);
  return originalUpload(...args);
};

export default cloudinary;
