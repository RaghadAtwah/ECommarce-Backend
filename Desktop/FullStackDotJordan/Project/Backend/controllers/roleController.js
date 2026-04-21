const roleModel = require("../models/roleSchema");

// Get all Roles
const getAllRoles = async (req, res) => {
  try {
    const result = await roleModel.find({});

    if (result.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No Roles found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Roles",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Role/:id
const getRoleById = async (req, res) => {
  try {
    const result = await roleModel.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Role information",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new Role
const createRole = async (req, res) => {
  try {
    const { roleType, permissions } = req.body;

    if (!roleType) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    const newRole = new roleModel({
      roleType,
      permissions,
    });

    const result = await newRole.save();
    return res.status(201).json({
      success: true,
      message: "Role created successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CreatePermission
const createPermission = async (req, res) => {
  try {
    const id = req.params.id;
    const { permission } = req.body;

    if (!permission) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }
    const role = await roleModel.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (role.permissions.includes(permission)) {
      return res.status(400).json({
        success: false,
        message: "Permission already exists",
      });
    }

    role.permissions.push(permission);
    await role.save();

    return res.status(201).json({
      success: true,
      message: "Permission created successfully!",
      data: role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Role
const updateRoleById = async (req, res) => {
  try {
    const { roleType, permissions } = req.body;

    const updateData = {};

    if (roleType !== undefined) updateData.roleType = roleType;
    if (permissions !== undefined) updateData.permissions = permissions;

    const result = await roleModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  createPermission,
};
