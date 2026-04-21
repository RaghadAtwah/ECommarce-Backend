import { useEffect, useState } from "react";
import {
  getCart,
  checkoutOrder,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../api/auth";
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
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        showLoading("Please wait...");

        const token = getToken();
        const userId = getUserId();

        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const res = await getCart(token);
        setCart(res.data.cart);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const confirm = await showConfirm("Do you want to checkout your order?");
      if (!confirm) return;

      showLoading("Processing checkout...");

      await checkoutOrder(token);

      closeAlert();

      showSuccess("Order placed successfully");

      navigate("/orders/checkout");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || "Server error");
    }
  };

  const clearItemsFromCart = async () => {
    try {
      const token = getToken();

      const confirm = await showConfirm("Remove all items from cart?");
      if (!confirm) return;

      await clearCart(token);
      setCart({ ...cart, items: [], totalPrice: 0 });

      showSuccess("Successfully removed items ");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = getToken();

      const confirm = await showConfirm("Remove this item from cart?");
      if (!confirm) return;

      await removeFromCart(productId, token);

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.productId._id !== productId),
      }));

      showSuccess("Successfully removed item");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleQuantityChange = async (productId, type) => {
    try {
      const token = getToken();

      const item = cart.items.find((i) => i.productId._id === productId);

      if (!item) return;

      let newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;

      if (newQty === 0) {
        await removeFromCart(productId, token);
      } else {
        await updateQuantity(productId, newQty, token);
      }

      const res = await getCart(token);
      setCart(res.data.cart);
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || "Server error");
    }
  };

  if (!cart) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h3></h3>
      </div>
    );
  }
  return (
    <div className="container my-5 ">
      {" "}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h2 className="text-center mb-4 header-class">🛒 Cart Page</h2>
          {cart.items.length === 0 ? (
            <div className="text-center my-5 py-5">
              <h4 className="mb-2">🛒 Your cart is empty</h4>
              <p className="text-muted">
                Start adding products to see them here
              </p>

              <button
                className="btn-custom mt-3"
                onClick={() => navigate("/products")}
              >
                Show Products
              </button>
            </div>
          ) : (
            <>
              {cart.items.map((item) => (
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

                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="btn-custom fs-6"
                        style={{ background: "#fdeee3" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="btn-custom"
                        style={{ border: " 1px solid #fdeee3" }}
                        onClick={() =>
                          handleQuantityChange(item.productId._id, "dec")
                        }
                      >
                        ➖
                      </button>

                      <button
                        className="btn-custom"
                        style={{ border: " 1px solid #fdeee3" }}
                        onClick={() =>
                          handleQuantityChange(item.productId._id, "inc")
                        }
                      >
                        ➕
                      </button>

                      <button
                        className="btn-custom"
                        onClick={() => handleRemoveFromCart(item.productId._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="card p-3 mt-4 shadow-lg d-flex justify-content-between align-items-center"
                style={{ background: "#fdeee3" }}
              >
                <h5 className="my-3">Total: ${cart.totalPrice}</h5>

                <div className="d-flex gap-4 my-3">
                  <button
                    className="shadow-lg btn-custom"
                    onClick={handleCheckout}
                  >
                    CheckOut Order
                  </button>

                  <button
                    className="shadow-lg btn-custom"
                    onClick={() => {
                      clearItemsFromCart();
                    }}
                  >
                    Delete all items
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
