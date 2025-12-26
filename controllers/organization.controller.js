const { response, ApiError } = require("../helpers");

const {
  createOrganization,
} = require("../services/organization/organization.service");

class ogranizationController {
  static async createOrganization(req, res, next) {
    try {
      const { name, code } = req.body;

      const result = await createOrganization(name, code, req.user.id);

      if (!result.success) {
        return next(ApiError.badRequest(result.message));
      }

      return response.CREATED(res, "Organization created successfully", result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ogranizationController;
