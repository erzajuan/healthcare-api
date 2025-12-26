const { Organization } = require("../../models");

const createOrganization = async (name, code, user) => {
  try {
    const checkOrganization = await Organization.findOne({
      code: code.toLowerCase(),
    });

    if (checkOrganization) {
      return { success: false, message: "Organization code already exists" };
    }

    const newOrganization = await Organization({
      name,
      code: code.toLowerCase(),
      created_by: user,
    });

    await newOrganization.save();

    return { success: true, data: newOrganization };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  createOrganization,
};
