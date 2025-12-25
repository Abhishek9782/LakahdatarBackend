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
const { Server } = require("socket.io");
const http = require("http");
const Notification = require("./models/notification");

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.LOCAL_URL } });

// ------------------SOCKET IO --------------------------

io.on("connection", (socket) => {
  console.log("Someone is connected socket with socket id " + socket.id);

  socket.on("join-vendor-room", (id) => {
    socket.join(id);
    console.log(io.sockets.adapter.rooms.get(id), "getting room by there id ");
  });

  socket.on("placed-order", async (data) => {
    // here we should save notification in db and share Notification to the vendor
    try {
      const { orderId, vendorId, customerName } = data;
      const notification = await Notification.create({
        recipient: vendorId,
        title: "New Order Received",
        message: `Order received from ${customerName}`,
        type: "order",
        role: "vendor",
        data: {
          orderId,
          customerName,
        },
        read: false,
      });
      // 2️⃣ Emit real-time notification to vendor
      io.to(vendorId).emit("new-notification", {
        _id: notification._id,
        message: notification.message,
        type: notification.type,
        orderId: notification.orderId,
        isRead: notification.read,
        createdAt: notification.createdAt,
        data: notification.data,
      });

      console.log(`Notification sent to vendor ${vendorId}`);
    } catch (err) {
      console.log(err);
    }
  });
  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

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
const apiVersion = process.env.API_VERSION;
app.use(apiVersion, require("./Routes/index"));

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
    server.listen(port, () => console.log(`✅ Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
