const { ERROR } = require("../utility/messages");
const Order = require("../models/orderSchema");
const { successResponsewithData } = require("../utility/apirespone");

exports.getAllorder = async (req, res) => {
  // startDate and Date are that data which is the user want filter that order according there dates
  if (!req.user) {
    return res.status(401).json({ message: "You are not Authenticate " });
  }

  let { status, startDate, endDate } = req.body;

  console.log(req.body);
  const matchQuery = {};

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
    successResponsewithData(res, "Data found", { orders, totalOrder });
    return;
  } catch (err) {
    return res.status(500).json({ message: ERROR.somethingWentWrong });
  }
};

exports.getOneOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOne({ _id: orderId });
    successResponsewithData(res, "data found", order);
    return;
  } catch (err) {
    return res.status(500).json({ message: ERROR.somethingWentWrong });
  }
};
