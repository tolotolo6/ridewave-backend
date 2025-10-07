import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  fare: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ["requested", "accepted", "completed", "cancelled", "paid"],
    default: "requested",
  },
}, { timestamps: true });

export default mongoose.model("Ride", rideSchema);
