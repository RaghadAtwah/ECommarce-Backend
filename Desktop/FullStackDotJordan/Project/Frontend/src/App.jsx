import React, { useEffect, useState } from "react";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

// Auth
import Signup from "./components/Auth/signup";
import Login from "./components/Auth/login";

//components - User -
import HomePage from "./components/Users/HomePage";
import Products from "./components/Users/Products";
import About from "./components/Users/About";
import Cart from "./components/Users/Cart";
import Checkout from "./components/Users/Checkout";
import Orders from "./components/Users/Orders";
import WishList from "./components/Users/WishList";
import Profile from "./components/Users/Profile";

//components - Admin -
import Dashboard from "./components/admin/Dashboard";
import Role from "./components/admin/Role";
import User from "./components/admin/User";
import Category from "./components/admin/Category";
import Product from "./components/admin/Product";
import Order from "./components/admin/Order";

// Others
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <Navbar /> */}

      <div className="flex-grow-1">
        <Routes>
          {/* User layout */}
          <Route element={<UserLayout />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishList" element={<WishList />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin layout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roles" element={<Role />} />
            <Route path="/users" element={<User />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/productsDashboard" element={<Product />} />
            <Route path="/ordersDashboard" element={<Order />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default App;
