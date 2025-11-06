const { ERROR, AUTH } = require("../../utility/messages");
const Order = require("../../models/orderSchema");
const apiresponse = require("../../utility/apirespone");
const mongoose = require("mongoose");

exports.getAllorder = async (req, res) => {
  // startDate and Date are that data which is the user want filter that order according there dates
  if (!req.user) {
    apiresponse.AuthError(res, AUTH.notAuth);
    return;
  }

  let { status, startDate, endDate } = req.body;

  const matchQuery = {
    user: new mongoose.Types.ObjectId(req.user._id),
  };

  if (status && status !== "All") {
    status = status.toLowerCase();

    matchQuery.status = status;
  }

  if (startDate && endDate) {
    matchQuery.orderDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  try {
    const orders = await Order.aggregate([
      { $match: matchQuery },
      {
        $sort: { orderDate: -1 },
      },
    ]);
    const totalOrder = await Order.countDocuments(matchQuery);

    // return res.status(200).json({ orders, totalOrder });
    apiresponse.successResponsewithData(res, "Data found", {
      orders,
      totalOrder,
    });
    return;
  } catch (err) {
    console.log(err);
    apiresponse.serverError(res, ERROR.somethingWentWrong);
    return;
  }
};

exports.getOneOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOne({ _id: orderId });
    apiresponse.successResponsewithData(res, "data found", order);
    return;
  } catch (err) {
    apiresponse.serverError(res, ERROR.somethingWentWrong);
    return;
  }
};
