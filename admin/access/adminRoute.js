const fxn = require("./adminController");

const router = require("express").Router();

router.post("/login", fxn.adminLogin);

router.post("/forgotPassword", fxn.forgotPassword);

router.post("/verifyOtp", fxn.VerifyOtp);

//  Here we Handle User

module.exports = router;
