import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users = []; // temporary in-memory storage

export const register = (req, res) => {
  const { phone, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { id: users.length + 1, phone, password: hashedPassword };
  users.push(user);
  res.json({ message: "User registered", user });
};

export const login = (req, res) => {
  const { phone, password } = req.body;
  const user = users.find((u) => u.phone === phone);
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
};
