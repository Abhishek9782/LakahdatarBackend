const Products = require("../models/productsSchema");

exports.getAllproducts = async (req, res) => {
  const { limit, skip } = req.query;

  const Lm = Number.parseInt(limit) || 15;
  const Sk = Number.parseInt(skip) || 0;
  console.log(Sk);

  try {
    const allProducts = await Products.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          src: 1,
          price: 1,
          food: 1,
          rating: 1,
        },
      },
      { $skip: Sk },
      { $limit: Lm },
    ]);

    let hasNextPage;
    if (allProducts.length < limit) {
      hasNextPage = false;
    } else {
      hasNextPage = true;
    }
    console.log(hasNextPage);
    res.status(200).json({ allProducts, hasNextPage });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.ourSpecial = async (req, res) => {
  try {
    const allProducts = await Products.find().lead();
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
    res.status(200).json(findProduct);
  } catch (error) {
    res.status(500).json({ message: "something error" });
  }
};

exports.findProductType = async (req, res) => {
  console.log(req.params.type);
  try {
    const findProduct = await Products.find({
      foodType: { $regex: req.params.type, $options: "i" },
    });
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

exports.searchProduct = async (req, res) => {
  const foodName = req.query.foodname;
  try {
    const searchedFoood = await Products.find({
      name: { $regex: foodName, $options: "i" },
    });
    console.log(searchedFoood);
    res.status(200).json(searchedFoood);
  } catch (err) {
    res.status(500).json(err);
  }
};
