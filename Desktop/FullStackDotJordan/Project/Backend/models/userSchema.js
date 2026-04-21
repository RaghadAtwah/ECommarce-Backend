const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      match: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
    },
    phoneNumber: { type: String, required: true, match: /^[0-9]{8,15}$/ },
    address: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
