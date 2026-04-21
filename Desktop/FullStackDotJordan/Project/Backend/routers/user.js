const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  logIn,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/Authentication");
const authorize = require("../middleware/Authorization");

// Get all Users
userRouter.get("/", auth, authorize("getAllUsers"), getAllUsers);
// Get User/:id
userRouter.get("/:id", auth, authorize("getUserById"), getUserById);

// Create new User
userRouter.post("/", createUser);

// logIn
userRouter.post("/login", logIn);

// Update User/:id
userRouter.put("/:id",auth, authorize("updateUser"), updateUser);

// Delete User/:id
userRouter.delete("/:id", auth, authorize("deleteUserById"), deleteUser);
module.exports = userRouter;
