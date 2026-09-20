import dotenv from "dotenv";
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import familyRoutes from "./routes/family.routes.js";
import schemeRoutes from "./routes/scheme.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://familyid-jenish.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/families", familyRoutes);
app.use("/api/schemes", schemeRoutes);

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({
    status: "success",
    message: "Family ID API is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer();