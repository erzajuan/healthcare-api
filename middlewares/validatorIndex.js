const { validationResult } = require("express-validator");
const ApiError = require("../helpers/error");

module.exports = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // return responseHandler.errorResponse(res, errors.array()[0].msg);
      return next(
        ApiError.badRequest("Validation failed : " + errors.array()[0].msg)
      );
    } catch (error) {
      next(error);
    }
  };
};
