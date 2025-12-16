const { response, ApiError } = require("../helpers");

const { registerUser, loginUser } = require("../services/auth/auth.service");

class authController {
  static async registerUser(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const result = await registerUser(name, email, password);

      if (!result.success) {
        return next(ApiError.badRequest(result.message));
      }

      return response.CREATED(res, "User registered successfully", result);
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await loginUser(email, password);

      if (!result.success) {
        if (result.type === "UNAUTHORIZED") {
          return next(ApiError.unauthorized(result.message));
        }
        return next(ApiError.badRequest(result.message));
      }

      return response.SUCCESS(res, "User logged in successfully", result.data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = authController;
