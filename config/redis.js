const redis = require("redis");

const redisClient = redis.createClient({
  // socket:{
  //   host: process.env.REDIS_HOST,
  //   port: process.env.REDIS_PORT
  // }
  url: process.env.REDIS_URL,
});

// redisClient.on("connect", () => console.log("✅  Redis connected"));

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
