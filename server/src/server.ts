import dotenv from "dotenv";
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import familyRoutes from "./routes/family.routes.js";
import schemeRoutes from "./routes/scheme.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/families", familyRoutes);
app.use("/api/schemes", schemeRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Family ID Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();