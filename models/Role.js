const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["super_admin", "admin", "partner", "user"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", roleSchema);
