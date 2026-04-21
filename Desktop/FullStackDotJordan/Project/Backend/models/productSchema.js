const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String , required: true},
    description: { type: String },
    price: { type: Number , default : 0},
    stockQuantity: { type: Number, default: 0 },
    imageUrl: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
