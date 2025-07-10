const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken"); // we can genarete by using this token for knowing that it is user or not
const bcrypt = require("bcrypt");
const apirespone = require("../utility/apirespone");
// const client = require("../Middlewares/redis");
const {
  ERROR,
  USER,
  SUCCESS,
  OTP,
  AUTH,
  PRODUCT,
  CART,
  PAYMENT,
  ADDRESS,
} = require("../utility/messages");
const emailTemplate = require("../models/emailTemplate");
const {
  sendEmail,
  randomNumber,
  checkValidEmail,
} = require("../utility/function");
const Product = require("../models/productsSchema");
const Cart = require("../models/cartSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderSchema");
const Address = require("../models/addresSchema");
const { registerSchema } = require("../utility/validate");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// exports.userRegister = async (req, res) => {
//   try {
//     if (req.body.email) req.body.email = req.body.email.toLowerCase();
//     const { fullname, mobile, password, email, gender } = req.body;

//     // check Valid Email
//     const isValidEmail = checkValidEmail(email);

//     if (!isValidEmail) {
//       return apirespone.errorResponse(res, USER.validEmail);
//     }

//     const condition = {
//       status: { $ne: 2 },
//       email: {
//         $regex: new RegExp(
//           "^" + email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
//           "i"
//         ),
//       },
//     };

//     const isMatch = await User.findOne(condition);

//     if (isMatch) {
//       if (isMatch.otpVerified) {
//         return apirespone.errorResponse(res, USER.accountExist);
//       } else {
//         const genrateotp = Math.floor(
//           100000 + Math.random() * 900000
//         ).toString();
//         const otp = genrateotp.padStart(6, "0");
//         const otpExpirein = new Date() + 5 * 60 * 1000;

//         const template = await emailTemplate.findOne(
//           {
//             slug: process.env.USER_LOGIN_OTP,
//           },
//           { content: 1, subject: 1 }
//         );

//         await User.findByIdAndUpdate(
//           { _id: isMatch._id },
//           { otp: otp, otpExpires: otpExpirein }
//         );

//         let tempcontent = template.content.replace("{fullname}", fullname);
//         const message = tempcontent.replace("{otp}", otp);

//         sendEmail({
//           email: email,
//           subject: template.subject.toUpperCase(),
//           message: message,
//         });

//         apirespone.successResponsewithData(res, OTP.otpSent, {
//           email: isMatch.email,
//           mobile: isMatch.mobile,
//           fullName: isMatch.fullname,
//         });
//         return;
//       }
//     }

//     // Hash Format For secure Our password
//     const hashpassword = await bcrypt.hash(password, 10);
//     const obj = {
//       fullname: fullname,
//       email: email,
//       password: hashpassword,
//       mobile: mobile,
//       img:
//         gender === "male"
//           ? "https://avatar.iran.liara.run/public/boy"
//           : "https://avatar.iran.liara.run/public/girl",
//     };

//     // sending email on users email id

//     const otp = randomNumber();
//     const otpExpirein = new Date() + 5 * 60 * 1000;

//     const template = await emailTemplate.findOne(
//       {
//         slug: process.env.USER_LOGIN_OTP,
//       },
//       { content: 1, subject: 1 }
//     );

//     obj.otpExpires = otpExpirein;
//     obj.otp = otp;

//     const data = await User.create(obj);

//     let tempcontent = template.content.replace("{fullname}", fullname);
//     const message = tempcontent.replace("{otp}", otp);

//     sendEmail({
//       email: email,
//       subject: template.subject.toUpperCase(),
//       message: message,
//     });

//     apirespone.successResponsewithData(res, OTP.otpSent, {
//       email: data.email,
//       mobile: data.mobile,
//       fullName: data.fullname,
//     });
//   } catch (error) {
//     console.log(error);
//     return apirespone.serverError(res, ERROR.somethingWentWrong);
//   }
// };

exports.userRegister = async (req, res) => {
  try {
    // ✅ Step 1: Validate input using Joi
    const { error } = registerSchema.validate(req.body);
    if (error) {
      const errors = error.details.map((err) => err.message);
      return apirespone.errorResponse(res, errors);
    }

    // ✅ Step 2: Normalize email
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    const { fullname, mobile, password, email, gender } = req.body;

    // ✅ Step 3: Check if email is valid (custom logic)
    const isValidEmail = checkValidEmail(email);
    if (!isValidEmail) {
      return apirespone.errorResponse(res, USER.validEmail);
    }

    // ✅ Step 4: Check if user already exists
    const condition = {
      status: { $ne: 2 },
      email: {
        $regex: new RegExp(
          "^" + email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
          "i"
        ),
      },
    };

    const isMatch = await User.findOne(condition);

    if (isMatch) {
      if (isMatch.otpVerified) {
        return apirespone.errorResponse(res, USER.accountExist);
      } else {
        // random function genrate 6 digit a random number
        const genrateotp = randomNumber();
        const otpExpirein = new Date(Date.now() + 5 * 60 * 1000);

        const template = await emailTemplate.findOne(
          {
            slug: process.env.USER_LOGIN_OTP,
          },
          { content: 1, subject: 1 }
        );

        await User.findByIdAndUpdate(
          { _id: isMatch._id },
          { otp: otp, otpExpires: otpExpirein }
        );

        let tempcontent = template.content.replace("{fullname}", fullname);
        const message = tempcontent.replace("{otp}", otp);

        sendEmail({
          email: email,
          subject: template.subject.toUpperCase(),
          message: message,
        });

        return apirespone.successResponsewithData(res, OTP.otpSent, {
          email: isMatch.email,
          mobile: isMatch.mobile,
          fullName: isMatch.fullname,
        });
      }
    }

    // ✅ Step 5: Hash password and create user
    const hashpassword = await bcrypt.hash(password, 10);
    const obj = {
      fullname,
      email,
      password: hashpassword,
      mobile,
      img:
        gender === "male"
          ? "https://avatar.iran.liara.run/public/boy"
          : "https://avatar.iran.liara.run/public/girl",
    };

    const otp = randomNumber();
    const otpExpirein = new Date(Date.now() + 5 * 60 * 1000);

    const template = await emailTemplate.findOne(
      {
        slug: process.env.USER_LOGIN_OTP,
      },
      { content: 1, subject: 1 }
    );

    obj.otpExpires = otpExpirein;
    obj.otp = otp;

    const data = await User.create(obj);

    let tempcontent = template.content.replace("{fullname}", fullname);
    const message = tempcontent.replace("{otp}", otp);

    sendEmail({
      email,
      subject: template.subject.toUpperCase(),
      message,
    });

    return apirespone.successResponsewithData(res, OTP.otpSent, {
      email: data.email,
      mobile: data.mobile,
      fullName: data.fullname,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        success: false,
        message: `Mobile Number Already Exists`,
        error: error.keyValue,
      });
    }

    // Handle validation or other errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: error.errors,
      });
    }
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    if (req.body.email) req.body.email = req.body.email.toLowerCase();

    const { email, otp } = req.body;

    //  make a regex pattern to match email
    let regexPattern;
    if (email) {
      regexPattern = new RegExp(
        `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i"
      );
    }
    //  find here user with email

    const user = await User.findOne({ email: regexPattern });

    // check here otp not match

    if (user && user.otp !== otp) {
      return apirespone.errorResponse(res, OTP.invalidOtp);
    }

    // error for otp expire

    if (user && user.otpExpires > new Date()) {
      return apirespone.errorResponse(res, OTP.otpExpire);
    }
    //genrate a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_Secret_KEY);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { otpVerified: true, otp: null, otpExpires: null } }
    );

    const data = {
      token: token,
      email: user.email,
      fullname: user.fullname,
      mobile: user.mobile,
    };

    return apirespone.successResponsewithData(res, OTP.otpVerified, data);
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.resendOtp = async (req, res) => {
  try {
    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    const { email } = req.body;
    let regexPattern;
    if (email) {
      regexPattern = new RegExp(
        "^" + email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
        "i"
      );
    }
    //we find user
    const user = await User.findOne({ email: regexPattern });
    if (!user) {
      apirespone.errorResponse(res, USER.notFound);
    }

    const otp = randomNumber();

    const otpExpirein = new Date() + 5 * 60 * 1000;

    const template = await emailTemplate.findOne(
      {
        slug: process.env.USER_LOGIN_OTP,
      },
      { content: 1, subject: 1 }
    );

    let tempcontent = template.content.replace("{fullname}", user.fullname);
    const message = tempcontent.replace("{otp}", otp);

    sendEmail({
      email: email,
      subject: template.subject.toUpperCase(),
      message: message,
    });

    await User.updateOne(
      { _id: user._id },
      { otp: otp, otpExpires: otpExpirein }
    );

    apirespone.successResponse(res, OTP.otpSent);
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return apirespone.errorResponse(res, AUTH.notAuth);
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;
    //  find user base on login user
    const user = await User.findOne(
      { _id: req.user._id },
      { password: 1, _id: 1 }
    );
    if (!user) {
      apirespone.errorResponse(res, USER.notFound);
    }
    // let match password old and new
    if (newPassword !== confirmPassword) {
      return apirespone.errorResponse(res, USER.confirmPasswordnotMatch);
    }

    //  let's match old passowrd with db password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return apirespone.errorResponse(res, USER.oldPasswordnotMatch);
    }

    // let's hash confirm  Password
    const hashPassword = await bcrypt.hash(confirmPassword, 10);

    // update Password
    const updatePassword = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: hashPassword } }
    );
    return apirespone.successResponse(res, USER.passwordUpdated);
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return apirespone.errorResponse(res, USER.emailRequired);
    }
    let regexPattern;
    if (email) {
      regexPattern = new RegExp(
        `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i"
      );
    }

    //  find user exist or not
    const user = await User.findOne(
      { email: regexPattern },
      { _id: 1, email: 1, fullname: 1 }
    );
    if (!user) {
      apirespone.errorResponse(res, USER.registerMailId);
    }
    // user exist and let send a otp on thier mailid
    const otp = randomNumber();
    const otpExpire = new Date() + 5 * 60 * 1000;

    // find template for forgottPassword
    const template = await emailTemplate.findOne(
      {
        slug: process.env.USER_FORGOT_PASSWORD,
      },
      { content: 1, subject: 1 }
    );
    //  let's change the subject with otp and fullname and send email
    let nameChnage = template.content.replace("{fullname}", user.fullname);
    const message = nameChnage.replace("{otp}", otp);
    sendEmail({
      email: user.email,
      subject: template.subject,
      message: message,
    });
    //  update user
    await User.findByIdAndUpdate(
      { _id: user._id },
      { otp: otp, otpExpires: otpExpire }
    );

    apirespone.successResponse(res, OTP.otpSent);

    //
  } catch (error) {
    apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.userLogin = async (req, res) => {
  const { email = "", password = "" } = req.body;

  try {
    // Validate inputs
    if (!email.trim())
      return apirespone.errorResponse(res, "Please enter an email address");
    if (!password.trim())
      return apirespone.errorResponse(res, "Please enter a password");

    // Normalize and safely search user by email (case-insensitive)
    const sanitizedEmail = email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const findUser = await User.findOne({
      email: { $regex: new RegExp(`^${sanitizedEmail}$`, "i") },
    });

    if (!findUser) return apirespone.errorResponse(res, ERROR.usernotFound);

    // Check user status
    if (findUser.status === 2) {
      return apirespone.AuthError(
        res,
        "Your account is blocked. Please contact admin."
      );
    }

    if (findUser.status === 0) {
      return apirespone.AuthError(
        res,
        "Your account is inactive. Please try again later."
      );
    }

    // Check if role is allowed
    if (findUser.role !== "user") {
      return apirespone.errorResponse(res, USER.invalidCredential);
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      return apirespone.errorResponse(res, USER.passwordnotMatch);
    }

    // Generate JWT
    const token = jwt.sign({ id: findUser._id }, process.env.JWT_Secret_KEY, {
      expiresIn: "7d",
    });

    return apirespone.successResponsewithData(res, USER.loginSuccess, token);
  } catch (error) {
    console.error("Login Error:", error);
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return apirespone.AuthError(res, AUTH.notAuth);
    }
    const { id } = req.params;

    const data = await User.findOne(
      { _id: id },
      { password: 0, __v: 0, otp: 0, otpExpires: 0 }
    );
    apirespone.successResponsewithData(res, SUCCESS.dataFound, data);
  } catch (error) {
    apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};
//  Here we add to cart in user what he want to add his cart this can store in users database
exports.addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return apirespone.AuthError(res, AUTH.notAuth);
    }
    const { id: productId } = req.params;
    const { quantity: productQuantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) return apirespone.errorResponse(res, PRODUCT.productnotFound);

    const price =
      productQuantity === "full" ? product.fullprice : product.halfprice;

    // Find the user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        user: req.user._id,
        carts: [
          { prodId: productId, qty: 1, quantity: productQuantity, price },
        ],
        totalAmount: price,
      });
    } else {
      // Check if the product already exists with the same quantity type
      let existingCartItem = cart.carts.find(
        (item) =>
          item.prodId.toString() === productId &&
          item.quantity === productQuantity
      );

      if (existingCartItem) {
        existingCartItem.qty += 1;
      } else {
        cart.carts.push({
          prodId: productId,
          qty: 1,
          quantity: productQuantity,
          price,
        });
      }

      // Recalculate total amount
      cart.totalAmount = cart.carts.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
    }

    await cart.save();
    return apirespone.successResponse(res, CART.cartcreate);
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

//  If user Logout then he should his cards that's why we are runing it
exports.UserLogout = async (req, res) => {
  try {
    const userId = req.user._id;
    const findedUser = await User.findOne({ _id: userId });
    findedUser.carts = [];
    await findedUser.save();
    return apirespone.successResponse(res, CART.cartrermove);
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.usersCarts = async (req, res) => {
  const userId = req.user._id;
  try {
    if (!req.user) {
      return apirespone.AuthError(res, AUTH.notAuth);
    }
    const carts = await Cart.findOne({ user: userId }).populate(
      "carts.prodId",
      "name src"
    );

    return apirespone.successResponsewithData(
      res,
      SUCCESS.dataFound,
      carts == null ? [] : carts
    );
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

//  Handler decrease Cartvalue
exports.userDecreaseCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return apirespone.errorResponse(res, CART.cartnotFound);

    // Find the index of the product in the cart
    const productIndex = cart.carts.findIndex(
      (item) => item.prodId.toString() === productId
    );

    if (productIndex === -1)
      return apirespone.errorResponse(res, PRODUCT.productnotFound);

    if (cart.carts[productIndex].qty > 1) {
      // Decrease quantity
      cart.carts[productIndex].qty -= 1;
    } else {
      // Remove the product if qty is 1
      cart.carts.splice(productIndex, 1);
      if (cart.carts.length === 0) {
        await Cart.findByIdAndDelete({ _id: cart._id });
        return apirespone.successResponse(res, CART.cartrermove);
      }
    }
    // Recalculate total amount
    cart.totalAmount = cart.carts.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    await cart.save();
    return apirespone.successResponse(res, CART.cartrermove);
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

//  Here we increament users cartvalue
exports.userIncreamentCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return apirespone.errorResponse(res, CART.cartnotFound);

    // Find the index of the product in the cart
    const productIndex = cart.carts.findIndex(
      (item) => item.prodId.toString() === productId
    );

    if (productIndex === -1) {
      return apirespone.errorResponse(res, PRODUCT.productnotFound);
    }

    // Decrease quantity
    cart.carts[productIndex].qty += 1;

    // Recalculate total amount
    cart.totalAmount = cart.carts.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    await cart.save();
    return apirespone.successResponse(res, CART.cartcreate);
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { street, landmark, pno, apartment, city, state, postcode, country } =
      req.body;
  } catch (err) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

// exports.createOrder = async (req, res) => {
//   const {
//     ptotal,
//     gst,
//     finalAmount,
//     deliveryTip,
//     platformFees,
//     deliveryAddress,
//   } = req.body;

//   const user = req.user._id;

//   try {
//     const getcurrentUsersCarts = await Cart.findOne({ user: user });

//     if (getcurrentUsersCarts) {
//       const order = new Order({
//         user: user,
//         orderId: randomNumber(),
//         products: getcurrentUsersCarts?.carts,
//         totalAmount: finalAmount,
//         Gst: gst,
//         deliveryTip,
//         platformFees,
//         deliveryAddress: deliveryAddress,
//       });
//       await order.save();
//     }

//     const options = {
//       amount: finalAmount * 100, // convert to paise
//       currency: "INR",
//       receipt: `order_rcptid_${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);

//     return res.status(200).json({ success: true, order });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };

exports.createPaymentOrder = async (req, res) => {
  const { finalAmount } = req.body;

  const options = {
    amount: finalAmount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return apirespone.successResponsewithData(res, PAYMENT.done, {
      success: true,
      order,
    });
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.createDbOrder = async (req, res) => {
  const {
    finalAmount,
    gst,
    deliveryTip,
    platformFees,
    deliveryAddress,
    razorpay_order_id,
    razorpay_payment_id,
    paymentMethod,
  } = req.body;

  const user = req.user._id;

  try {
    const cartData = await Cart.findOne({ user });
    if (!cartData) return res.status(404).json({ message: CART.cartnotFound });

    const newOrder = new Order({
      user,
      orderId: `ORD-${Date.now()}`,
      products: cartData.carts,
      totalAmount: finalAmount,
      Gst: gst,
      deliveryTip,
      platformFees,
      deliveryAddress: deliveryAddress,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "PAID",
      paymentMethod: paymentMethod,
    });

    await newOrder.save();
    await Cart.deleteOne({ user });

    return apirespone.successResponsewithData(res, PAYMENT.done, {
      success: true,
      order: newOrder,
    });
  } catch (error) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      const paymentDetails = await razorpayInstance.payments.fetch(
        razorpay_payment_id
      );
      const paymentMethod = paymentDetails.method;

      res.status(200).json({
        success: true,
        verified: true,
        paymentMethod: paymentMethod,
        paymentDetails, // optional: send full details to frontend
      });
    } catch (err) {
      res
        .status(400)
        .json({ success: false, message: "Failed to fetch payment method" });
    }
  } else {
    res.status(400).json({ success: false, verified: false });
  }
};

exports.paymentWebHook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers["x-razorpay-signature"];

    // ✅ Make sure req.body is Buffer here
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body)) // this should be Buffer, not Object
      .digest("hex");

    if (generatedSignature === receivedSignature) {
      // ✅ Parse the body AFTER signature verification
      const payload = req.body;
      console.log("✅ Webhook verified:", payload);

      if (payload.event === "payment.captured") {
        console.log("🎉 Payment Captured:", payload.payload.payment.entity.id);
        // update your DB here
      }

      res.status(200).json({ status: "ok" });
    } else {
      console.log("❌ Webhook signature mismatch");
      res.status(400).send("Invalid signature");
    }
  } catch (err) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};

exports.AdduserAddress = async (req, res) => {
  try {
    if (!req.user) {
      return apirespone.AuthError(res, AUTH.notAuth);
    }
    const { fullname, phone, address, city, state, postalCode, country } =
      req.body;

    const saveAddress = await Address.create({
      user: req.user._id,
      name: fullname,
      street: address,
      city: city,
      state,
      postalCode,
      country,
      phone,
    });

    if (saveAddress) {
      return apirespone.successResponse(res, ADDRESS.addressadded);
    }
  } catch (err) {
    return apirespone.serverError(res, ERROR.somethingWentWrong);
  }
};
