// middleware/upload.js
const multer = require("multer");
const path = require("path");
const approot = require("app-root-path");

// store in /tmp or memory; local dir is okay if cleaned up after upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const pathname = path.join(approot.path, "/Public");
//     cb(null, pathname); // temporary folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, png, webp)"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
