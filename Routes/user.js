const user = require("express").Router();
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
} = require("../Controller/userController");
const { userAuth } = require("../Middlewares/middlewares");

user.post("/user-register", userRegister);
user.post("/verifyOtp", verifyOtp);
user.post("/resendOtp", resendOtp);
user.post("/user-login", userLogin);
user.post("/changePassword", userAuth, changePassword);
user.post("/forgotPassword", forgotPassword);
user.get("/getProfile/:id", getProfile);
user.post("/addToCart/:id", userAuth, addToCart);
user.post("/logout", userAuth, UserLogout);
user.get("/getAllCarts", userAuth, usersCarts);
user.post("/cartDecreaseQty/:id", userAuth, userDecreaseCart);
user.post("/cartIncreaseQty/:id", userAuth, userIncreamentCart);

module.exports = user;
