const Joi = require("joi");

const registerSchema = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(20)
    .required()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.base": "Fullname must be a string.",
      "string.empty": "Please enter the fullname.",
      "string.min": "Fullname length should be more than 3 letters.",
      "string.max": "Fullname is too long.",
      "any.required": "Fullname is required.",
      "string.pattern.base": "Special character not allowed.",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email cannot be empty",
    "any.required": "Please enter an email",
  }),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
      "string.empty": "Mobile number is required",
      "any.required": "Please enter a mobile number.",
    }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:\";'<>?,./]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base": "Weak password. Use A-Z, a-z, 0-9, and a symbol.",
      "string.empty": "Please enter a password.",
      "any.required": "Password is required.",
    }),
  gender: Joi.string().required().messages({
    "any.required": "Gender Must be required",
    "string.base": "Gender must be string only",
  }),
});

const loginValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please Enter a valid email.",
    "string.empty": "Email can not be Empty.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().min(5).messages({
    "string.empty": "Password can not Be empty.",
    "string.min": "Password Length at least 5 Digit. ",
    "any.required": "Password must be Required.",
  }),
});

// vendor Register Validation Schema
const vendorRegisterSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Please enter the name",
      "string.min": "Name length should be more than 3 letters",
      "string.pattern.base": "Special character not allowed",
      "string.max": "Name is too long",
    }),
  gender: Joi.string().required().messages({
    "any.required": "Gender Must be required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email cannot be empty",
  }),
  mobile: Joi.string().length(10).required().messages({
    "string.length": "Mobile number must be 10 digits",
    "string.empty": "Mobile number is required",
  }),
  password: Joi.string().min(5).required().messages({
    "string.empty": "Please enter a password.",
    "string.min": "Password Length at least 5 Digit. ",
  }),
  restaurant: {
    name: Joi.string().min(3).max(50).required().messages({
      "string.base": "Restaurant name must be a string",
      "string.empty": "Please enter the restaurant name",
    }),
    description: Joi.string().max(500).allow("").messages({
      "string.base": "Description must be a string",
      "string.max": "Description is too long",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Please Enter a Valid Restaurant Email",
    }),
    address: Joi.string().required().messages({
      "string.base": "Address Must be a string ",
      "string.empty": "Please enter the restaurant address",
    }),
    phone: Joi.string().length(10).required().messages({
      "string.length": "Phone number must be 10 digits",
      "string.empty": "Please enter the restaurant phone number",
    }),
  },
});

const vendorupdateProfile = Joi.object({
  fullName: Joi.string().min(3).max(30).messages({
    "string.base": "Name must be a string",
    "string.empty": "Please enter the Full Name",
    "string.min": "Name length should be more than 3 letters",
    "string.max": "Name is too long",
  }),
  email: Joi.string().email().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email cannot be empty",
  }),

  img: Joi.string().uri().messages({
    "string.uri": "Image must be a valid URL",
    "string.empty": "Image URL cannot be empty",
  }),

  mobile: Joi.string().length(10).messages({
    "string.length": "Mobile number must be 10 digits",
    "string.empty": "Mobile number is required",
  }),
  gender: Joi.string().messages({
    "string.base": "Gender must be a string",
    "string.empty": "Gender cannot be empty",
  }),
});

const vendorFoodSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Food name must be a string",
    "string.empty": "Please enter the food name",
    "string.min": "Food name length should be more than 3 letters",
    "string.max": "Food name is too long",
  }),

  desc: Joi.string().max(500).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.max": "Description is too long",
  }),
  halfprice: Joi.number().min(1).required().messages({
    "string.base": "Half Price must be a number",
    "string.empty": "Half Price cannot be empty",
    "string.min": "Half Price must be more than 0",
  }),
  fullprice: Joi.number().min(1).required().messages({
    "string.base": "Full price must be a number ",
    "string.empty": "Full price cannot be empty",
    "string.min": "Full price must be more than 0",
  }),

  tags: Joi.array().items(Joi.string()).min(1).max(5).required().messages({
    "array.base": "Tags must be an array",
    "array.empty": "Please enter at least one tag",
    "array.min": "Tags should contain at least 1 tag",
    "array.max": "Tags should not exceed 5 tags",
    "string.base": "Tag must be a string",
    "string.empty": "Tag cannot be empty",
  }),
});
module.exports = {
  registerSchema,
  loginValidate,
  vendorRegisterSchema,
  vendorupdateProfile,
  vendorFoodSchema,
};
