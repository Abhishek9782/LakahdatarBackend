const products = require("express").Router();
const productController = require("../../Controller/access/productController");

products.post("/", productController.getAllproducts);
products.get("/getProduct/:id", productController.getOneProduct);
products.get("/our-special", productController.ourSpecial);
products.get("/featureProducts", productController.FeatureProduts);
products.get("/type/:type", productController.findProductType);
products.post("/favProduct", productController.getFavProduct);

module.exports = products;
