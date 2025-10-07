import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride", // link payment to ride
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  reference: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
