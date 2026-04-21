import { useState, useEffect } from "react";
import { getToken } from "../../context/AuthContext";
import {
  getOrdersDashboard,
  getProducts,
  getCategories,
  getUsers,
} from "../../api/auth";
import { showError } from "../../context/basics";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  // ================= ORDERS =================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await getOrdersDashboard(token);
        setOrder(res.data.data);
      } catch (err) {
        console.log(err);
        showError(err.response?.data?.message || "Server error");
      }
    };

    fetchOrders();
  }, []);

  // ================= PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(); // ❌ removed filters bug
        setProducts(res.data.data);
      } catch (err) {
        console.log(err);
        showError(err.response?.data?.message || "Server error");
      }
    };

    fetchProducts();
  }, []);

  // ================= CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data);
      } catch (err) {
        console.log(err);
        showError(err.response?.data?.message || "Server error");
      }
    };

    fetchCategories();
  }, []);

  // ================= Users =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        const res = await getUsers(token); 

        setUsers(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
        showError(err.response?.data?.message || "Server error");
      }
    };

    fetchUsers();
  }, []);

  // ================= KPI =================
  const totalOrders = order.length;
  const pending = order.filter((o) => o.status === "pending").length;
  const cancelled = order.filter((o) => o.status === "cancelled").length;
  const processing = order.filter((o) => o.status === "processing").length;
  const delivered = order.filter((o) => o.status === "delivered").length;


  const chartData = [
    { name: "Pending", value: pending },
    { name: "Cancelled", value: cancelled },
    { name: "Processing", value: processing },
    { name: "Delivered", value: delivered },
  ];

  // ================= CATEGORY PIE DATA =================
  const categoryCount = (products || []).reduce((acc, product) => {
    const cat = product.categoryId?.title; // FIXED

    if (!cat) return acc;

    acc[cat] = (acc[cat] || 0) + 1;

    return acc;
  }, {});

  const categoryData = Object.keys(categoryCount).map((key) => ({
    name: key,
    value: categoryCount[key],
  }));

  // ================= UI =================
  return (
    <div
      className="container-fluid py-4"
      style={{ background: "#fef3eb", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold">Admin Dashboard</h3>
        <p className="text-muted">
          Overview of orders, products, and categories analytics
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 text-center">
            <h6 className="text-muted">Total Orders</h6>
            <h2 className="fw-bold text-danger">{totalOrders}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 text-center">
            <h6 className="text-muted">Total Categories</h6>
            <h2 className="fw-bold text-success">{categories.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 text-center">
            <h6 className="text-muted">Total Products</h6>
            <h2 className="fw-bold text-warning">{products.length}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3 text-center">
            <h6 className="text-muted">Total Registered Users</h6>
            <h2 className="fw-bold text-info">{users.length}</h2>
          </div>
        </div>
      </div>

      {/* ================= CHARTS ROW ================= */}
      <div className="row g-4">
        {/* BAR CHART */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="mb-3">Orders Status</h6>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.name === "Pending"
                            ? "#facc15"
                            : entry.name === "Processing"
                              ? "  #22c55e"
                              : entry.name === "Delivered"
                                ? "#3b82f6"
                                : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="mb-3">Products by Category</h6>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
