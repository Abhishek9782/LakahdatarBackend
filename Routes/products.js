const products = require("express").Router();
const {
  getAllproducts,
  addProducts,
  findProduct,
  findProductType,
  FeatureProduts,
  getFavProduct,
} = require("../Controller/productController");

products.get("/", getAllproducts);
products.post("/", addProducts);
products.get("/productopen/:id", findProduct);
products.get("/featureProducts", FeatureProduts);
products.get("/type/:type", findProductType);
products.get("/favProduct:id", getFavProduct);

module.exports = products;
