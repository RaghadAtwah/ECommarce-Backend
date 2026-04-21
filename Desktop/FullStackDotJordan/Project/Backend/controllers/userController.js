const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");
const roleModel = require("../models/roleSchema");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await userModel.find({}).populate("role");

    if (result.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No Users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Users",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User/:id
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    const { id, role } = req.user;

    const isAdmin = role === "admin";
    const isOwner = id === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await userModel.findById(userId).populate("role");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User information",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new User
const createUser = async (req, res) => {
  try {
    let { name, email, password ,phoneNumber,address} = req.body;

    email = email.trim().toLowerCase();

    const existingEmail = await userModel.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    if (!name || !email || !password || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing Data",
      });
    }

    const userRole = await roleModel.findOne({ roleType: "user" });

    const newUser = new userModel({
      name,
      email,
      password,
      address,
      phoneNumber,
      role: userRole._id,
    });

    const result = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User/:id
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, phoneNumber, address } = req.body;
    const { id, role } = req.user;

    const isAdmin = role === "admin";
    const isOwner = id === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updateData = { name, email ,phoneNumber, address };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const result = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// logIn
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel
      .findOne({ email: email.toLowerCase() })
      .populate("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //! Create Token
    const token = jwt.sign(
      {
        // Headers

        // userData
        id: user._id,
        role: user.role.roleType,
        permissions: user.role.permissions,
      },
      //   SECRET KEY
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
    );
    console.log(token);

    return res.status(200).json({
      success: true,
      message: "logIn Successfully!",
      token,
      userId: user._id,
      role: user.role.roleType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete User/:id
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  logIn,
  updateUser,
  deleteUser,
};
