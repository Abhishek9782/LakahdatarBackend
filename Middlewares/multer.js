const multer = require("multer");
const path = require("path");
const approot = require("app-root-path");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let dir = path.join(approot + "/Public");
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  req.error = null;
  if (req.body.imagePath && req.body.imagePath == "user") {
    if (
      file.mimetype.split("/")[1] === "png" ||
      file.mimetype.split("/")[1] === "jpg" ||
      file.mimetype.split("/")[1] === "jpeg"
    ) {
      return cb(null, true);
    } else {
      req.error = "Only png, jpg, jpeg allowed.";
      return cb(null, false);
    }
  }
};
1;

const upload = multer({
  storage: storage,
  multerFilter,
});

module.exports = { upload };
