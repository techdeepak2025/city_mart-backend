import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { multerErrorHandler } from "./middlewares/errorHandler.js";

import userRoutes from "./routes/user.route.js";
import storeRoutes from "./routes/store.route.js";
import stateRoutes from "./routes/state.routes.js";
import cityRoutes from "./routes/city.routes.js";
import roleRoutes from "./routes/role.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subCategory.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import productRoutes from "./routes/product.routes.js";
import measurementRoutes from "./routes/measurement.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: "https://city-mart-frontend.vercel.app", credentials: true }));
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/users", userRoutes);
app.use("/stores", storeRoutes);
app.use("/states", stateRoutes);
app.use("/cities", cityRoutes);
app.use("/roles", roleRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/sub-categories", subCategoryRoutes);
app.use("/brands", brandRoutes);
app.use("/products", productRoutes);
app.use("/measurements", measurementRoutes);

app.use(multerErrorHandler);

export default app;
