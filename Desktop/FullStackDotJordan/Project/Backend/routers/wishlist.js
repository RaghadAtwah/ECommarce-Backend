const express = require("express");
const wishlistRouter = express.Router();

const {
  getWhishList,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const authorize = require("../middleware/Authorization");
const auth = require("../middleware/Authentication");

// Get Wishlist
wishlistRouter.get("/", auth, getWhishList);

// Add to Wishlist
wishlistRouter.post("/", auth, addToWishlist);

// Remove from Wishlist
wishlistRouter.delete("/:id", auth, removeFromWishlist);

// Clear Wishlist
wishlistRouter.delete("/", auth, clearWishlist);

module.exports = wishlistRouter;
