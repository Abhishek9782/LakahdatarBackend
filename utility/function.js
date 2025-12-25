const fs = require("fs/promises"); // important!
const nodemailer = require("nodemailer");
const { rateLimit } = require("express-rate-limit");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const { errorResponse } = require("./apirespone");
const sanitizeHtml = require("sanitize-html");

//  6 digit otp genrate
const randomNumber = function randomNumber() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return Number.parseInt(otp.padStart(6, "0"));
};

const sendEmail = async (options) => {
  return new Promise((resolve, reject) => {
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send mail
    const message = {
      from: `Lakhdatar <${process.env.EMAIL}>`,
      to: options.email, // email is hete user email
      subject: options.subject, // subject is template
      html: options.message, // message is content
    };
    mailTransporter
      .sendMail(message)
      .then(() => {
        console.log("Email sent");
        resolve(1);
      })
      .catch((error) => {
        console.log("error", error);
        resolve(0);
      });
  });
};

const removeSpecialchar = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const checkValidEmail = (email) => {
  let pattern =
    /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return pattern.test(email);
};

const calculateCartSummary = (cartItems) => {
  const subtotal = cartItems.carts.reduce((acc, item) => {
    const itemPrice = item.price * item.qty;
    return acc + itemPrice;
  }, 0);

  const deliveryFees = subtotal > 500 ? 0 : 50;
  const platformFees = Math.round(subtotal * 0.05); // 5%
  const gst = Math.round(subtotal * 0.1); // 10%
  const discount = 0; // You can update this logic

  const finalAmount = subtotal + deliveryFees + platformFees + gst - discount;

  return {
    subtotal,
    deliveryFees,
    platformFees,
    gst,
    discount,
    finalAmount,
  };
};

// login Limitior only 5 times

const loginLimitior = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    return res.status(429).json({ message: "Too Many Login Attempts" });
  },
});

const enhanceanduploadCloudImage = async (filePath) => {
  try {
    const resizedImage = await sharp(filePath)
      .resize(800)
      .webp({ quality: 60 })
      .toBuffer();

    const base64EncodedImage = `data:image/webp;base64,${resizedImage.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64EncodedImage, {
      folder: "productImages",
    });

    sharp.cache(false); //close the cache to free up memory
    return result.secure_url;
  } catch (error) {
    console.error("Error in image uploader function:", error);
    throw error;
  }
};

const deleteLocalImage = async (path) => {
  try {
    await fs.unlink(path);
    console.log("✅ File deleted from local storage");
  } catch (err) {
    console.error("❌ Error deleting local file:", err);
  }
};

const sanitizeFields = (req, res, next) => {
  if (!req.body) return next();

  const clean = (value) => {
    if (typeof value === "string") {
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
        textFilter: (text) => text.trim(),
      });
    }
    if (typeof value === "object" && value !== null) {
      for (const key in value) {
        value[key] = clean(value[key]);
      }
    }
    return value;
  };

  req.body = clean(req.body);
  next();
};

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // remove accents (café → cafe)
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // remove leading/trailing hyphens
    .replace(/--+/g, "-"); // collapse multiple hyphens
}

module.exports = {
  randomNumber,
  sendEmail,
  removeSpecialchar,
  checkValidEmail,
  calculateCartSummary,
  loginLimitior,
  enhanceanduploadCloudImage,
  deleteLocalImage,
  sanitizeFields,
  generateSlug,
};
