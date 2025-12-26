const jwt = require("jsonwebtoken");
const ApiError = require("../helpers/error");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return next(ApiError.unauthorized("No token provided"));
    }

    const splitToken = authHeader.split(" ");
    if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
      return next(ApiError.forbidden("Invalid token format"));
    }

    const token = splitToken[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        algorithms: ["HS256"],
      });
      req.user = payload;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(
          ApiError.unauthorized(
            "Your session has expired. Please log in again",
            err.message
          )
        );
      }
      return next(
        ApiError.unauthorized(
          "Access is denied due to invalid credentials",
          err.message
        )
      );
    }
  } catch (error) {
    return next(error);
  }
};
