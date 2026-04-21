import axios from "axios";
import { data } from "react-router-dom";

const API = axios.create({
  baseURL: "https://ecommarce-backend-ae7r.onrender.com",
});

//======================================================================

// Signup
export const signup = (data) => API.post("/users", data);
// Login
export const login = (data) => API.post("/users/login", data);

//============================role = users==============================
//============================Profile===================================
// UserById
export const getUser = (id, token) =>
  API.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// UpdateUser
export const updateUser = (id, data, token) =>
  API.put(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//============================Categories================================
// GetCategories
export const getCategories = () => {
  return API.get("/categories");
};

//============================Products===================================
// Get Products
export const getProducts = (filters) => {
  return API.get("/products", {
    params: filters,
  });
};

//============================Cart===================================
// Add to Cart
export const addToCart = (productId, token) =>
  API.post(
    "/cart",
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

// Get Cart
export const getCart = (token) => {
  return API.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Checkout order
export const checkoutOrder = (token) =>
  API.post(
    "/orders/checkout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

// Clear Cart
export const clearCart = (token) =>
  API.delete("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Remove from Cart
export const removeFromCart = (productId, token) =>
  API.delete(`/cart/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Update Quantity in Cart
export const updateQuantity = (productId, quantity, token) =>
  API.put(
    `/cart/${productId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

//============================Orders===================================
// Get Orders
export const getOrders = (token) => {
  return API.get("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Cancel Order
export const cancelOrder = (orderId, token) =>
  API.patch(
    `/orders/cancel/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

//============================Wishlist===================================
// Get Wishlist
export const getWishList = (token) => {
  return API.get("/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Add to Wishlist
export const addToWishList = (productId, token) =>
  API.post(
    "/wishlist",
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

// Remove From Wishlist
export const removeFromWishList = (productId, token) =>
  API.delete(`/wishlist/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Clear Wishlist
export const clearWishList = (token) =>
  API.delete("/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//============================admin only===================================
// GetAllUsers "Admin only"
export const getAllUsers = (token) => {
  return API.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//============================role = admin==============================
// ============================Roles================================
// GetRoles
export const getRoles = (token) => {
  return API.get("/roles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GetRoleById
export const getRoleById = (roleId, token) =>
  API.get(`/roles,${roleId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Create Role
export const createRole = (roleType, permissions, token) =>
  API.post(
    "/roles",
    { roleType, permissions },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

// Create Permission
export const createPermission = (roleId, permission, token) =>
  API.post(
    `/roles/permission/${roleId}`,
    { permission },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

// Update Role
export const updateRole = (roleId, roleType, permissions, token) =>
  API.put(
    `/roles/${roleId}`,
    { roleType, permissions },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

//============================Users================================
// GetUsers
export const getUsers = (token) => {
  return API.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GetUserById
export const getUserById = (userId, token) =>
  API.get(`/users,${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// DeleteUser
export const deleteUserById = (userId, token) =>
  API.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
//============================Categories================================
// GetAllCategories
export const getCategoriesDashboard = (token) => {
  return API.get("/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// CreateCategory
export const createCategoryDashboard = (title, description, imageUrl, token) =>
  API.post(
    "/categories",
    { title, description, imageUrl },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
// UpdateCategory
export const updateCategoryDashboard = (
  categoryId,
  title,
  description,
  imageUrl,
  token,
) =>
  API.put(
    `/categories/${categoryId}`,
    { title, description, imageUrl },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

// DeleteCategory
export const deleteCategoryById = (categoryId, token) =>
  API.delete(`/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//============================Products================================
// GetAllProducts
export const getProductsDashboard = (token) => {
  return API.get("/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
//GetProductsByCategory

// CreateProduct
export const createProductDashboard = (
  name,
  description,
  imageUrl,
  categoryId,
  stockQuantity,
  price,
  token,
) =>
  API.post(
    "/products",
    { name, description, imageUrl, categoryId, stockQuantity, price },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
// UpdateProduct
export const UpdateProductDashboard = (id, data, token) =>
  API.put(`/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
// DeleteProduct
export const deleteProductById = (productId, token) =>
  API.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//============================Orders================================
// GetAllOrders
export const getOrdersDashboard = (token) => {
  return API.get("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// GetOrderById

// Update Status Order
export const updateStatusOrder = (orderId, data, token) => {
  return API.put(`/orders/${orderId}/status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
