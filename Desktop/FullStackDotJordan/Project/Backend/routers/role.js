const express = require("express");
const roleRouter = express.Router();

const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  createPermission,
} = require("../controllers/roleController");
const authorize = require("../middleware/Authorization");
const auth = require("../middleware/Authentication");

// Get all Roles
roleRouter.get("/", auth, authorize("getAllRoles"), getAllRoles);
// Get Role/:id
roleRouter.get("/:id", auth, authorize("getRoleById"), getRoleById);

// Create new Role
roleRouter.post("/", auth, authorize("createRole"), createRole);

// Create Permission/:id
roleRouter.post(
  "/permission/:id",
  auth,
  authorize("createPermission"),
  createPermission,
);

// Update Role
roleRouter.put("/:id", auth, authorize("updateRole"), updateRoleById);

module.exports = roleRouter;
