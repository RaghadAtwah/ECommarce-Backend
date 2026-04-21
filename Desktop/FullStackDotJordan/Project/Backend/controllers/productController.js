const productModel = require("../models/productSchema");
const categoryModel = require("../models/categorySchema");

// Get products - filter Product
const getFilterProducts = async (req, res) => {
  try {
    const { categoryId, name, minPrice, maxPrice } = req.query;

    let filter = {};

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (name ) {
      filter.$or = [
        { name: { $regex: name, $options: "i" } },
        { description: { $regex: name, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const result = await productModel.find(filter).populate("categoryId", "title");

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Product found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All Products",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product/:id
const getProductById = async (req, res) => {
  try {
    const result = await productModel
      .findById(req.params.id)
      .populate("categoryId");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product information",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new Product
const createProduct = async (req, res) => {
  try {
    const { name, description, imageUrl, price, stockQuantity, categoryId } =
      req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (price == 0 || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }
    if (stockQuantity == null || stockQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock Quantity",
      });
    }

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id",
      });
    }

    const newProduct = new productModel({
      name,
      description,
      imageUrl,
      price,
      stockQuantity,
      categoryId,
    });

    const result = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product/:id
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, imageUrl, price, stockQuantity, categoryId } =
      req.body;
    const { role } = req.user;
    const isAdmin = role === "admin";
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await productModel.findByIdAndUpdate(
      productId,
      { name, description, imageUrl, price, stockQuantity, categoryId },
      { new: true },
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product/:id
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await productModel.findByIdAndDelete(productId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getFilterProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
