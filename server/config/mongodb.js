import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";

const connectDB = async() => {
  await mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log("MongoDB connected successfully."));
}

export default connectDB;