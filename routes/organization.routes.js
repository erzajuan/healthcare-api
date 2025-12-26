const organizationRoute = require("express").Router();
const { organizationController } = require("../controllers");

const validate = require("../middlewares/validatorIndex");
const isAuthencated = require("../middlewares/authentication");
const { hasRole } = require("../middlewares/roleAuth");

organizationRoute.use(isAuthencated);

// Create Organization
organizationRoute.post(
  "/",
  hasRole(["admin"]),
  organizationController.createOrganization
);

module.exports = organizationRoute;
