const multer = require("multer");
const path = require("path");
const approot = require("app-root-path");
const sharp = require("sharp");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// for normal multer here i can store my images on local only

// const storage = multer.diskStorage({
//   destination: async function (req, file, cb) {
//     let dir = path.join(approot + "/Public");
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + file.originalname;
//     cb(null, uniqueSuffix);
//   },
// });

// // Multer Filter
// const multerFilter = (req, file, cb) => {
//   req.error = null;
//   if (req.body.imagePath && req.body.imagePath == "user") {
//     if (
//       file.mimetype.split("/")[1] === "png" ||
//       file.mimetype.split("/")[1] === "jpg" ||
//       file.mimetype.split("/")[1] === "jpeg"
//     ) {
//       return cb(null, true);
//     } else {
//       req.error = "Only png, jpg, jpeg allowed.";
//       return cb(null, false);
//     }
//   }
// };
// 1;

// const upload = multer({
//   storage: storage,
//   fileFilter:multerFilter,
// });

//  i improve my project i save my all images on anny server or cloud here i use cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "productImages", // you can change folder name
    allowed_formats: ["jpg", "png", "webp"],
    transformation: [], // optional resize  { width: 800, height: 800, crop: "limit" }
  },
});

// const multerFilter = (req, file, cb) => {
//   req.error = null;
//   if (req.body.imagePath && req.body.imagePath == "user") {
//     if (
//       file.mimetype.split("/")[1] === "png" ||
//       file.mimetype.split("/")[1] === "jpg" ||
//       file.mimetype.split("/")[1] === "jpeg"
//     ) {
//       return cb(null, true);
//     } else {
//       req.error = "Only png, jpg, jpeg allowed.";
//       return cb(null, false);
//     }
//   }
// };

const upload = multer({ storage });

module.exports = { upload };
