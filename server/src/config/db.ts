import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error("CRITICAL ERROR: Neither MONGODB_URI nor MONGO_URI is defined in environment variables.");
      return;
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    if (!uri.includes("tlsAllowInvalidCertificates") && !uri.includes("localhost") && !uri.includes("127.0.0.1")) {
      uri += (uri.includes("?") ? "&" : "?") + "tlsAllowInvalidCertificates=true&ssl=true";
    }

    await mongoose.connect(uri, {
      tlsAllowInvalidCertificates: true,
      ssl: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export default connectDB;