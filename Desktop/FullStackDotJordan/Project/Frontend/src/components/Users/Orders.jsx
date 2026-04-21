import { useEffect, useState } from "react";
import { getOrders, cancelOrder } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  showError,
  showConfirm,
  showSuccess,
  closeAlert,
  showLoading,
} from "../../context/basics";
import { getToken, getUserId } from "../../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const STATUS_COLORS = {
    pending: "bg-warning text-dark",
    processing: "bg-primary text-white",
    delivered: "bg-success text-white",
    cancelled: "bg-danger text-white",
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const userId = getUserId();

        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const res = await getOrders(token);
        setOrders(res.data.data);
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      const confirm = await showConfirm(
        "Are you sure, You want to cancel this order?",
      );
      if (!confirm) return;

      const token = localStorage.getItem("token");

      await cancelOrder(orderId, token);

      const res = await getOrders(token);
      setOrders(res.data.data);

      showSuccess("Successfully cancelled order");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🧾 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card p-3 mb-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex gap-3 align-items-center">
                <h5 className="mb-0">Total: ${order.totalPrice}</h5>

                <span
                  className={`fw-bold px-4 py-2 rounded-pill text-uppercase ${
                    STATUS_COLORS[order.status]
                  }`}
                  style={{ fontSize: "14px", letterSpacing: "1px" }}
                >
                  {order.status}
                </span>
              </div>

              {order.status === "pending" && (
                <button
                  className="delete-custom btn-sm"
                  onClick={() => handleCancel(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>

            {order.items.map((item) => (
              <div
                key={item._id}
                className="d-flex gap-3 align-items-center mt-2"
              >
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />

                <div>
                  <p className="mb-0">{item.productId.name}</p>
                  <small>${item.productId.price}</small>
                </div>

                <span className="ms-auto">x{item.quantity}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
export default Orders;
