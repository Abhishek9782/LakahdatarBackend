const nodemailer = require("nodemailer");

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

module.exports = {
  randomNumber,
  sendEmail,
  removeSpecialchar,
  checkValidEmail,
  calculateCartSummary,
};
