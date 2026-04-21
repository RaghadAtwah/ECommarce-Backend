import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { getWishList, removeFromWishList, clearWishList } from "../../api/auth";
import {
  showError,
  showConfirm,
  showSuccess,
  closeAlert,
  showLoading,
} from "../../context/basics";
import { getToken, getUserId } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        showLoading("Please wait...");

        const token = getToken();
        const userId = getUserId();

        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const res = await getWishList(token);
        setWishList(res.data.wishlist.items);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };

    fetchWishList();
  }, []);

  const handleRemoveFromWishList = async (productId) => {
    try {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const confirm = await showConfirm("Remove this item from wishlist?");
      if (!confirm) return;

      await removeFromWishList(productId, token);

      setWishList((prev) =>
        prev.filter((item) => item.productId._id !== productId),
      );

      showSuccess("Successfully removed item");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const clearItemsFromWishList = async () => {
    try {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const confirm = await showConfirm("Remove all items from wishlist?");
      if (!confirm) return;

      await clearWishList(token);
      setWishList([]);

      showSuccess("Successfully removed items");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  if (!wishlist) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }
  return (
    <div className="container my-5 wishlist-container">
      <h2 className="text-center mb-4">❤️ WishList Page</h2>

      {wishlist.length === 0 ? (
        <div className="text-center my-5 py-5">
          <h4>❤️ Your Wishlist is empty</h4>
          <p className="text-muted">Start adding products to see them here</p>
          <button
            className="btn-custom mt-3"
            onClick={() => navigate("/products")}
          >
            Show Products
          </button>
        </div>
      ) : (
        <>
          <div className="text-end mb-3">
            <button
              className=" btn-custom"
              onClick={() => {
                clearItemsFromWishList();
              }}
            >
              Delete all items
            </button>
          </div>

          {wishlist.map((item) => (
            <div
              key={item._id}
              className="card p-3 mb-3 d-flex flex-row align-items-center justify-content-between"
            >
              {/* image */}
              <img
                src={item.productId?.imageUrl}
                alt=""
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />

              <div className="flex-grow-1 px-3">
                <h5 className="mb-1">{item.productId?.name}</h5>
                <p className="mb-0 text-muted">${item.productId?.price}</p>
              </div>

              <button
                className="btn-custom"
                onClick={() => handleRemoveFromWishList(item.productId._id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Wishlist;
