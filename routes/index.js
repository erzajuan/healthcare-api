const route = require("express").Router();

route.get("/", (req, res) => {
  res.send("Welcome to the Healthcare API");
});

const authRoute = require("./auth.routes");
const organizationRoute = require("./organization.routes");

route.use("/auth", authRoute);
route.use("/organizations", organizationRoute);

module.exports = route;
