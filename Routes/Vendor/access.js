const route = require("express").Router();
const Controller = require("../../Controller/Vendor/access.controller");
const { vendorAuth } = require("../../Middlewares/middlewares");
const { upload } = require("../../Middlewares/multer");

// Vendor Auth and manage
route.post("/register", Controller.register);

route.post("/otp-verified", Controller.otpVerified);

route.post("/resend-otp", Controller.resendOtp);

route.post("/login", Controller.login);

route.get("/profile", vendorAuth, Controller.getProfle);

route.put("/update-profile/:id", vendorAuth, Controller.updateProfile);

route.put("/update-status", vendorAuth, Controller.updateStatus);

route.get("/delete-profile/:id", Controller.deleteVendor);

// Food Management

route.post(
  "/food-create",
  vendorAuth,
  upload.single("src"),
  Controller.addFood
); //  New Food

route.post("/food", vendorAuth, Controller.getAllFoods); //getAllFoods

route.post("/food-update", vendorAuth, Controller.foodUpdate); //update food

route.put("/food-delete/:id", vendorAuth, Controller.foodDelete); // delete food permanently

route.post("/food-status-update", vendorAuth, Controller.foodStatusUpdate); // food status change using this api i can active or inactive or delete food

// Restaurant Management
// restaurant update

// Order Management
route.post("/orders", vendorAuth, Controller.getAllOrders); // get all orders

route.get("/order/:id", vendorAuth, Controller.getOrder); //get single order

route.post("/update-order-status", vendorAuth, Controller.updateOrderStatus); // order status change like pending → confirmed → preparing → delivered

route.post("/orders/:filter", vendorAuth, Controller.filteredOrder); // filtered order like all - preparing,  confirmed, delivered

// review management
route.get("/reviews", vendorAuth, Controller.getAllReviews); //getting allreviews

route.get("/review/:prodId", vendorAuth, Controller.getSingleProductReview); // this route should be only for user i made it for vendor which is wrong

route.post(
  "/review-approval-change/",
  vendorAuth,
  Controller.reviewApprovedChange
);

// dashboard vendor

route.get("/dashboard", Controller.register); // Returns totalOrders, totalEarnings, todayOrders, pendingOrders, averageRating

route.get("/sales-report", Controller.register); //Returns sales chart data

route.get("/sales-report", Controller.register); //Shows top 5 selling items

route.get("/sales-report", Controller.register); //Return daily/weekly/monthly revenue trend

// Payment and Earnings -For financial transparency and payout tracking.

// show all the completed orders with earnings
route.get("/my-earnings", vendorAuth, Controller.GetAllEarnings); // for total earnings with total orders
// total earnings, pending ,payouts, etc
route.get("/total-pending", vendorAuth, Controller.getTotalPendingOrder);
//detailed payment info for order

// if manual payout is required

// Notification/Real Time -socket io integration

//fetch recent order / review updates
//mark notification as read or remove

module.exports = route;
