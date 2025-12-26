const redis = require("redis");

let redisClient = null;

if (process.env.NODE_ENV !== "test" && process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("connect", () => console.log("✅ Redis connected"));

  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  (async () => {
    await redisClient.connect();
  })();
}

module.exports = redisClient;
