const authRoute = require("express").Router();
const { authController } = require("../controllers");
const validate = require("../middlewares/validatorIndex");
const {
  registerValidate,
} = require("../services/auth/validators/auth.validator");

// Register User
authRoute.post(
  "/register",
  validate(registerValidate),
  authController.registerUser
);

// Login User
authRoute.post("/login", authController.loginUser);

module.exports = authRoute;
