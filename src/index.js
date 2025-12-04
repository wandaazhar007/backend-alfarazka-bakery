// src/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5011;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Alfarazka Bakery backend is running 🚀");
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Alfarazka Bakery API running on http://localhost:${PORT}`);
});