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
  required: "Food type is required.",
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
  updateError: "update has error. try after some time ",
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
  categoryDescriptionRequired: "Category must be required",
  categoryCreated: "Category created succesfully.",
  categoryUpdated: "Category updated succesfully.",
  categoryDeleted: "Category delete succesfully.",
  categoryActive: "Category active succesfully.",
  categoryInactive: "Category inactive succesfully.",
  categorynotFound: "Category not found .",
  categoryImageRequired: "Category image required.",
};

const PAYMENT = {
  done: "Payment success",
};
const ADDRESS = {
  addressadded: "Address added successfully.",
};

const VENDOR = {
  restaurantCreated: "Restaurant created successfully.",
  restaurantUpdated: "Restaurant updated successfully.",
  restaurantDeleted: "Restaurant deleted successfully.",
  emailAlreadyExist: "Email already exists.",
  mobileExists: "Phone number already exists.",
  restaurantNotFound: "Restaurant not found.",
  vendorNotFound: "Vendor not found.",
  otpsent: "OTP sent to your registered mobile number.",
  otpExpired: "OTP has expired. Please request a new one.",
  otpnotMatched: "Invalid Otp.",
  otpVerified: "OTP verified successfully.",
  invalidCredential: "Invalid credantial.",
  unauthorizedAccess: "Unauthorized access.",
  profileFetched: "Profile fetched successfully.",
  adminHaveAccess: "You are not admin.",
  profileupdated: "Profile updated successfully.",
  statusUpdate: "Vendor status updated successfully.",
  imageRequired: "Product image required.",
  foodFetched: "Food fetched successfully.",
  foodUpdated: "Food updated successfully.",
  foodDeleted: "Food deleted successfully.",
  foodNotFound: "Food not found.",
  foodImageRequired: "Food image required.",
  foodTypeRequired: "Food type required.",
  foodPriceRequired: "Food price required.",
  foodStatusRequired: "Food status required.",
  foodCreated: "Food created successfully.",
  foodTypeUpdated: "Food type updated successfully.",
  foodTypeDeleted: "Food type deleted successfully.",
  foodTypeNotFound: "Food type not found.",
  foodActive: "Food type active successfully.",
  foodInactive: "Food type inactive successfully.",
  orderFetched: "Order fetched successfully.",
  orderStatusRequired: "Order status required.",
  orderStatusUpdated: "Order status updated successfully.",
  orderCreated: "Order created successfully.",
  orderDeleted: "Order deleted successfully.",
  orderNotFound: "Order not found.",
  orderCompleted: "Order completed successfully.",
  review: "Review get successfully.",
  reviewDisable: "Review hidden successfully.",
  reviewShow: "Review appear successfully.",
  approvalRequired: "Approval field required",
  reviewIdRequired: "Review id required.",
  emailPasswordrequired: "Email id and Password Required.",
  productAdded: "Product added successfully.",
};

const REVIEW = {
  reviewFound: "Review found successfully.",
  reviewnotFound: "Review not found.",
  reviewupdated: "Review updated successfully.",
};

const DB = {
  validationError: "Required field missing.", //field is missing get that field and send the name,400
  CastError: "Invalid Object Id format.", // when objectId is not valid ,400
  dupicateKeyError: "Field is already exists", // when duplicate key exists in db then send the error , 409
  DocumentNotFoundError: "Document not found.", // findById() found nothing then send the error ,404. doc not found
  MongoServerError: "oops something wet wrong try after some time .", // 500 , genric error
  networkError: "Service unavailable.", // network error 503 service unavailable
  VersionError: "Version error.",
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
  VENDOR,
  FOOD,
  OTP,
  PAYMENT,
  ADDRESS,
  DB,
  REVIEW,
};
