const Joi = require("joi");

const registerSchema = Joi.object({
  fullname: Joi.string().min(3).max(20).required().messages({
    "string.base": "Fullname must be a string",
    "string.empty": "Please enter the fullname",
    "string.min": "Fullname length should be more than 3 letters",
    "string.max": "Fullname is too long",
    "any.required": "Fullname is required",
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
});

module.exports = {
  registerSchema,
};
