import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one driver profile per user
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehiclePlate: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleColor: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "active"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);
