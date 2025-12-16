const route = require("express").Router();

route.get("/", (req, res) => {
  res.send("Welcome to the Healthcare API");
});

const authRoute = require("./auth.routes");

route.use("/auth", authRoute);

module.exports = route;
