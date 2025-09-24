// middleware/authJwt.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

export const isRider = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.roles.includes("rider")) {
      return next();
    }
    return res.status(403).json({ message: "Require Rider Role!" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const isDriver = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.roles.includes("driver")) {
      return next();
    }
    return res.status(403).json({ message: "Require Driver Role!" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.roles.includes("admin")) {
      return next();
    }
    return res.status(403).json({ message: "Require Admin Role!" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

