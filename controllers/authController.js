import User from "../models/UserSchema.js";
import Admin from "../models/AdminSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEYS,
    {
      expiresIn: "15d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "none",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
  });
};

// // register
export const register = async (req, res) => {
  const { email, password, name, role, gender } = req.body;
  try {
    let user = null;
    if (role === "user") {
      user = await User.findOne({ email });
    } else if (role === "admin") {
      user = await Admin.findOne({ email });
    }
    // check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "user") {
      user = new User({
        name,
        email,
        password: hashPassword,
        gender,
        role,
      });
    }
    if (role === "admin") {
      user = new Admin({
        name,
        email,
        password: hashPassword,
        gender,
        role,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "User not created" });
  }
};

// login
export const login = async (req, res) => {
  // Corrected the parameter order (req, res)
  const { email } = req.body;
  try {
    let logger = null;
    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });
    if (user) {
      logger = user;
    }
    if (admin) {
      logger = admin;
    }
    // check if user exists or not
    if (!logger) {
      return res.status(404).json({ message: "User not found" });
    }
    // compare password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      logger.password
    ); // Corrected the password comparison

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }
    // get token
    const token = generateToken(logger);
    const { password, role, appointments, ...rest } = logger._doc;
    res.status(200).json({
      status: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to log in" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      htttpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
