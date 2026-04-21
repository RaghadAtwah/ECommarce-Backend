const express = require("express");
const cartRouter = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const authorize = require("../middleware/Authorization");
const auth = require("../middleware/Authentication");

// Get Cart
cartRouter.get("/", auth, getCart);

// Add to Cart
cartRouter.post("/", auth, addToCart);

// Update Cart
cartRouter.put("/:id", auth, updateCart);



// Remove from Cart
cartRouter.delete("/:id", auth, removeFromCart);

// Clear Cart
cartRouter.delete("/", auth, clearCart);

module.exports = cartRouter;
