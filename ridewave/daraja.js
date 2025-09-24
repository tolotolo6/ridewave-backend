// ridewave-daraja.js
import express from "express";
import axios from "axios";

const router = express.Router();

// ======= CONFIG =======
const CONSUMER_KEY = "lPUGP6hGAW1O1mLH5yfsW9SgigL8yfPw2h7OI2HQuAzdajIl";
const CONSUMER_SECRET = "1WIo5nZLcfFvTXC1RzIKPoPH0aWNckpex2lfc3v0zGXMyIzG1yAhEiUrKVRXGqPt";
const SHORTCODE = "174379"; // Paybill or Till number
const PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // Lipa Na M-Pesa Online Passkey
const CALLBACK_URL = "https://yourdomain.com/api/payment/callback"; // Replace with your live URL

// Sandbox endpoints
const OAUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

// ======= GET OAUTH TOKEN =======
const getToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  try {
    const response = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting OAuth token:", error.response?.data || error.message);
    throw error;
  }
};

// ======= INITIATE STK PUSH =======
router.post("/stkpush", async (req, res) => {
  const { amount, phoneNumber } = req.body;

  if (!amount || !phoneNumber) {
    return res.status(400).json({ error: "Amount and phone number are required" });
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
    TransactionDesc: "Payment for Ridewave ride",
  };

  try {
    const token = await getToken();
    const response = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error initiating STK push:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// ======= HANDLE DARJA CALLBACK =======
router.post("/callback", (req, res) => {
  const callbackData = req.body;
  console.log("Daraja Callback Received:", JSON.stringify(callbackData, null, 2));

  // TODO: Update payment status in MongoDB
  // Example: Payment.findByIdAndUpdate(paymentId, { status: "Completed" })

  res.status(200).send("Received");
});

export default router;

