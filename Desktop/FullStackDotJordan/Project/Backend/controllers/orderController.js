const orderModel = require("../models/orderSchema");
const cartModel = require("../models/cartSchema");

// Get all Orders
const getallOrders = async (req, res) => {
  try {
    const { id, role } = req.user;

    let result;

    if (role === "admin") {
      result = await orderModel
        .find({})
        .populate("userId", "name email")
        .populate("items.productId");
    } else {
      result = await orderModel
        .find({ userId: id })
        .populate("items.productId");
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      message: result.length ? "All Orders" : "No orders found",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Order/:id
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { id, role } = req.user;

    const order = await orderModel
      .findById(orderId)
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (role !== "admin" && order.userId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order found",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// checkOut out
const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel
      .findOne({
        userId,
        status: "active",
      })
      .populate("items.productId");

    if (!cart || cart.items.length === 0 || cart === null) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let orderItems = [];
    let totalPrice = 0;

    for (let item of cart.items) {
      orderItems.push({
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price,
      });
      totalPrice += item.productId.price * item.quantity;
    }

    const order = await orderModel.create({
      userId,
      items: orderItems,
      totalPrice,
      status: "pending",
    });

    cart.status = "ordered";
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Checkout successful",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel/:id
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { id, role } = req.user;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (role !== "admin" && order.userId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this order",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully!",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ["pending", "processing", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getallOrders,
  getOrderById,
  checkOut,
  cancelOrder,
  updateOrderStatus,
};
