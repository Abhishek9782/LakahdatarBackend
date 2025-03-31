const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

// for admin
const auth = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decode = await jwt.verify(token, process.env.ADMIN_JWT_SECRET_KEY);
      const user = await User.findOne(
        { _id: decode._id },
        { fullname: 1, email: 1, role: 1 }
      );

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not a Valid Token" });
    }
  } else {
    res.status(401).json({ message: "Please Provode a token " });
  }
};

// for user
const userAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decode = await jwt.verify(token, process.env.JWT_Secret_KEY);
      const user = await User.findOne(
        { _id: decode.id },
        { fullname: 1, email: 1, role: 1 }
      );

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not a Valid Token" });
    }
  } else {
    res.status(401).json({ message: "Please Provode a token " });
  }
};

module.exports = { auth, userAuth };
