const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); //for Preventing Security Risks when we use frontend connect with backend
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");
const { errorhandler } = require("./utility/errorhandler");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express();
const port = process.env.PORT;

//  MOngodb Connection here
const mongodbConnect = async () => {
  // await mongoose.connect(process.env.MONGODB_LOCAL);
  await mongoose.connect(process.env.MONGO_URL);

  console.log("DB connect successfully ...");
};

// middleware is here
app.use(express.urlencoded({ extended: false })); //this is for our data is passing from urlencoded bodies in express
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "Public")));

//  for live url
const corsOptions = {
  origin: `${process.env.LIVE_URL}`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// app.use(cors(corsOptions));

//  for local url
// const corsOptions = {
//   origin: `${process.env.LOCAL_URL}`,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

app.use(cors(corsOptions));

app.use(cookieParser({}));
app.use(morgan("dev"));
// using this a user can make 100 request per 15 minutes
app.use(rateLimit({ window: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
// errorhandler
app.use(errorhandler);
app.use((req, res, next) => {
  console.log("Incoming request:", {
    origin: req.headers.origin,
    method: req.method,
    headers: req.headers,
  });
  next();
});

//  All routes Configerations is here
const userRoute = require("./Routes/user");
const productRoute = require("./Routes/products");

//  Admin Route
const AdminRoutes = require("./admin/index");

// Router use is here
app.use(userRoute);
app.use("/food", productRoute);
app.use(process.env.ADMIN_PREFIX, AdminRoutes);

app.listen(5000, mongodbConnect(), () => {
  console.log(`Server is running on ${port}`);
});
