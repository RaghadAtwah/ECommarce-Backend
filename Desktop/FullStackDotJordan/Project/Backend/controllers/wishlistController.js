const wishlistModel = require("../models/wishlistSchema");
const productModel = require("../models/productSchema");

// Get Wishlist
const getWhishList = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await wishlistModel
      .findOne({ userId })
      .populate("items.productId");

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "WhishList not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Your WhishList",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await wishlistModel.findOne({ userId });

    if (!wishlist) {
      wishlist = await wishlistModel.create({
        userId,
        items: [{ productId }],
      });
    } else {
      const exists = wishlist.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }
      wishlist.items.push({ productId });
    }

    await wishlist.save();

    return res.status(201).json({
      success: true,
      message: "Product added to Wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    let wishlist = await wishlistModel.findOne({
      userId,
    });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }
    const itemToRemove = wishlist.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!itemToRemove) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed successfully!",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    let wishlist = await wishlistModel.findOne({
      userId,
    });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }
    wishlist.items = [];
    await wishlist.save();
    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully!",
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { getWhishList, addToWishlist, removeFromWishlist, clearWishlist };
