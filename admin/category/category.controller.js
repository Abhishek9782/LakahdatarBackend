const apiResponse = require("../../utility/apirespone");
const { ERROR, ADMIN, CATEGORY } = require("../../utility/messages");
const Category = require("../../models/parentCategory");
const { default: mongoose } = require("mongoose");

//  add Category
exports.createCategory = async (req, res) => {
  try {
    if (!req.user.role == "admin") {
      apiResponse.errorResponse(res, ADMIN.notAdmin);
      return;
    }
    const { name, description } = req.body;
    if (!name) {
      apiResponse.errorResponse(res, CATEGORY.categoryNameRequired);
      return;
    }
    if (!description) {
      apiResponse.errorResponse(res, CATEGORY.categoryDescriptionRequired);
      return;
    }
    let image;
    if (req.file) {
      image = req.file.filename;
    }
    // const category = await Category.create({
    //   name: name,
    //   description: description,
    //   image: image ? image : null,
    // });
    apiResponse.successResponsewithData(
      res,
      CATEGORY.categoryCreated,
      category
    );
  } catch (err) {
    apiResponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

// update category
exports.updateCategory = async (req, res) => {
  try {
    if (!req.user.role == "admin") {
      apiResponse.errorResponse(res, ADMIN.notAdmin);
      return;
    }
    const { name, description, categoryId } = req.body;
    if (!name) {
      apiResponse.errorResponse(res, CATEGORY.categoryNameRequired);
      return;
    }
    if (!description) {
      apiResponse.errorResponse(res, CATEGORY.categoryDescriptionRequired);
      return;
    }

    //  finding Category
    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      apiResponse.errorResponse(res, CATEGORY.categorynotFound);
      return;
    }

    let image;
    if (req.file) {
      image = req.file.filename;
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: category._id },
      {
        name: name,
        description: description,
        image: image ? image : category.image,
      }
    );
    apiResponse.successResponsewithData(
      res,
      CATEGORY.categoryUpdated,
      updatedCategory
    );
  } catch (err) {
    apiResponse.errorResponse(res, ERROR.somethingWentWrong);
  }
};

// delete  category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!req.user.role == "admin")
      return apiResponse.errorResponse(res, ADMIN.notAdmin);
    const updateCategory = await Category.updateOne(
      {
        _id: new mongoose.Types.ObjectId(categoryId),
      },
      { status: 2 }
    );
    apiResponse.successResponse(res, CATEGORY.categoryDeleted);
  } catch (err) {
    apiResponse.errorResponse(res, ERROR.somethingWentWrong);
    return;
  }
};

exports.categoryStatusUpdate = async (req, res) => {
  try {
    const { categoryId, status } = req.body;
    if (!req.user.role == "admin")
      return apiResponse.errorResponse(res, ADMIN.notAdmin);
    await Category.updateOne(
      {
        _id: new mongoose.Types.ObjectId(categoryId),
      },
      { status: status }
    );

    let message =
      status === 1
        ? CATEGORY.categoryActive
        : status === 0
        ? CATEGORY.categoryInactive
        : CATEGORY.categoryDeleted;

    apiResponse.successResponse(res, message);
  } catch (err) {
    apiResponse.errorResponse(res, ERROR.somethingWentWrong);
    return;
  }
};
