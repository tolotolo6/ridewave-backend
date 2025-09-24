import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pickupLocation: String,
    dropoffLocation: String,
    status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" },
    fare: Number
}, { timestamps: true });

export default mongoose.model("Ride", rideSchema);
