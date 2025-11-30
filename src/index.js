require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares 
app.use(cors());
app.use(express.json());

// Serve uploaded profile pictures
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/emp", require("./routes/employeeRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
