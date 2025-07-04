const user = require("express").Router();
const express = require("express");
const {
  userLogin,
  userRegister,
  addToCart,
  usersCarts,
  UserLogout,
  getProfile,
  userDecreaseCart,
  userIncreamentCart,
  verifyOtp,
  resendOtp,
  changePassword,
  forgotPassword,
  addAddress,
  // createOrder,
  verifyPayment,
  paymentWebHook,
  AdduserAddress,
  createPaymentOrder,
  createDbOrder,
} = require("../Controller/userController");
const { userAuth } = require("../Middlewares/middlewares");

user.post("/user-register", userRegister);
user.post("/verifyOtp", verifyOtp);
user.post("/resendOtp", resendOtp);
user.post("/user-login", userLogin);
user.post("/changePassword", userAuth, changePassword);
user.post("/forgotPassword", forgotPassword);
user.get("/getProfile/:id", userAuth, getProfile);
user.post("/addToCart/:id", userAuth, addToCart);
user.post("/logout", userAuth, UserLogout);
user.get("/getAllCarts", userAuth, usersCarts);
user.post("/cartDecreaseQty/:id", userAuth, userDecreaseCart);
user.post("/cartIncreaseQty/:id", userAuth, userIncreamentCart);
user.post("/user-address-add", userAuth, addAddress);
user.post("/api/create-payment-order", userAuth, createPaymentOrder);
user.post("/api/verify-payment", userAuth, verifyPayment);
user.post("/save-order", userAuth, createDbOrder);
user.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentWebHook
);
user.post("/addaddress", userAuth, AdduserAddress);

module.exports = user;
