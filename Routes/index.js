const express = require("express");
const route = express.Router();

const Routes = {
  accessRoutes: require("./access/index"),
  vendorRoutes: require("./Vendor/index"),
  adminRoutes: require("./admin/index"),
};

route.use(Routes.accessRoutes);
route.use("/vendor", Routes.vendorRoutes);
route.use("/admin", Routes.adminRoutes);

module.exports = route;
