const cartModel = require("../models/cartSchema");
const productModel = require("../models/productSchema");

// Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.productId");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Your Cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add to Cart
const addToCart = async (req, res) => {
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

    let cart = await cartModel.findOne({
      userId,
      status: "active",
    });

    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
        totalPrice: product.price,
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (index > -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    let totalPrice = 0;

    for (let item of cart.items) {
      const itemProduct = await productModel.findById(item.productId);

      totalPrice += itemProduct.price * item.quantity;
    }

    cart.totalPrice = totalPrice;

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Product added to Cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Cart
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Quantity",
      });
    }

    let cart = await cartModel.findOne({
      userId,
      status: "active",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId,
      );
    } else {
      cart.items[index].quantity = quantity;
    }

    let totalPrice = 0;

    for (let item of cart.items) {
      const itemProduct = await productModel.findById(item.productId);
      totalPrice += itemProduct.price * item.quantity;
    }

    cart.totalPrice = totalPrice;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully!",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    let cart = await cartModel.findOne({
      userId,
      status: "active",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemToRemove = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!itemToRemove) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    let totalPrice = 0;

    for (let item of cart.items) {
      const itemProduct = await productModel.findById(item.productId);
      totalPrice += itemProduct.price * item.quantity;
    }

    cart.totalPrice = totalPrice;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed successfully!",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await cartModel.findOne({
      userId,
      status: "active",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully!",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
