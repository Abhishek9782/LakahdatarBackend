// ------------------ Imports ------------------
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");
const { errorhandler } = require("./utility/errorhandler");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const { mongodbConnect } = require("./config/dbconfig");
const { autoCancelledOrder } = require("./utility/cron");
const helperFunction = require("./utility/function");

const app = express();
const port = process.env.PORT || 5000;

// ------------------ Security / CORS ------------------
const corsOptions = {
  origin: process.env.LIVE_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const serverRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, try again after some time...",
});

// ------------------ Connect DB ------------------

// ------------------ Global Middlewares ------------------

// Parse body FIRST (so others can use req.body)
app.use(express.json({ limit: "50kb" }));

app.use(express.urlencoded({ extended: true }));

// Security Headers
app.use(helmet());

// Response compression
app.use(compression());

// Logging
app.use(morgan("dev"));

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "Public")));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors(corsOptions));

// Rate limiting
app.use(serverRateLimiter);

// MongoDB Injection Protection
app.use(mongoSanitize());

// Basic XSS filter for JSON/urlencoded payloads
app.use(xssClean());

// --- Sanitize all inputs, even multipart/form-data ---
app.use(helperFunction.sanitizeFields);
// ------------------ Routes ------------------
app.use(process.env.API_VERSION, require("./Routes/index"));

// ------------------ Error Handling ------------------
app.use(errorhandler);
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: err.message });
});

// ------------------ Cron Jobs ------------------

// ------------------ Server ------------------

const startServer = async () => {
  try {
    await mongodbConnect();
    autoCancelledOrder();
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
