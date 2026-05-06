import authRoutes from "./routes/authRoutes.js";

import { protect } from "./middleware/authMiddleware.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ FIRST middleware
app.use(cors());
app.use(express.json());

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// ✅ THEN routes
app.use("/api/auth", authRoutes);

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
