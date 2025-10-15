import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    carModel: { type: String, required: true },
    carPlate: { type: String, required: true, unique: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", DriverSchema);

export default Driver;

