const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    status: { type : String ,  enum: ["active", "ordered", "cancelled"] , default: "active"},
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
