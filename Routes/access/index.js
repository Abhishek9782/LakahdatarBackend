const express = require("express");

const route = express.Router();

const Routes = {
  order: require("./order"),
  product: require("./products"),
  user: require("./user"),
};

route.use(Routes.order);
route.use("/food", Routes.product);
route.use(Routes.user);

module.exports = route;
