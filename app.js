const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); //for Preventing Security Risks when we use frontend connect with backend
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;

//  MOngodb Connection here
const mongodbConnect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB connect successfully ...");
};

// middleware is here
app.use(express.urlencoded({ extended: false })); //this is for our data is passing from urlencoded bodies in express
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//  All routes Configerations is here
const userRoute = require("./Routes/user");
const productRoute = require("./Routes/products");

// Router use is here
app.use(userRoute);
app.use("/food", productRoute);

app.listen(5000, mongodbConnect(), () => {
  console.log(`Server is running on ${port}`);
});
