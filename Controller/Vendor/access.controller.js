const apiResponse = require("../../utility/apirespone");
const User = require("../../models/UserSchema");
const bcrypt = require("bcrypt");
const HelperFunction = require("../../utility/function");
const Restaurnt = require("../../models/Restaurnt");
const Category = require("../../models/Category");
const Tag = require("../../models/tags");
const {
  VENDOR,
  ERROR,
  AUTH,
  REVIEW,
  DB,
  SUCCESS,
  USER,
} = require("../../utility/messages");
const jwt = require("jsonwebtoken");
const SchemaValidate = require("../../utility/validate");
const productsSchema = require("../../models/productsSchema");
const Order = require("../../models/orderSchema");
const ReviewSchema = require("../../models/reviewSchema");
const mongoose = require("mongoose");

// in register fields we add address also of restaurant
exports.register = async (req, res) => {
  let { name, email, gender, mobile, password, restaurant } = req.body;
  email = email.trim().toLowerCase();
  name = name.trim();

  //   validate inputs fields here
  const validate = SchemaValidate.vendorRegisterSchema.validate(req.body);
  if (validate.error) {
    return apiResponse.errorResponse(res, validate.error.details[0].message);
  }
  try {
    //  check already userExists
    const regexEmail = new RegExp(`^${email}$`, "i"); // regex is use for searching not save

    const userExist = await User.findOne(
      {
        $or: [{ email: regexEmail }, { mobile: mobile }],
        status: { $ne: 2 },
      },
      { email: 1 }
    ).lean();

    if (userExist) {
      if (userExist.email === email) {
        return apiResponse.errorResponse(res, VENDOR.emailAlreadyExist);
      } else {
        return apiResponse.errorResponse(res, VENDOR.mobileExists);
      }
    }

    const [hashPassword, otp] = await Promise.all([
      bcrypt.hash(password, 10),
      HelperFunction.randomNumber(),
    ]);

    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Transaction -when we are doing multiple db operation then we use it . let's take a example you want to save both user and restaurant both
    // but due to some reason user saved and restaurant not saved then problem create so solve this we use transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = new User({
      fullname: name,
      email,
      gender,
      mobile,
      password: hashPassword,
      role: "vendor",
      otp: hashedOtp,
      otpExpires: otpExpires,
    });

    // create Restaurant
    const restaurantModel = new Restaurnt({
      owner: user._id,
      name: restaurant.name,
      email: restaurant.email,
      address: restaurant.address,
      phone: restaurant.phone,
      description: restaurant.description,
      images: restaurant.images,
    });

    // await user.save();
    // await restaurantModel.save();

    // const [userSaved, restaurantSaved] = await Promise.all([
    //   user.save({ session }),
    //   restaurantModel.save({ session }),
    // ]);

    console.log(user);

    await session.commitTransaction();

    return apiResponse.successResponse(res, VENDOR.restaurantCreated);
  } catch (error) {
    if (session) await session.abortTransaction();
    session.endSession();
    if (error.type === "ValidationError") {
      return apiResponse.serverError(res, DB.validationError);
    }
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.resendOtp = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return apiResponse.errorResponse(res, VENDOR.userNotFound);
    }
    let otpValid = user?.otpExpires.getTime() > Date.now();

    if (otpValid) {
      return apiResponse.errorResponse(res, "Otp already sent wait 5 min.");
    }
    const otp = HelperFunction.randomNumber();
    const hashOtp = await bcrypt.hash(otp.toString(), 10);
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 15 minutes
    user.otp = hashOtp;
    user.otpExpires = otpExpires;
    await user.save();
    return apiResponse.successResponse(res, VENDOR.otpsent);
  } catch (error) {
    console.log(error);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.otpVerified = async (req, res) => {
  const { otp, userId } = req.body;
  try {
    const user = await User.findOne({
      _id: userId,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return apiResponse.errorResponse(res, VENDOR.otpExpired);
    }

    const comparedOtp = await bcrypt.compare(otp, user.otp);

    if (!comparedOtp) {
      return apiResponse.errorResponse(res, VENDOR.otpnotMatched);
    }
    user.otp = null;
    user.otpExpires = null;
    user.otpVerified = true;
    await user.save();
    return apiResponse.successResponse(res, VENDOR.otpVerified);
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;
  try {
    const regexEmail = new RegExp(`^${email}$`, "i");

    if (!email || !password) {
      return apiResponse.errorResponse(res, VENDOR.emailPasswordrequired);
    }
    // 🔹 Normalize inputs
    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await User.findOne({
      status: { $ne: 2 },
      email: { $regex: regexEmail },
      role: "vendor",
    });

    if (!user) {
      return apiResponse.errorResponse(res, VENDOR.invalidCredential);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return apiResponse.errorResponse(res, VENDOR.invalidCredential);
    }
    const restaurnatDetails = await Restaurnt.findOne(
      { owner: user._id, status: { $ne: 2 }, approveStatus: "approved" },
      { approveStatus: 0, isBlocked: 0 }
    );

    const token = await jwt.sign(
      { _id: user._id, role: "vendor" },
      process.env.VENDOR_JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("vendorToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV_PRODUCTION === "production",
      samesite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return apiResponse.successResponsewithData(res, VENDOR.loginSuccess, {
      token,
      vendor: {
        _id: user._id,
        fullname: user.fullname,
        profileImage: user?.img,
        mobile: user.mobile,
        email: user.email,
        gender: user.gender,
        role: user.role,
        joined: user.createdAt,
        restaurant: restaurnatDetails,
      },
    });
  } catch (error) {
    console.log(error);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getProfle = async (req, res) => {
  try {
    if (!req.vendor?._id && req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const user = await User.findOne(
      { _id: req.vendor._id },
      { fullname: 1, email: 1, mobile: 1, gender: 1, img: 1 }
    );

    return apiResponse.successResponsewithData(
      res,
      VENDOR.profileFetched,
      user
    );
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.updateProfile = async (req, res) => {
  const { fullName, img, email, mobile, gender, id } = req.body;

  try {
    const id = req.vendor?._id;
    if (!id) {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }

    if (
      req.body.role ||
      req.body.otp ||
      req.body.otpExpires ||
      req.body.status
    ) {
      return apiResponse.errorResponse(res, VENDOR.adminHaveAccess);
    }

    const validate = SchemaValidate.vendorupdateProfile.validate(req.body);
    if (validate.error) {
      return apiResponse.errorResponse(res, validate.error.details[0].message);
    }
    const updatedVendor = await User.findByIdAndUpdate(
      id,
      {
        fullName: fullName,
        email: email,
        mobile: mobile,
        gender: gender,
        img: img,
      },
      { new: true }
    );
    if (!updatedVendor) {
      return apiResponse.errorResponse(res, VENDOR.userNotFound);
    }
    return apiResponse.successResponse(res, VENDOR.profileupdated);
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

//  we are update here Restaurant status to active or inactive
exports.updateStatus = async (req, res) => {
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const { status, id } = req.body;

    const restaurant = await Restaurnt.findByIdAndUpdate(
      {
        _id: id,
      },
      { $set: { restaurantStatus: status } },
      { new: true }
    );
    if (restaurant) {
      return apiResponse.successResponse(res, VENDOR.statusUpdate);
    }
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.deleteVendor = async (req, res) => {
  try {
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.addFood = async (req, res) => {
  try {
    const {
      name,
      fullprice,
      halfprice,
      description,
      status,
      category,
      foodType,
      food,
    } = req.body;

    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }

    if (!req.file) {
      return apiResponse.errorResponse(res, VENDOR.imageRequired);
    }

    // validate the all fields are filled or not
    const validate = SchemaValidate.vendorFoodSchema.validate(req.body);

    if (validate.error) {
      return apiResponse.errorResponse(res, validate.error.details[0].message);
    }

    const imageUrl = await HelperFunction.enhanceanduploadCloudImage(
      req.file?.buffer
    );

    // now we reduce our image Size and upload it to cloudinary

    const restaurntId = await Restaurnt.findOne({
      owner: req.vendor._id,
    })
      .select("_id")
      .lean();

    if (!restaurntId) {
      return apiResponse.errorResponse(res, VENDOR.restaurantNotFound);
    }

    const finalProduct = {
      name: name,
      category: new mongoose.Types.ObjectId(category),
      fullprice,
      halfprice,
      status: status == "active" ? 1 : 0,
      food,
      src: imageUrl,
      foodType,
      description,
      restaurant: restaurntId._id,
    };

    const savedProduct = new productsSchema(finalProduct);
    savedProduct.save();
    return apiResponse.successResponse(res, VENDOR.productAdded);
  } catch (error) {
    console.log(error);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getAllFoods = async (req, res) => {
  let { searchItem, pageNumber, pageSize, sortOrder, sortBy } = req.body;

  pageNumber = Number.parseInt(pageNumber);
  pageSize = Number.parseInt(pageSize);
  sortOrder = sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const restaurant = await Restaurnt.findOne({
      owner: new mongoose.Types.ObjectId(req.vendor._id),
    });

    const query = {
      status: {
        $ne: 2,
      },
      restaurant: restaurant._id,
    };

    if (searchItem) {
      query.name = { $regex: searchItem, $options: "i" };
    }
    const food = await productsSchema
      .find(query)
      .select("id name src fullprice halfprice tags desc restaurant status")
      .sort(sort)
      .skip(pageNumber * pageSize)
      .limit(pageSize)
      .lean();

    const totalFoods = await productsSchema
      .countDocuments(query)
      .limit(pageSize)
      .lean();

    return apiResponse.successResponsewithData(res, VENDOR.foodFetched, {
      food,
      totalFoods,
    });
  } catch (error) {
    console.log(error);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.foodUpdate = async (req, res) => {
  const { name, fullprice, halfprice, desc, id } = req.body;
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const query = {};

    if (name) {
      query.name = name.trim();
    }
    if (req.file) {
      const imageurl = await HelperFunction.enhanceanduploadCloudImage(
        req.file.buffer
      );
      if (imageurl) {
        query.src = imageurl;
        await HelperFunction.deleteLocalImage(req.file.path);
      }
    }
    if (fullprice) {
      query.fullprice = Number.parseInt(fullprice);
    }
    if (halfprice) {
      query.halfprice = Number.parseInt(halfprice);
    }
    if (desc) {
      query.desc = desc.trim();
    }

    const foodUpdate = await productsSchema
      .findByIdAndUpdate(id, query, {
        new: true,
      })
      .lean();
    if (foodUpdate) {
      return apiResponse.successResponse(res, VENDOR.foodUpdated);
    }
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.foodDelete = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }

    const foodDelete = await productsSchema
      .findByIdAndUpdate(
        id,
        {
          $set: { status: 2 },
        },
        { new: true }
      )
      .lean();
    return apiResponse.successResponse(res, VENDOR.foodDeleted);
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.foodStatusUpdate = async (req, res) => {
  let { id, status } = req.body;
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }

    if (!status) {
      return apiResponse.errorResponse(res, VENDOR.foodStatusRequired);
    }

    status = status === "active" ? 1 : status === "inactive" ? 0 : 2;

    const foodStatusUpdate = await productsSchema
      .findByIdAndUpdate(
        id,
        {
          $set: { status: status },
        },
        { new: true }
      )
      .lean();
    let message;
    message =
      status === 1
        ? VENDOR.foodActive
        : status === 0
        ? VENDOR.foodInactive
        : VENDOR.foodDeleted;

    return apiResponse.successResponse(res, message);
  } catch (error) {
    console.log(error);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.GetAllFoodCategory = async (req, res) => {
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const categores = await Category.find({ status: { $ne: 2 } });
    return apiResponse.successResponsewithData(
      res,
      SUCCESS.dataFound,
      categores
    );
  } catch {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getAllTags = async (req, res) => {
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const tags = await Tag.find();
    return apiResponse.successResponsewithData(res, SUCCESS.dataFound, tags);
  } catch {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getAllOrders = async (req, res) => {
  let { status, pageNumber, pageSize, sortOrder, sortBy, searchItem } =
    req.body;
  pageNumber = Number.parseInt(pageNumber, 0);
  pageSize = Number.parseInt(pageSize, 0);
  sortOrder = sortOrder === "asc" ? -1 : 1;
  const sort = { [sortBy]: sortOrder };

  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const searchQuery = {};

    if (searchItem) {
      searchQuery.orderId = { $regex: searchItem, $options: "i" };
    }

    if (status) {
      searchQuery.status = status;
    }

    const restaurntId = await Restaurnt.findOne(
      {
        owner: new mongoose.Types.ObjectId(req.vendor._id),
      },
      { _id: 1 }
    ).lean();

    if (restaurntId) {
      searchQuery.restaurant = restaurntId._id;
    }
    const orders = await Order.find(searchQuery, {
      razorpayOrderId: 0,
      razorpayPaymentId: 0,
    })
      .skip(pageSize * pageNumber)
      .limit(pageSize)
      .sort(sort)
      .populate("user", "fullname")
      .lean();
    const countDocument = await Order.countDocuments(searchQuery); // give total found
    return apiResponse.successResponsewithData(res, SUCCESS.dataFound, {
      orders,
      totalOrder: countDocument,
    });
  } catch (error) {
    console.log(error);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const order = await Order.findById(id).lean();

    return apiResponse.successResponsewithData(res, VENDOR.orderFetched, order);
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

// working on this controller
exports.updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }

    if (!status) {
      return apiResponse.errorResponse(res, VENDOR.orderStatusRequired);
    }
    const currentOrderStatus = await Order.findById(id).select("status").lean();

    let changeStatus;

    if (status === "rejected") {
      changeStatus = "cancelled";
    } else if (
      currentOrderStatus.status === "pending" &&
      status === "accepted"
    ) {
      changeStatus = "confirmed";
    } else if (currentOrderStatus.status === "confirmed") {
      changeStatus = "preparing";
    } else if ((currentOrderStatus.status = "preparing")) {
      changeStatus = "out-for-delivery";
    } else if (currentOrderStatus.status === "out-for-delivery") {
      changeStatus = "delivered";
    }

    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      { $ne: { status: "cancelled" }, $set: { status: changeStatus } },
      { new: true }
    ).lean();

    return apiResponse.successResponse(res, VENDOR.orderStatusUpdated);
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.filteredOrder = async (req, res) => {
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
  } catch (error) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    if (!req.vendor || req.vendor.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
  } catch (err) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getSingleProductReview = async (req, res) => {
  try {
    const { prodId } = req.params;
    if (!req.vendor || req.vendor.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const reviewStats = await ReviewSchema.aggregate([
      {
        $match: { product: new mongoose.Types.ObjectId(prodId) },
      },
      {
        $lookup: {
          from: "products", // correct collection name
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$product",
          productName: { $first: "$productDetails.name" },
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: 1,
          averageRating: { $round: ["$averageRating", 1] },
          totalRatings: 1,
        },
      },
    ]);

    return apiResponse.successResponsewithData(res, VENDOR.review, reviewStats);
  } catch (err) {
    console.log(err);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.reviewApprovedChange = async (req, res) => {
  try {
    const { id, approval } = req.body;
    if (!req.vendor || req.vendor.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }

    const updatedReview = await ReviewSchema.findByIdAndUpdate(
      new mongoose.Schema.Types.ObjectId(id),
      {
        $set: { isApproved: approval },
      },
      { new: true }
    ).lean();

    if (updatedReview == null) {
      return apiResponse.errorResponse(res, REVIEW.reviewnotFound);
    }

    let message = approval === true ? VENDOR.reviewShow : VENDOR.reviewDisable;

    return apiResponse.successResponse(res, message);
  } catch (err) {
    if (err.name === "CastError") {
      return apiResponse.errorResponse(res, DB.CastError);
    }
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.GetAllEarnings = async (req, res) => {
  try {
    if (!req.vendor || req.vendor.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const vendorObjectId = new mongoose.Types.ObjectId(req.vendor._id);

    const restaurant = await Restaurnt.findOne({
      owner: vendorObjectId,
    }).lean();

    const earnings = await Order.aggregate([
      {
        $match: {
          restaurant: new mongoose.Types.ObjectId(restaurant._id),
          status: "completed",
          paymentStatus: "PAID",
        },
      },
      {
        $lookup: {
          from: "restaurants",
          foreignField: "_id",
          localField: "restaurant",
          as: "restaurantDetails",
        },
      },
      {
        $unwind: "$restaurantDetails",
      },
      {
        $group: {
          _id: "$restaurant",
          totalOrder: { $sum: 1 },
          totalEarning: { $sum: "$totalAmount" },
          restaurantName: { $first: "$restaurantDetails.name" },
        },
      },
      {
        $project: {
          restaurantName: 1,
          totalOrder: 1,
          totalEarning: 1,
        },
      },
    ]);
    return apiResponse.successResponsewithData(
      res,
      SUCCESS.dataFound,
      earnings
    );
  } catch (err) {
    console.log(err);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getTotalPendingOrder = async (req, res) => {
  try {
    const { status } = req.query;
    if (!req.vendor || req.vendor.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const vendorObjectId = new mongoose.Types.ObjectId(req.vendor._id);
    const restaurantId = await Restaurnt.findOne(
      { owner: vendorObjectId },
      { _id: 1 }
    ).lean();
    const pendingOrders = await Order.find(
      {
        restaurant: restaurantId._id,
        status: status,
      },
      { razorpayOrderId: 0, razorpayPaymentId: 0 }
    )
      .lean()
      .sort({ createdAt: 1 });

    return apiResponse.successResponsewithData(
      res,
      SUCCESS.dataFound,
      pendingOrders
    );
  } catch (err) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

//  dashboard controller

exports.dashboardController = async (req, res) => {
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
    const restaurnat = await Restaurnt.findOne(
      {
        owner: new mongoose.Types.ObjectId(req.vendor?._id),
      },
      { _id: 1 }
    ).lean();

    const data = await Order.aggregate([
      {
        $match: {
          restaurant: restaurnat._id, // fixed typo
          paymentStatus: "PAID",
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$restaurant",
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      // Getting Restaurant Details Here
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                status: 1,
                isBlocked: false,
                approveStatus: "approved",
              },
            },
            {
              $project: {
                name: 1,
                owner: 1,
                email: 1,
                phone: 1,
                address: 1,
                rating: 1,
                isBlocked: 1,
              },
            },
          ],
          as: "restaurantData",
        },
      },
      { $unwind: "$restaurantData" },
      // Getting all Active Products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "restaurant",
          pipeline: [
            { $match: { status: 1 } },
            {
              $project: {
                _id: 1,
              },
            },
            {
              $count: "totalActiveProducts",
            },
          ],
          as: "productData",
        },
      },
      { $unwind: "$productData" },

      {
        $project: {
          _id: "$_id",
          totalSales: 1,
          totalOrders: 1,
          restaurantData: 1,
          productData: 1,
        },
      },
    ]);

    return apiResponse.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (err) {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.recentOrders = async (req, res) => {
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }

    const restaurant = await Restaurnt.findOne({
      owner: new mongoose.Types.ObjectId(req.vendor._id),
    });

    const orders = await Order.find({
      status: "completed",
      paymentStatus: "PAID",
      restaurant: restaurant._id,
    })
      .populate("user", "fullname")
      .select("_id user orderId totalAmount createdAt updatedAt status")
      .sort({ createdAt: -1 })
      .lean();
    return apiResponse.successResponsewithData(res, SUCCESS.dataFound, orders);
  } catch (err) {
    console.log(err);
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.dummy = async (req, res) => {
  try {
    if (!req.vendor || req.vendor?.role !== "vendor") {
      return apiResponse.AuthError(res, VENDOR.unauthorizedAccess);
    }
  } catch {
    return apiResponse.serverError(res, ERROR.somethingWentWrong);
  }
};
