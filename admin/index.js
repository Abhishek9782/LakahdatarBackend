const express = require("express");
const router = express.Router();

const AdminRoute = {
  AccessRoute: require("./access/adminRoute"),
  EmailTemplateRoute: require("./EmailTemplates/Emailtemplate.route"),
  categoryRoute: require("./category/category.route"),
  productRoute: require("./products/products.route"),
};

// Registering routes with their corresponding path prefixes
router.use("/access", AdminRoute.AccessRoute); // `/access` route prefix
router.use("/email-templates", AdminRoute.EmailTemplateRoute); // `/email-templates` route prefix
router.use("/categories", AdminRoute.categoryRoute); // `/categories` route prefix
router.use("/product", AdminRoute.productRoute); // `/categories` route prefix

module.exports = router;
