import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error("CRITICAL ERROR: Neither MONGODB_URI nor MONGO_URI is defined in environment variables.");
      return;
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export default connectDB;