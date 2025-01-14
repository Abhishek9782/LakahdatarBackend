const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("abhi")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_Secret_KEY);
      req.user = decode.id;
      next();
    } catch (error) {
      res.status(401).josn({ message: "NOt Authorized " });
    }
  } else {
    res.status(401).json({ message: "not a valid token or expire " });
  }
};
