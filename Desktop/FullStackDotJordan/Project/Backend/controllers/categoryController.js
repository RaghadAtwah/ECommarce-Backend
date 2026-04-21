const categoryModel = require("../models/categorySchema");

// Get all Categories
const getAllCategories = async (req, res) => {
  try {
    const result = await categoryModel.find({});

    if (result.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No Category found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Categories",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Category/:id
const getCategoryById = async (req, res) => {
  try {
    const result = await categoryModel.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category information",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new Category
const createCategory = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    const newCategory = new categoryModel({
      title,
      description,
      imageUrl,
    });

    const result = await newCategory.save();
    return res.status(201).json({
      success: true,
      message: "Category created successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Category/:id
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { title, description, imageUrl } = req.body;
    const { role } = req.user;

    const isAdmin = role === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await categoryModel.findByIdAndUpdate(
      categoryId,
      { title, description, imageUrl },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Category/:id
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await categoryModel.findByIdAndDelete(categoryId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
