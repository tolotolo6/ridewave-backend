import express from "express";
import axios from "axios";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

// === MongoDB Connection ===
const MONGO_URI = "mongodb+srv://Ridewave_user:aezgH215Nlhwz0K8@cluster0.w49ewkg.mongodb.net/ridewave?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// === JWT Middleware ===
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};

// === Payment Schema ===
const paymentSchema = new mongoose.Schema({
  MerchantRequestID: String,
  CheckoutRequestID: String,
  ResultCode: Number,
  ResultDesc: String,
  Amount: Number,
  PhoneNumber: String,
  TransactionDate: String,
  MpesaReceiptNumber: String,
  userId: String
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

// === Daraja Sandbox Config ===
const CONSUMER_KEY = "lPUGP6hGAW1O1mLH5yfsW9SgigL8yfPw2h7OI2HQuAzdajIl";
const CONSUMER_SECRET = "1WIo5nZLcfFvTXC1RzIKPoPH0aWNckpex2lfc3v0zGXMyIzG1yAhEiUrKVRXGqPt";
const SHORTCODE = "174379";
const PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const CALLBACK_URL = "https://ridewave-backend-vfhb.onrender.com/api/payment/callback";

const OAUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

// === Get Daraja Access Token ===
const getToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const response = await axios.get(OAUTH_URL, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return response.data.access_token;
};

// === STK Push Route (Protected) ===
app.post("/api/payment/stkpush", authenticateToken, async (req, res) => {
  const { phoneNumber, amount } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: "Phone & amount required" });
  }

  if (!/^2547\d{8}$/.test(phoneNumber)) {
    return res.status(400).json({ error: "Phone number must be in 2547XXXXXXXX format" });
  }

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString("base64");

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
    AccountReference: "Ridewave",
    TransactionDesc: "Payment for Ridewave ride"
  };

  console.log("📤 Payload sent to Daraja:", payload);

  try {
    const token = await getToken();
    const response = await axios.post(STK_PUSH_URL, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("✅ STK Push Success:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ STK Push Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "STK Push failed",
      details: err.response?.data || err.message
    });
  }
});

// === Callback Route (Unprotected, called by Safaricom) ===
app.post("/api/payment/callback", async (req, res) => {
  console.log("📥 Daraja Callback Received:", JSON.stringify(req.body, null, 2));

  try {
    const callbackData = req.body.Body.stkCallback;
    if (!callbackData) return res.status(400).send("No callback data");

    const paymentInfo = {
      MerchantRequestID: callbackData.MerchantRequestID,
      CheckoutRequestID: callbackData.CheckoutRequestID,
      ResultCode: callbackData.ResultCode,
      ResultDesc: callbackData.ResultDesc,
      Amount: callbackData.CallbackMetadata?.Item.find(i => i.Name === "Amount")?.Value,
      PhoneNumber: callbackData.CallbackMetadata?.Item.find(i => i.Name === "PhoneNumber")?.Value,
      TransactionDate: callbackData.CallbackMetadata?.Item.find(i => i.Name === "TransactionDate")?.Value,
      MpesaReceiptNumber: callbackData.CallbackMetadata?.Item.find(i => i.Name === "MpesaReceiptNumber")?.Value,
      userId: null // later we can link payments to logged-in user
    };

    const payment = new Payment(paymentInfo);
    await payment.save();

    console.log("✅ Payment saved to MongoDB:", paymentInfo);
    res.status(200).send("Received");
  } catch (err) {
    console.error("❌ Error saving payment:", err);
    res.status(500).send("Error");
  }
});

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Ridewave backend running on port ${PORT}`)
);
