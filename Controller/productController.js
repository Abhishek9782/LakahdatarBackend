const Products = require("../models/productsSchema");
const mongoose = require("mongoose");
const apiresponse = require("../utility/apirespone");
const { SUCCESS, ERROR } = require("../utility/messages");

exports.getAllproducts = async (req, res) => {
  try {
    const { pageNumber, pageSize, searchItem, sortBy, sortorder } = req.body;

    let page = Math.max(0, pageNumber - 1);
    let order = sortorder || -1;
    let sort = sortBy ? { [sortBy]: order } : { createdAt: -1 };
    let condition = {
      status: { $ne: 2 },
      $and: [{}],
    };
    let regex;
    if (searchItem) {
      regex = new RegExp(
        searchItem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      condition = {
        status: { $ne: 2 },
        $and: [
          {
            name: { $regex: regex },
          },
        ],
      };
    }

    const data = await Products.find(condition, { __v: 0 })
      .skip(page * pageSize)
      .limit(pageSize)
      .sort(sort);

    const totalCount = await Products.countDocuments(condition);
    return apiresponse.successResponsewithData(res, SUCCESS.dataFound, {
      data,
      pageNumber,
      pageSize,
      totalCount,
    });
  } catch (error) {
    apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};
exports.getOneProduct = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const data = await Products.findOne(
      { _id: id, status: { $ne: 2 } },
      { __v: 0 }
    );
    apiresponse.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (error) {
    apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};
exports.ourSpecial = async (req, res) => {
  try {
    const allProducts = await Products.find().lead();
    res.status(200).json(allProducts);
  } catch (error) {
    apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};
//  Here We make a query for top 3 Feature Products
exports.FeatureProduts = async (req, res) => {
  try {
    const condition = {
      status: { $ne: 2 },
    };
    const data = await Products.find(condition, { __v: 0 })
      .sort({ rating: -1 })
      .limit(3);
    apiresponse.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (error) {
    apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};
exports.findProductType = async (req, res) => {
  try {
    const foodType = req.params.type.trim();
    if (!foodType) {
      return apiresponse.errorResponse(res, "Food type is required.");
    }

    // Improved query with regex
    const regex = new RegExp(`\\b${foodType}\\b`, "i"); // Ensures full word match
    const data = await Products.find({ foodType: regex }).lean(); // `.lean()` boosts performance

    if (data.length > 0) {
      return apiresponse.successResponsewithData(
        res,
        apiresponse.successResponse,
        data
      );
    } else {
      return apiresponse.errorResponse(res, "Currently Not Available");
    }
  } catch (error) {
    console.error("Error fetching product type:", error);
    return apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

exports.getFavProduct = async (req, res) => {
  const id = req.params.id;
  const ids = id.split(",");
  let data = [];
  try {
    for (let i = 0; i < ids.length; i++) {
      const data = await Products.findOne({ _id: ids[i] });
      filterfavProduct.push(data);
    }
    apiresponse.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (error) {
    apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};
