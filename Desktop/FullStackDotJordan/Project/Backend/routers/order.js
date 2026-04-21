const express = require("express");
const orderRouter = express.Router();

const { getallOrders,getOrderById, checkOut ,cancelOrder,updateOrderStatus} = require("../controllers/orderController");
const authorize = require("../middleware/Authorization");
const auth = require("../middleware/Authentication");

// Get all orders
orderRouter.get("/", auth, getallOrders);

// Get Order/:id
orderRouter.get("/:id", auth, getOrderById);

// Check out
orderRouter.post("/checkout", auth, checkOut);

// update Order Status
orderRouter.put("/:id/status", auth, updateOrderStatus);

// Cancel/:id
orderRouter.patch("/cancel/:id", auth, cancelOrder)

module.exports = orderRouter;
