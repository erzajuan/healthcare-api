const authRoute = require("express").Router();
const { authController } = require("../controllers");
const validate = require("../middlewares/validatorIndex");
const isAuthencated = require("../middlewares/authentication");
const { hasRole } = require("../middlewares/roleAuth");
const {
  registerValidate,
} = require("../services/auth/validators/auth.validator");
const limit = require("../middlewares/rateLimit");

// Login User
authRoute.post("/login", limit, authController.loginUser);

authRoute.post("/refresh-token", authController.refreshToken);

authRoute.use(isAuthencated);

// Register User
authRoute.post(
  "/register",
  hasRole(["admin"]),
  validate(registerValidate),
  authController.registerUser
);

// Logout User
authRoute.post("/logout", authController.logout);

module.exports = authRoute;
