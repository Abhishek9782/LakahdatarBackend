const products = require("express").Router();
const {
  getAllproducts,
  addProducts,
  findProduct,
  findProductType,
  FeatureProduts,
  getFavProduct,
  searchProduct,
} = require("../Controller/productController");

products.get("/", getAllproducts);
products.post("/", addProducts);
products.get("/productopen/:id", findProduct);
products.get("/featureProducts", FeatureProduts);
products.get("/type/:type", findProductType);
products.get("/favProduct:id", getFavProduct);
products.get("/searchProduct", searchProduct);

module.exports = products;
