const mongoose = require("mongoose");

// models/Assessment.js
const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //  Organization_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Organization",
    //   required: true,
    // },
    video_url: {
      type: String,
      required: true,
    },
    health_score: {
      type: Number,
    },
    finance_score: {
      type: Number,
    },
    behavior_score: {
      type: Number,
    },

    risk_level: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
