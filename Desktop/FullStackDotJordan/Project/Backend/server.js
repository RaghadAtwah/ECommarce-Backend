const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

require("dotenv").config();
require("./models/db");

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect the server.js with routes
// Role Router
const roleRouter = require("./routers/role");
app.use("/roles", roleRouter);

// User Router
const userRouter = require("./routers/user");
app.use("/users", userRouter);

// Category Router
const categoryRouter = require("./routers/category");
app.use("/categories", categoryRouter);

// Product Router
const productRouter = require("./routers/product");
app.use("/products", productRouter);

// Cart Router
const cartRouter = require("./routers/cart");
app.use("/cart", cartRouter);

// Order Router
const orderRouter = require("./routers/order");
app.use("/orders", orderRouter);

// Wishlist Router
const wishlistRouter = require("./routers/wishlist");
app.use("/wishlist", wishlistRouter);

app.listen(PORT, () => {
  console.log(`Example application listening at http://localhost:${PORT}`);
});
