import User from "../models/users.js";
import { generateToken } from "../utils/jwt.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { name, email, password } = req.body;
    const username = name.toLowerCase();

    console.log("Checking existingUser...");
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      console.log("❌ existingUser triggered:", existingUser);
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    console.log("Checking emailExists...");
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      console.log("❌ Email already exists:", emailExists);
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("Creating new user...");
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    const token = generateToken(newUser);

    console.log("User created successfully!");
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.log("❌ Server error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User does not exist");
      return res.status(400).json({ message: "User does not exist" });
    }

    const verified = await user.comparePassword(password);

    if (!verified) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    console.log("Login successful");
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log("❌ Login error:", error);
    res.status(500).json({ error: "Error logging in user" });
  }
};
