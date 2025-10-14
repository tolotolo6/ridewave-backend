import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await mongoose.connection.db.collection("users").dropIndex("username_1");
    console.log("🗑️ Dropped index:", result);

    // Recreate the index correctly
    await mongoose.connection.db.collection("users").createIndex(
      { username: 1 },
      { unique: true, sparse: true }
    );
    console.log("✅ Recreated index with sparse:true");

    await mongoose.disconnect();
  } catch (err) {
    console.error("⚠️ Error:", err.message);
  }
}

fixIndexes();
