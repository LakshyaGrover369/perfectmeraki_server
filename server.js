const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS
const allowedOrigins = [];
if (process.env.NODE_ENV == "production") {
  allowedOrigins.push("https://connect-hq.vercel.app");
} else {
  allowedOrigins.push("http://localhost:5173");
  allowedOrigins.push("http://192.168.0.103:5173");
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// Root route with proper response
app.get("/", (req, res) => {
  res.send(`perfect meraki is running on port ${PORT}`);
});

// Connect to DB and start server
connectDB().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port no ${PORT}`);
});

module.exports = app;
