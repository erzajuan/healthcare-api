class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message = "Bad Request", errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized", errors = null) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden", errors = null) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Not Found", errors = null) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = "Conflict", errors = null) {
    return new ApiError(409, message, errors);
  }

  static internal(message = "Internal Server Error", errors = null) {
    return new ApiError(500, message, errors);
  }
}

module.exports = ApiError;
