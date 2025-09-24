import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  MerchantRequestID: String,
  CheckoutRequestID: String,
  ResultCode: Number,
  ResultDesc: String,
  Amount: Number,
  PhoneNumber: String,
  TransactionDate: String,
  MpesaReceiptNumber: String
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
