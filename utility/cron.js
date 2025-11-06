const cron = require("node-cron");
const orderSchema = require("../models/orderSchema");

const autoCancelledOrder = async () => {
  cron.schedule("0 * * * * ", async () => {
    const tweleveHourago = new Date(Date.now() - 12 * 60 * 60 * 1000);
    try {
      await orderSchema.updateMany(
        {
          status: "pending",
          paymentStatus: "UNPAID" || "pending",
          createdAt: { $lte: tweleveHourago },
        },
        {
          $set: { status: "cancelled" },
        }
      );
      console.log("some order cancelled ");
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = { autoCancelledOrder };
