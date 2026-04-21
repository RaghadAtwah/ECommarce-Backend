const express = require("express");
const jwt = require("jsonwebtoken");
const productRouter = express.Router();

const {
  getFilterProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const auth = require("../middleware/Authentication");
const authorize = require("../middleware/Authorization");

// Get all Products
productRouter.get("/", getFilterProducts);

// Get Product/:id
productRouter.get("/:id", getProductById);

// Create Product
productRouter.post("/", auth, authorize("createProduct"), createProduct);

// Update Product/:id
productRouter.put("/:id", auth, authorize("updateProduct"), updateProduct);

// Delete Product/:id
productRouter.delete("/:id", auth, authorize("deleteProduct"), deleteProduct);

module.exports = productRouter;
