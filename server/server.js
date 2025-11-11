<<<<<<< HEAD
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv/config'
import morgam from 'morgan'

// Create App

const app = express()

app.use(express.json())
app.use(morgam('dev'))

// Connect to DB

mongoose.connect(process.env.MONGO_URI)

const CONNECTION = mongoose.connection
CONNECTION.on('error', console.error.bind(console, 'MongoDB connection error: \n'))
CONNECTION.once('open', () => {
  console.log('MongoDB database connection established successfully')
})


// Test route - to make sure server is running

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Routes

// V1 routes
import routes from './routes/v1/routes.js'

app.use('/api/v1', routes)



// Start server

app.listen(process.env.PORT || 3000)
console.log(`Server running at http://localhost:${process.env.PORT}/`)
=======
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import routes from "./routes/v1/routes.js";

dotenv.config(); // ✅ load environment variables first

// Create App
const app = express();
app.use(express.json());

// Base routes
app.use("/api/v1", routes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const CONNECTION = mongoose.connection;
CONNECTION.on("error", console.error.bind(console, "MongoDB connection error: \n"));
CONNECTION.once("open", () => {
  console.log("✅ MongoDB database connection established successfully");
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});
>>>>>>> c0c82c6 (Initial commit – added working backend (MongoDB connection + listings CRUD))
