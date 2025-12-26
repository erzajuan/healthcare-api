const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redisClient = require("../config/redis");

// 👉 Jika test environment, export dummy middleware
if (process.env.NODE_ENV === "test") {
  module.exports = (req, res, next) => next();
} else {
  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 5 requests per windowMs

    handler: (req, res, next) => {
      return next(
        ApiError.tooManyRequest(
          "Too many login attempts, please try again later."
        )
      );
    },

    standardHeaders: true, // Sertakan info Rate Limit di Header (Sangat disarankan untuk API)
    legacyHeaders: false,
  });

  module.exports = limiter;
}
