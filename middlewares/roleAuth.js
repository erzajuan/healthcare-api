const ApiError = require("../helpers/error");

const hasRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      const found = roles.some((el) => el === req.user.role);
      if (found) return next();

      if (!req.user || !req.user.role) {
        next(ApiError.unauthorized("Invalid token payload"));
      }

      next(ApiError.forbidden("Forbidden access"));
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  hasRole,
};
