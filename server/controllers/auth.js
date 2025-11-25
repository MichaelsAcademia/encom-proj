import User from "../models/users.js";
import { generateToken } from "../utils/jwt.js";
import { checkEmailExists } from "./checkEmail.js"; // CORRECT PATH

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Convert name to username (lowercase)
    const username = name.toLowerCase();

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Check if email already belongs to someone
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create the new user
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    const token = generateToken(newUser);

    if (!token) {
      return res.status(500).json({ message: "Error creating user" });
    }

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const verified = await user.comparePassword(password);

    if (!verified) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    if (!token) {
      return res.status(400).json({ message: "Error Logging in" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
  }
};
