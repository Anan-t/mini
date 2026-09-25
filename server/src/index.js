require("dotenv").config();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const verifyRoute = require("./routes/verify");
const chatRoute = require("./routes/chat");
const voiceRoute = require("./routes/voice");

const app = express();

const PORT = process.env.PORT || 5000;

// MongoDB
connectDB();

// CORS
app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "https://mini-dusky-alpha.vercel.app",
],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "25mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  })
);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Veritas API is running",
    version: "1.0.0",
  });
});

// Routes
app.use("/api/verify", verifyRoute);
app.use("/api/chat", chatRoute);
app.use("/api/voice", voiceRoute);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;

// Only listen locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Veritas backend running on port ${PORT}`);
  });
}