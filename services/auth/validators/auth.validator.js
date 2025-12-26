const { check } = require("express-validator");

const registerValidate = [
  check("name").notEmpty().withMessage("Name is required"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "user"])
    .withMessage("Role must be either 'admin' or 'user'"),
];

module.exports = { registerValidate };
