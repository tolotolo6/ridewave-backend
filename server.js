import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import PaymentModel from "./models/Payment.js";
import RideModel from "./models/Ride.js";
import { authenticateToken, authorizeRoles } from "./utils/authMiddleware.js";
import driverRoutes from "./routes/driverRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === MongoDB Connection ===
const MONGO_URI =
  "mongodb+srv://Ridewave_user:aezgH215Nlhwz0K8@cluster0.w49ewkg.mongodb.net/ridewave?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const Payment = PaymentModel;
const Ride = RideModel;

// === Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

// === Daraja Sandbox Config ===
const CONSUMER_KEY = "lPUGP6hGAW1O1mLH5yfsW9SgigL8yfPw2h7OI2HQuAzdajIl";
const CONSUMER_SECRET = "1WIo5nZLcfFvTXC1RzIKPoPH0aWNckpex2lfc3v0zGXMyIzG1yAhEiUrKVRXGqPt";
const SHORTCODE = "174379";
const PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const CALLBACK_URL = "https://ridewave-backend-vfhb.onrender.com/api/payment/callback";

const OAUTH_URL =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const STK_PUSH_URL =
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

// === Get Access Token ===
const getToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const response = await axios.get(OAUTH_URL, {
    headers: { Authorization: `Basic ${auth}` },
  });
  return response.data.access_token;
};

// === STK Push Route ===
app.post("/api/payment/stkpush", authenticateToken, async (req, res) => {
  const { phoneNumber, amount, rideId } = req.body;

  if (!phoneNumber || !amount || !rideId) {
    return res.status(400).json({ error: "Phone, amount & rideId required" });
  }

  if (!/^2547\d{8}$/.test(phoneNumber)) {
    return res.status(400).json({ error: "Phone number must be in 2547XXXXXXXX format" });
  }

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString("base64");

  const accountReference = `${req.user.id}|${rideId}`;

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: "Payment for Ridewave ride",
  };

  try {
    const token = await getToken();
    const response = await axios.post(STK_PUSH_URL, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json({
      message: "STK Push request sent successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      error: "STK Push failed",
      details: err.response?.data || err.message,
    });
  }
});

// === Callback Route ===
app.post("/api/payment/callback", async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    if (!callbackData) return res.status(400).send("No callback data");

    const [userId, rideId] = (callbackData.AccountReference || "|").split("|");

    const paymentInfo = {
      MerchantRequestID: callbackData.MerchantRequestID,
      CheckoutRequestID: callbackData.CheckoutRequestID,
      ResultCode: callbackData.ResultCode,
      ResultDesc: callbackData.ResultDesc,
      Amount: callbackData.CallbackMetadata?.Item.find((i) => i.Name === "Amount")?.Value,
      PhoneNumber: callbackData.CallbackMetadata?.Item.find((i) => i.Name === "PhoneNumber")?.Value,
      TransactionDate: callbackData.CallbackMetadata?.Item.find((i) => i.Name === "TransactionDate")?.Value,
      MpesaReceiptNumber: callbackData.CallbackMetadata?.Item.find((i) => i.Name === "MpesaReceiptNumber")?.Value,
      userId: userId || null,
      rideId: rideId || null,
    };

    const payment = new Payment(paymentInfo);
    await payment.save();

    if (rideId) {
      await Ride.findByIdAndUpdate(rideId, { paymentId: payment._id });
    }

    res.status(200).send("Payment received and saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing payment callback");
  }
});

// === Admin Only: All Payments ===
app.get("/api/payment/all", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// === User Payments ===
app.get("/api/payment/mine", authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Ridewave backend running on port ${PORT}`));
