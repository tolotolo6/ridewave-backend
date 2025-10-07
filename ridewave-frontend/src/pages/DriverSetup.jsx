import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const DriverSetup = () => {
  const [form, setForm] = useState({
    licenseNumber: "",
    vehicleModel: "",
    vehiclePlate: "",
    vehicleColor: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/drivers/setup", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Driver profile saved!");
      console.log("Driver:", data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save driver info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Driver Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="licenseNumber"
          placeholder="Driver License Number"
          value={form.licenseNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="vehicleModel"
          placeholder="Vehicle Model"
          value={form.vehicleModel}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="vehiclePlate"
          placeholder="Vehicle Plate Number"
          value={form.vehiclePlate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="vehicleColor"
          placeholder="Vehicle Color"
          value={form.vehicleColor}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default DriverSetup;
