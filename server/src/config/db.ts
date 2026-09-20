import mongoose from "mongoose";

const DEFAULT_MONGO_URI =
  "mongodb+srv://jenishmacwan230_db_user:5wiJMD07fkN9HM9P@familyid-db.xtpksng.mongodb.net/?appName=FamilyID-DB";

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGO_URI;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // Fast error diagnosis if disconnected
    mongoose.set("bufferCommands", false);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4 DNS resolution for Cloud hosts like Render
    });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export default connectDB;