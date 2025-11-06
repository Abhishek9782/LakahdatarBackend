const route = require("express").Router();
4;

const adminRoutes = {
  access: require("./access"),
  category: require("./category"),
  emailTemplate: require("./emailTemplate"),
  product: require("./products"),
  user: require("./user"),
};

route.use("/access", adminRoutes.access);
route.use("/category", adminRoutes.category);
route.use("/email-template", adminRoutes.emailTemplate);
route.use("/product", adminRoutes.product);
route.use("/user", adminRoutes.user);

module.exports = route;
