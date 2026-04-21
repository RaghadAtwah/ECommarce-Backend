import { useEffect, useState } from "react";
import { getOrders } from "../../api/auth";
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

const Cart = () => {
  const [orders, setOrders] = useState([]);
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

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };

    fetchOrders();
  }, []);

  if (!orders?.length) {
    return <h3 className="text-center my-5">No Orders</h3>;
  }
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h2 className="text-center mb-4 header-class">
            🧾 All checked out orders{" "}
          </h2>
          <button
            onClick={() => navigate("/orders")}
            className=" text-center mb-4 btn-custom"
          >
            Show orders status
          </button>

          {orders.length === 0 ? (
            <p className="text-center">Empty orders</p>
          ) : (
            <>
              {orders.map((order) => (
                <div key={order._id} className="mb-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="card p-3 mb-3 shadow-sm">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.productId.imageUrl}
                            alt={item.productId.title}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />

                          <div>
                            <h6 className="mb-1">{item.productId.name}</h6>
                            <small className="text-muted">
                              ${item.productId.price}
                            </small>
                          </div>
                        </div>

                        <span
                          className="btn-custom fs-6"
                          style={{ background: "#fdeee3" }}
                        >
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="card p-2 mb-3">
                    <strong>Total: ${order.totalPrice}</strong>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
