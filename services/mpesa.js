import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const stkPush = async (req, res) => {
    try {
        // Placeholder: implement Daraja STK push here
        res.json({ message: "STK Push request received", data: req.body });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

