const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const { AuthError } = require("../utility/apirespone");
// const client = require("./redis");

// for admin
// const auth = async (req, res, next) => {
//   if (req.headers.authorization) {
//     try {
//       let token = req.headers.authorization.split(" ")[1];
//       const decode = await jwt.verify(token, process.env.ADMIN_JWT_SECRET_KEY);
//       const isBlacklisted = await client.get(`bl_${token}`);
//       if (isBlacklisted) {
//         return res
//           .status(401)
//           .json({ message: "Session Expire Please Login Again." });
//       }
//       const user = await User.findOne(
//         { _id: decode._id },
//         { fullname: 1, email: 1, role: 1 }
//       );

//       req.user = user;
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not a Valid Token" });
//     }
//   } else {
//     res.status(401).json({ message: "Please Provode a token " });
//   }
// };

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies.token;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token is missing or malformed" });
    }
    const token = authHeader.split(" ")[1];

    // Check Redis blacklist
    // const isBlacklisted = await client.get(`bl_${token}`);
    // if (isBlacklisted) {
    //   return res
    //     .status(401)
    //     .json({ message: "Session expired. Please login again." });
    // }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET_KEY);

    const user = await User.findById(decoded._id).select("fullname email role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// for user
const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies.token;
  try {
    if (!authHeader) {
      AuthError(res, "Token is Required");
    }

    let token = authHeader.split(" ")[1];
    const decode = await jwt.verify(token, process.env.JWT_Secret_KEY);
    const user = await User.findOne(
      { _id: decode.id },
      { fullname: 1, email: 1, role: 1, status: 1 }
    );

    if (user && user.status == 0) {
      res.status(401).json({ message: "Your Account is Inactive by Admin..." });
    }
    if (user && user.status == 2) {
      res.status(401).json({ message: "Your Account is Blocked By User " });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not a Valid Token" });
  }
};

const vendorAuth = async (req, res, next) => {
  const authHeader =
    req.headers.authorization?.split(" ")[1] || req.cookies.vendorToken;

  try {
    const token = authHeader;

    if (!token) {
      return AuthError(res, "Token is Required");
    }

    let decoded = jwt.verify(token, process.env.VENDOR_JWT_SECRET_KEY);

    const vendor = await User.findOne(
      { _id: decoded._id, role: "vendor" },
      { fullname: 1, email: 1, role: 1 }
    );

    if (!vendor) {
      return AuthError(res, "Unauthorized access");
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid or expired token" });
  }
};
module.exports = { auth, userAuth, vendorAuth };
