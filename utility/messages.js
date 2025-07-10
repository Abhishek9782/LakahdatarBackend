const SUCCESS = {
  dataFound: "Data found succesfully.",
  dataupdated: "Data updated succesfully.",
  DataDeleted: "Data succesfully deleted. ",
};
const CART = {
  cartcreate: "Cart added succesfully.",
  cartrermove: "Cart remove successfully.",
  cartnotFound: "Cart not found.",
};

const AUTH = {
  notAuth: "You are not authenticate.",
};
const FOOD = {
  FoodtypeRequired: "Food type is required.",
  notavailable: "Currently not available.",
};
const OTP = {
  otpSent: "Otp sent on your email address .",
  invalidOtp: "Invalid otp.",
  otpExpire: "Otp expire. ",
  otpVerified: "Otp verfied successfully.",
};

const ERROR = {
  somethingWentWrong:
    "Oops something went wrong please try again after some time",
  usernotFound: "User not found.",
};
const USER = {
  notFound: "User not found.",
  notAdmin: "You are not admin.",
  passwordwrong: "Password wrong.",
  loginSuccess: "Login succesfully.",
  accountExist: "Account alreadt Exist Please Login.",
  validEmail: "Please enter a valid email address.",
  passwordnotMatch: "Password not match.",
  confirmPasswordnotMatch: "Confirm password not match.",
  oldPasswordnotMatch: "Old password not match.",
  passwordUpdated: "Password updated successfully.",
  emailRequired: "Email Must be Required.",
  registerMailId: "Please enter register email address.",
  invalidCredential: "Invalid credantial.",
  userStatusUpdated: "User updated successfully.",
};

const PRODUCT = {
  productadded: "Added succesfully.",
  productDelete: "Product delete succesfully.",
  productUpdated: "Product updated succesfully.",
  productnotFound: "Product not found.",
};

const ADMIN = {
  notAdmin: "You are not admin",
};

const EMAILTEMPLATE = {
  templateadd: "Template create succesfully.",
  TemplateDeleted: "Template deleted succesfully.",
  templateupdated: "Template update succesfully.",
  alreadyExist: "Template already exist.",
};

const CATEGORY = {
  categoryNameRequired: "Category name must be required",
  categoryDescriptionRequired: "Category description must be required",
  categoryCreated: "Category created succesfully.",
  categoryUpdated: "Category updated succesfully.",
  categoryDeleted: "Category delete succesfully.",
  categoryActive: "Category active succesfully.",
  categoryInactive: "Category inactive succesfully.",
  categorynotFound: "Category not found .",
};

const PAYMENT = {
  done: "Payment success",
};
const ADDRESS = {
  addressadded: "Address added successfully.",
};

module.exports = {
  SUCCESS,
  ERROR,
  CART,
  USER,
  PRODUCT,
  ADMIN,
  EMAILTEMPLATE,
  CATEGORY,
  AUTH,
  FOOD,
  OTP,
  PAYMENT,
  ADDRESS,
};
