// daraja/sandbox.js
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const router = express.Router();

// ======= SANDBOX CONFIG =======
const CONSUMER_KEY = "lPUGP6hGAW1O1mLH5yfsW9SgigL8yfPw2h7OI2HQuAzdajIl"; // from Daraja sandbox
const CONSUMER_SECRET = "1WIo5nZLcfFvTXC1RzIKPoPH0aWNckpex2lfc3v0zGXMyIzG1yAhEiUrKVRXGqPt"; // from Daraja sandbox
const SHORTCODE = "174379"; // Sandbox Paybill
const PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // Sandbox passkey
const CALLBACK_URL = "https://ridewave-backend-vfhb.onrender.com/api/payment/callback"; // Update if deployed

const OAUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

// ======= BODY PARSER =======
router.use(bodyParser.json());

// ======= GET OAUTH TOKEN =======
const getToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const response = await axios.get(OAUTH_URL, { headers: { Authorization: `Basic ${auth}` } });
  return response.data.access_token;
};

// ======= STK PUSH =======
router.post("/stkpush", async (req, res) => {
  const { phoneNumber, amount } = req.body;
  if (!phoneNumber || !amount) return res.status(400).json({ error: "Phone and amount required" });

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
    const response = await axios.post(STK_PUSH_URL, payload, { headers: { Authorization: `Bearer ${token}` } });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "STK Push failed" });
  }
});

// ======= CALLBACK =======
router.post("/callback", (req, res) => {
  console.log("Daraja Sandbox Callback:", JSON.stringify(req.body, null, 2));
  // TODO: Update MongoDB payment status here
  res.status(200).send("Received");
});

export default router;
