const { json } = require("express");
const Products = require("../models/productsSchema");

exports.getAllproducts = async (req, res) => {
  try {
    const allProducts = await Products.find();
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.addProducts = async (req, res) => {
  try {
    const addProduct = await Products.create(req.body);
    res.status(201).json(addProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.findProduct = async (req, res) => {
  try {
    const findProduct = await Products.findOne({ _id: req.params.id });
    res.status(201).json(findProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};
//  Here We make a query for top 3 Feature Products
exports.FeatureProduts = async (req, res) => {
  try {
    const findProduct = await Products.find().sort({ rating: -1 }).limit(3);
    // console.log(findProduct);
    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: "something error" });
  }
};

exports.findProductType = async (req, res) => {
  try {
    const findProduct = await Products.find({ foodType: req.params.type });
    res.status(201).json(findProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.getFavProduct = async (req, res) => {
  const id = req.params.id;
  const ids = id.split(",");
  let filterfavProduct = [];
  try {
    for (let i = 0; i < ids.length; i++) {
      const data = await Products.findOne({ _id: ids[i] });
      filterfavProduct.push(data);
    }
    res.status(200).json(filterfavProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};
