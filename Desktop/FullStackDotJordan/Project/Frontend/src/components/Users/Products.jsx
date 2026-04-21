import { useEffect, useState } from "react";
import {
  getCategories,
  getProducts,
  addToCart,
  addToWishList,
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

const Products = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishList, setWishList] = useState({ items: [] });
  const [filters, setFilters] = useState({
    name: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchCategoriesById = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data);
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };

    fetchCategoriesById();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(filters);
        setProducts(res.data.data);
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };
    fetchProducts();
  }, [filters]);

  const handleAddToCart = async (product) => {
    try {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      await addToCart(product._id, token);

      showSuccess("Successfully add to cart");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleAddToWishList = async (product) => {
    try {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      await addToWishList(product._id, token);

      showSuccess("Successfully added to wishlist");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        className="form-control mx-auto my-5 w-50"
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      />

      <select
        className="form-select mb-4 mx-auto w-50 filter-class"
        value={filters.categoryId}
        onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.title}
          </option>
        ))}
      </select>
      <div className="container my-5 px-5 py-5 bestSeller-class">
        <h2 className="mb-4 text-center header-class">All Products</h2>

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-md-4 col-sm-6" key={product._id}>
              <div className="card h-100 shadow-lg">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title">{product.title}</h5>

                  <p className="card-text text-muted">{product.description}</p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <strong>${product.price}</strong>

                    <div title="Add to Cart" className="d-flex gap-2">
                      <button
                        className="btn-sm btn-custom"
                        onClick={() => handleAddToCart(product)}
                      >
                        🛒
                      </button>

                      <button
                        title="Add to Wishlist"
                        className="btn-sm btn-custom"
                        onClick={() => handleAddToWishList(product)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
