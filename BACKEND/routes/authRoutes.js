import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// // ✅ Register New User
// router.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "✅ User registered successfully" });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // ✅ Login User
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "User not found" });

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword)
//       return res.status(401).json({ message: "Invalid credentials" });

//     // Generate JWT Token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(200).json({
//       message: "✅ Login successful",
//       token,
//       username: user.username,
//       email: user.email,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;


// Register Route
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });

    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
