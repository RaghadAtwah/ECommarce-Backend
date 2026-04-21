const express = require("express");
const jwt = require("jsonwebtoken");
const categoryRouter = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const auth = require("../middleware/Authentication");
const authorize = require("../middleware/Authorization");

// Get all Categories
categoryRouter.get("/", getAllCategories);

// Get Category/:id
categoryRouter.get("/:id", getCategoryById);

// Create Category
categoryRouter.post("/", auth, authorize("createCategory"), createCategory);

// Update Category/:id
categoryRouter.put("/:id", auth, authorize("updateCategory"), updateCategory);

// Delete Category/:id
categoryRouter.delete(
  "/:id",
  auth,
  authorize("deleteCategory"),
  deleteCategory,
);

module.exports = categoryRouter;
