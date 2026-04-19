import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "JavaScript Server is up and running." });
});

app.use("/v1/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
