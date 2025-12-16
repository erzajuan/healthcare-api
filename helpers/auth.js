const jwt = require("jsonwebtoken");
const token = process.env.JWT_SECRET;
const token_refresh = process.env.JWT_REFRESH_SECRET;
const expire_time = process.env.JWT_EXPIRE_TIME || "1h";
const expire_time_refresh = process.env.JWT_REFRESH_EXPIRE_TIME || "1d";

const generateToken = (data) => {
  const access_token = jwt.sign({ data }, token, {
    algorithm: "HS256",
    expiresIn: expire_time,
  });

  return `Bearer ${access_token}`;
};

const generateRefreshToken = (id) => {
  const refresh_token = jwt.sign({ id, type: "refresh" }, token_refresh, {
    algorithm: "HS256",
    expiresIn: expire_time_refresh,
  });

  return refresh_token;
};

module.exports = { generateToken, generateRefreshToken };
