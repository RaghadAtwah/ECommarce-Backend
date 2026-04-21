import { useState, useEffect } from "react";
import { getToken, getRole } from "../../context/AuthContext";
import { getOrdersDashboard, updateStatusOrder } from "../../api/auth";
import Swal from "sweetalert2";
import {
  showError,
  showConfirm,
  showSuccess,
  closeAlert,
  showLoading,
} from "../../context/basics";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [filter, setFilter] = useState("all");

  const filteredOrders =
    filter === "all" ? order : order.filter((o) => o.status === filter);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        showLoading("Please wait...");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await getOrdersDashboard(token);
        setOrder(res.data.data);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    try {
      const { value: status } = await Swal.fire({
        title: "Update Order Status",
        input: "select",
        inputOptions: {
          pending: "Pending",
          processing: "Processing",
          delivered: "Delivered",
          cancelled: "Cancelled",
        },
        inputValue: currentStatus,
        showCancelButton: true,
        confirmButtonText: "Update",
      });

      if (!status) return;

      const token = getToken();

      await updateStatusOrder(orderId, { status }, token);

      setOrder((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );

      showSuccess("Order updated successfully");
    } catch (err) {
      showError(err.response?.data?.message || "Server error");
    }
  };
  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="mb-4 text-center">Orders</h2>

          <select
            className="form-select mb-3 w-75"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {filteredOrders.map((o) => (
            <div key={o._id} className="p-3 mb-3 border rounded shadow-sm">
              <h5 className="mb-2">
                <strong>Username:</strong> {o.userId?.email}
              </h5>
              <p className="mb-2">
                <strong>Total Price:</strong> {o.totalPrice}
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      o.status === "pending"
                        ? "orange"
                        : o.status === "cancelled"
                          ? "red"
                          : o.status === "delivered"
                            ? "blue"
                            : "green",
                    fontWeight: "bold",
                  }}
                >
                  {o.status}
                </span>
              </p>
              <p className="mb-2">
                <strong>Items Count:</strong> {o.items.length}
              </p>
              <div className="mb-2">
                <strong>Products: </strong>
                {o.items.map((item, index) => (
                  <div key={index} className="ms-3 border rounded p-3 my-3">
                    <p>Name: {item.productId?.name}</p>
                    <p>Price: {item.productId?.price}</p>
                  </div>
                ))}
              </div>

              <div className="d-flex">
                <button
                  className="btn-custom my-3 mx-2"
                  onClick={() => handleUpdateStatus(o._id, o.status)}
                >
                  Update Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Order;
