const mongoose = require("mongoose");

const organizationMemberSchema = new mongoose.Schema(
  {
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "invited", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

organizationMemberSchema.index(
  { organization_id: 1, user_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("OrganizationMember", organizationMemberSchema);
