import express from "express";
import { registerUser, loginUser } from "../../controllers/auth.js";

const authRoutes = express.Router();

// API Endpoints
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);

export default authRoutes;
