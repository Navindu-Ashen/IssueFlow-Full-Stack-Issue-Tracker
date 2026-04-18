import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "JavaScript Server is up and running." });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
