
const { ApiError } = require("../helpers");

// Global error handler untuk menangani error yang terjadi di seluruh aplikasi
const errorHandler = (error, req, res, next) => {
  const code = Number(
    error.statusCode || error.status || (Number(error.code) ? error.code : 500)
  );
  const message = error.message || "Internal Server Error";
  const errors = error.errors || null;

  res.status(code).json({
    meta: {
      code,
      status: "ERROR",
      message,
    },
    error: errors,
  });
};

const noPageFound = (req, res, next) => {
  next(
    ApiError.notFound("Page not found!", [
      { path: req.originalUrl, info: "This route does not exist." },
    ])
  );
};

module.exports = { errorHandler, noPageFound };
