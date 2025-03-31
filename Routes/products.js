const products = require("express").Router();
const {
  getAllproducts,
  getOneProduct,
  findProductType,
  FeatureProduts,
  getFavProduct,
  ourSpecial,
} = require("../Controller/productController");

products.post("/", getAllproducts);
products.get("/getProduct/:id", getOneProduct);
products.get("/our-special", ourSpecial);
products.get("/featureProducts", FeatureProduts);
products.get("/type/:type", findProductType);
products.get("/favProduct/:id", getFavProduct);

module.exports = products;
