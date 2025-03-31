const {
  USER,
  ERROR,
  PRODUCT,
  SUCCESS,
  ADMIN,
} = require("../../utility/messages");
const Product = require("../../models/productsSchema");
const apiresponse = require("../../utility/apirespone");

exports.productAdd = async (req, res) => {
  try {
    if (req.body.fullprice) {
      req.body.fullprice = Number.parseInt(req.body.fullprice);
    }
    if (req.body.halfprice) {
      req.body.halfprice = Number.parseInt(req.body.halfprice);
    }

    let { name, fullprice, halfprice, foodType, food, desc } = req.body; // destructuring req.body here

    let productsrc = req.file.filename; //file get
    //  if admin comes then add
    if (req.user && req.user.role == "admin") {
      await Product.create({
        name: name,
        fullprice: fullprice,
        halfprice: halfprice,
        foodType: foodType,
        food: food,
        desc: desc,
        src: productsrc,
      });
      return apiresponse.successResponse(res, PRODUCT.productadded);
    } else {
      return apiresponse.errorResponse(res, ADMIN.notAdmin);
    }
  } catch (error) {
    console.log(error);
    return apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

exports.productDelete = async (req, res) => {
  try {
    const productId = req.params.id;
    if (req.user && req.user.role == "admin") {
      const product = await Product.updateOne(
        { _id: productId },
        { $set: { status: 2 } }
      );
      console.log(product);
      return apiresponse.successResponse(res, PRODUCT.productDelete);
    } else {
      return apiresponse.successResponse(res, ADMIN.notAdmin);
    }
  } catch (error) {
    return apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const productId = req.params.id;

      let data = {
        name: req.body.name,
        fullprice: req.body.fullprice,
        halfprice: req.body.halfprice,
        foodType: req.body.foodType,
      };
      if (req?.file) {
        data = {
          name: req.body.name,
          fullprice: req.body.fullprice,
          halfprice: req.body.halfprice,
          foodType: req.body.foodType,
          src: req.file.filename,
        };
      }
      console.log(data);

      await Product.updateOne(
        { _id: productId },
        {
          $set: data,
        }
      );
      return apiresponse.successResponse(res, PRODUCT.productUpdated);
    }
  } catch (error) {
    console.log(error);
    return apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    let user = req.user;
    if (!user.role === "admin") {
      apiresponse.successResponse(res, ADMIN.notAdmin);
      return;
    }
    const { pageNumber, pageSize, sortBy, sortorder, searchItem } = req.body;

    let page = Math.max(0, pageNumber - 1); // set page number -1
    let sortOrder = sortorder ? sortorder : -1; //if sort order is coming then
    let sort = sortBy ? { [sortBy]: sortOrder } : { createdAt: -1 }; //sorting
    let searchpattern;
    if (searchItem) {
      searchpattern = new RegExp(
        searchItem.replace(/[^a-zA-Z0-9\s]/g, ""),
        "i"
      ); // remove special charechter
    }
    let condition = { status: { $ne: 2 }, $and: [] };
    if (searchpattern) {
      condition.$and.push({ name: searchpattern });
    }
    let product = await Product.find(condition)
      .skip(page * pageSize)
      .limit(pageSize)
      .sort(sort);
    // count total products

    const totalproduct = await Product.countDocuments({ status: { $ne: 2 } });
    const data = {
      products: product,
      currentProduct: product.length,
      totalproduct: totalproduct,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return apiresponse.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (err) {
    return apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

exports.deleteProduct = async (req, res) => {
  if (!req.user) {
    apiresponse.errorResponse(res, "Please Login ");
  }
  try {
    const productId = req.params.id;
    await Product.updateOne({ _id: productId }, { $set: { status: 2 } });
    apiresponse.successResponse(res, "Product Delete SuccessFully.");
  } catch (error) {
    apiresponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};
