const mongoose = require("mongoose");
const Products = require("../../models/productsSchema");
const apiresponse = require("../../utility/apirespone");
const { SUCCESS, ERROR, FOOD } = require("../../utility/messages");
const redis = require("../../Middlewares/redis");

exports.getAllproducts = async (req, res) => {
  try {
    const { pageNumber, pageSize, searchItem, sortBy, sortorder } = req.query;
    let page = Math.max(0, pageNumber - 1);
    let order = sortorder || -1;
    let sort = sortBy ? { [sortBy]: order } : { createdAt: -1 };
    let regex;

    let condition = {
      status: { $ne: 2 },
      $and: [{}],
    };

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
      .lean()
      .skip(page * pageSize)
      .limit(pageSize)
      .sort(sort);

    const totalCount = await Products.countDocuments(condition);

    if (data) {
      await redis.setEx(
        "allproducts",
        3600,
        JSON.stringify({
          data,
          pageNumber,
          pageSize,
          totalCount,
        })
      );
    }

    return apiresponse.successResponsewithData(res, SUCCESS.dataFound, {
      data,
      pageNumber,
      pageSize,
      totalCount,
    });
  } catch (error) {
    return apiresponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const data = await Products.findOne(
      { _id: id, status: { $ne: 2 } },
      { __v: 0 }
    ).lean();
    return apiresponse.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (error) {
    return apiresponse.serverError(res, ERROR.somethingWentWrong);
  }
};
exports.ourSpecial = async (req, res) => {
  try {
    const allProducts = await Products.find({ __v: 0 }).lean();
    return apiresponse.successResponsewithData(
      res,
      SUCCESS.dataFound,
      allProducts
    );
  } catch (error) {
    return apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};
//  Here We make a query for top 3 Feature Products
exports.FeatureProduts = async (req, res) => {
  try {
    const condition = {
      status: { $ne: 2 },
    };

    const data = await Products.find(condition, { __v: 0 })
      .lean()
      .sort({ rating: -1 })
      .limit(3);

    return apiresponse.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (error) {
    return apiresponse.serverError(res, ERROR.somethingWentWrong);
  }
};
exports.findProductType = async (req, res) => {
  try {
    const foodType = req.params.type.trim();
    if (!foodType) {
      return apiresponse.errorResponse(res, FOOD.required);
    }
    // Improved query with regex
    const regex = new RegExp(`\\b${foodType}\\b`, "i"); // Ensures full word match
    const data = await Products.find({ foodType: regex }).lean(); // `.lean()` boosts performance because it doesn't create a new mongoose document

    if (data.length > 0) {
      return apiresponse.successResponsewithData(
        res,
        apiresponse.successResponse,
        data
      );
    } else {
      return apiresponse.errorResponse(res, FOOD.notavailable);
    }
  } catch (error) {
    return apiresponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getFavProduct = async (req, res) => {
  const ids = req.body;
  try {
    const favproducts = await Products.find(
      { _id: { $in: ids } },
      { __v: 0 }
    ).lean();
    return apiresponse.successResponsewithData(
      res,
      SUCCESS.dataFound,
      favproducts
    );
  } catch (error) {
    return apiresponse.serverError(res, ERROR.somethingWentWrong);
  }
};
