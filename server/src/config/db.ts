import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    let uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("MONGO_URI is not defined in environment variables.");
      return;
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    if (!uri.includes("tlsAllowInvalidCertificates")) {
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