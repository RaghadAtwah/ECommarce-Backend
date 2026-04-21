const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    roleType: { type: String, required: true, unique: true, default: "user" },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Role", roleSchema);
