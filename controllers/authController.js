import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Role from "../models/Role.js";
const secret = process.env.JWT_SECRET;

// ---------------- SIGNUP ----------------
const signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      user.roles = foundRoles.map(role => role._id);
    } else {
      const riderRole = await Role.findOne({ name: "rider" });
      user.roles = [riderRole._id];
    }

    await user.save();

    res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ---------------- SIGNIN ----------------
const signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: 86400 });

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ✅ Correct export
export { signup, signin };
