import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectMongoDB() {
  await mongoose.connect(env.mongodbUri);
  console.log("MongoDB connection successful");
}
