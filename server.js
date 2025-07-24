import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { PORT } from "./config/envConfig.js";
import app from "./app.js";

connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
