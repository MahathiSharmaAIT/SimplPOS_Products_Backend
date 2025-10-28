import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config(); // reads .env from process.cwd()

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is missing in .env");
}

const options = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

export const db = mongoose
  .connect(uri, options)
  .then(() => console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
