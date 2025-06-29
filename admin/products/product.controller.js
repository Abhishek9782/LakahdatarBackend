const {
  USER,
  ERROR,
  PRODUCT,
  SUCCESS,
  ADMIN,
} = require("../../utility/messages");
const Product = require("../../models/productsSchema");
const apiresponse = require("../../utility/apirespone");
const { removeSpecialchar } = require("../../utility/function");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs").promises;

exports.productAdd = async (req, res) => {
  try {
    const { name, foodType, food, desc } = req.body;
    const fullprice = parseInt(req.body.fullprice);
    const halfprice = parseInt(req.body.halfprice);

    if (!req.file) {
      return apiresponse.errorResponse(res, "Image is required");
    }

    const originalPath = req.file.path;
    const filename = `product-${Date.now()}.webp`;
    const outputDir = path.join(__dirname, "../../Public/productImages");
    const outputPath = path.join(outputDir, filename);

    // ✅ Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Convert image to webp using sharp
    // Process image to buffer (ensures file handle is released) it is giving image memory only and we are save itusing writefile
    const buffer = await sharp(originalPath)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();

    // Save new .webp image
    await fs.writeFile(outputPath, buffer);

    // ✅ Try deleting the uploaded multer file with retry fallback
    try {
      await fs.unlink(originalPath);
    } catch (err) {
      if (err.code === "EPERM") {
        console.warn("File locked, retrying delete after delay...");
        await new Promise((resolve) => setTimeout(resolve, 300)); // wait 300ms
        try {
          await fs.unlink(originalPath);
          console.log("Successfully deleted after retry.");
        } catch (e2) {
          console.error("Still failed to delete:", e2.message);
        }
      } else {
        throw err;
      }
    }
    if (req.user?.role === "admin") {
      await Product.create({
        name,
        fullprice,
        halfprice,
        foodType,
        food,
        desc,
        src: filename,
      });

      return apiresponse.successResponse(res, PRODUCT.productadded);
    } else {
      return apiresponse.errorResponse(res, ADMIN.notAdmin);
    }
  } catch (error) {
    console.error("Error in productAdd:", error);
    return apiresponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.productDelete = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
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
    if (req.user.role !== "admin") {
      return apiresponse.errorResponse(res, "Unauthorized access");
    }

    const productId = req.params.id;
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return apiresponse.errorResponse(res, "Product not found");
    }

    let updateData = {
      name: req.body.name,
      fullprice: parseInt(req.body.fullprice),
      halfprice: parseInt(req.body.halfprice),
      foodType: req.body.foodType,
    };

    if (req.file) {
      const originalPath = req.file.path;
      const filename = `product-${Date.now()}.webp`;
      const outputDir = path.join(__dirname, "../../Public/productImages");
      const outputPath = path.join(outputDir, filename);

      // Process image to buffer (ensures file handle is released)
      const buffer = await sharp(originalPath)
        .resize(800)
        .webp({ quality: 80 })
        .toBuffer();

      // Save new .webp image
      await fs.writeFile(outputPath, buffer);

      // ✅ Try deleting the uploaded multer file with retry fallback
      try {
        await fs.unlink(originalPath);
      } catch (err) {
        if (err.code === "EPERM") {
          console.warn("File locked, retrying delete after delay...");
          await new Promise((resolve) => setTimeout(resolve, 300)); // wait 300ms
          try {
            await fs.unlink(originalPath);
            console.log("Successfully deleted after retry.");
          } catch (e2) {
            console.error("Still failed to delete:", e2.message);
          }
        } else {
          throw err;
        }
      }

      // ✅ Delete the old DB image
      if (currentProduct.src) {
        const oldImagePath = path.join(outputDir, currentProduct.src);
        try {
          await fs.unlink(oldImagePath);
          console.log("Old image deleted:", currentProduct.src);
        } catch (err) {
          console.warn("Old image not found or already deleted:", err.message);
        }
      }

      updateData.src = filename;
    }

    await Product.updateOne({ _id: productId }, { $set: updateData });
    return apiresponse.successResponse(res, PRODUCT.productUpdated);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return apiresponse.serverError(res, ERROR.somethingWentWrong);
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

    let condition = { status: { $ne: 2 }, $and: [] };
    if (searchItem) {
      let safePattern = removeSpecialchar(searchItem);
      condition.$and.push({ name: new RegExp(safePattern, "i") });
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
