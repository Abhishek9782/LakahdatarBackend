const user = require("express").Router();
const express = require("express");
const UserController = require("../../Controller/access/userController");
const { userAuth } = require("../../Middlewares/middlewares");
const { loginLimitior } = require("../../utility/function");

user.post("/user-register", UserController.userRegister);
user.post("/verifyOtp", UserController.verifyOtp);
user.post("/resendOtp", UserController.resendOtp);
user.post("/user-login", loginLimitior, UserController.userLogin);
user.post("/changePassword", userAuth, UserController.changePassword);
user.post("/forgotPassword", UserController.forgotPassword);
user.get("/getProfile/:id", userAuth, UserController.getProfile);
user.post("/addToCart/:id", userAuth, UserController.addToCart);
user.post("/logout", userAuth, UserController.UserLogout);
user.get("/getAllCarts", userAuth, UserController.usersCarts);
user.post("/cartDecreaseQty/:id", userAuth, UserController.userDecreaseCart);
user.post("/cartIncreaseQty/:id", userAuth, UserController.userIncreamentCart);
user.post("/user-address-add", userAuth, UserController.addAddress);
user.post(
  "/api/create-payment-order",
  userAuth,
  UserController.createPaymentOrder
);
user.post("/api/verify-payment", userAuth, UserController.verifyPayment);
user.post("/save-order", userAuth, UserController.createDbOrder);
user.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  UserController.paymentWebHook
);
user.post("/addaddress", userAuth, UserController.AdduserAddress);

module.exports = user;
