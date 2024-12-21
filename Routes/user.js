const user = require("express").Router();
const {
  userLogin,
  userRegister,
  addcartinUser,
  usersCarts,
  UserLogout,
  userdeacreasecart,
  userIncrementcart,
} = require("../Controller/userController");

user.post("/user-login", userLogin);
user.post("/user-register", userRegister);
user.post("/user-cart-add/:id", addcartinUser);
user.post("/user-cart-lose/:id", UserLogout);
user.get("/get-carts-by-user/:id", usersCarts);
user.post("/cart/decreaseqty/:id", userdeacreasecart);
user.post("/cart/increment/:id", userIncrementcart);

module.exports = user;
