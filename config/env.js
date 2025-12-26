const path = require("path");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";

dotenv.config({
  path:
    env === "test"
      ? path.resolve(process.cwd(), ".env.test")
      : path.resolve(process.cwd(), ".env"),
});

console.log(`🌱 ENV loaded: ${env}`);
