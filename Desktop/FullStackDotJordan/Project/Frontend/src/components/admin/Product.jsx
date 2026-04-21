import { useState, useEffect } from "react";
import { getToken, getRole } from "../../context/AuthContext";
import {
  getProductsDashboard,
  createProductDashboard,
  getCategories,
  UpdateProductDashboard,
  deleteProductById,
} from "../../api/auth";
import Swal from "sweetalert2";
import {
  showError,
  showConfirm,
  showSuccess,
  closeAlert,
  showLoading,
} from "../../context/basics";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts =
    categoryFilter === "all"
      ? product
      : product.filter((p) => p.categoryId?._id === categoryFilter);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        showLoading("Please wait...");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await getProductsDashboard(token);
        setProduct(res.data.data);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();

        const res = await getCategories(token);
        setCategories(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Create New Product",
        html: `
              <input id="name" class="swal2-input" placeholder="Product name" />
              <input id="description" class="swal2-input" placeholder="Description" />
              <input id="price" class="swal2-input" placeholder="Price" />
              <input id="stockQuantity" class="swal2-input " placeholder="Stock Quantity" />

               <select id="categoryId" class="swal2-input">
          <option value="">Select Category</option>
          ${categories
            .map((c) => `<option value="${c._id}">${c.title}</option>`)
            .join("")}
        </select>
              <input id="imageUrl" class="swal2-input" placeholder="Image Link" />
              
            `,
        focusConfirm: false,
        preConfirm: () => {
          const name = document.getElementById("name").value;
          const description = document.getElementById("description").value;
          const imageUrl = document.getElementById("imageUrl").value;
          const price = document.getElementById("price").value;
          const stockQuantity = document.getElementById("stockQuantity").value;
          const categoryId = document.getElementById("categoryId").value;

          if (!name) {
            Swal.showValidationMessage("Product name is required");
            return;
          }

          if (!imageUrl || !imageUrl.startsWith("http")) {
            Swal.showValidationMessage(
              "Image URL is requires (Starts with Http)",
            );
          }
          if (!categoryId) {
            Swal.showValidationMessage("Category is required");
            return;
          }

          if (!price || isNaN(price) || Number(price) <= 0) {
            Swal.showValidationMessage("Price must be positive number");
            return;
          }

          if (
            !stockQuantity ||
            isNaN(stockQuantity) ||
            Number(stockQuantity) <= 0
          ) {
            Swal.showValidationMessage(
              "Stock Quantity must be positive number",
            );
            return;
          }

          return {
            name,
            description,
            imageUrl,
            price,
            stockQuantity,
            categoryId,
          };
        },
        showCancelButton: true,
        confirmButtonText: "Create",
      });

      if (formValues) {
        showLoading("Creating...");

        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        await createProductDashboard(
          formValues.name,
          formValues.description,
          formValues.imageUrl,
          formValues.categoryId,
          formValues.price,
          formValues.stockQuantity,
          token,
        );

        const res = await getProductsDashboard(token);

        setProduct(res.data.data);
        closeAlert();
        showSuccess("Successfully, created Product");
      }
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleUpdateProduct = async (product) => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Update Product",
        html: `
        <label class="swal-label">Product name</label>
        <input id="name" class="swal2-input" value="${product.name}" />
        
        <label class="swal-label">Description</label>
        <input id="description" class="swal2-input" value="${product.description}"  />
        
        <label class="swal-label">Price</label>
        <input id="price" class="swal2-input" value="${product.price}" />
        
        <label class="swal-label">Stock Quantity</label>
        <input id="stockQuantity" class="swal2-input " value="${product.stockQuantity}" />
        
        <label class="swal-label">Select Category</label>
        <select id="categoryId" class="swal2-input">
          <option value="">Select Category</option>
          ${categories
            .map(
              (c) => `<option value="${c._id}" ${
                c._id === product.categoryId?._id ? "selected" : ""
              }>
  ${c.title}
</option>`,
            )
            .join("")}
        </select>
                <label class="swal-label">Image URL</label>

                <input id="imageUrl" class="swal2-input" value="${product.imageUrl}"/>
              
            `,
        focusConfirm: false,
        preConfirm: () => {
          const name = document.getElementById("name").value;
          const description = document.getElementById("description").value;
          const price = document.getElementById("price").value;
          const stockQuantity = document.getElementById("stockQuantity").value;
          const categoryId = document.getElementById("categoryId").value;
          const imageUrl = document.getElementById("imageUrl").value;

          if (!name) return Swal.showValidationMessage("Name is required");
          if (!categoryId)
            return Swal.showValidationMessage("Category is required");

          if (!price || isNaN(price) || Number(price) <= 0)
            return Swal.showValidationMessage("Price must be valid");

          if (
            !stockQuantity ||
            isNaN(stockQuantity) ||
            Number(stockQuantity) <= 0
          )
            return Swal.showValidationMessage("Stock quantity must be valid");

          if (imageUrl && !imageUrl.startsWith("http"))
            return Swal.showValidationMessage("Image URL must be valid");

          return {
            name,
            description,
            price,
            stockQuantity,
            categoryId,
            imageUrl,
          };
        },
        showCancelButton: true,
        confirmButtonText: "Update",
      });

      if (formValues) {
        showLoading("Updating...");

        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        await UpdateProductDashboard(product._id, formValues, token);

        const res = await getProductsDashboard(token);

        setProduct(res.data.data);
        closeAlert();
        showSuccess("Successfully updated Product");
      }
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const confirm = await showConfirm("Remove this Product?");
      if (!confirm) return;
      console.log(confirm);

      await deleteProductById(productId, token);

      setProduct((prev) => prev.filter((p) => p._id !== productId));

      showSuccess("Successfully deleted Product");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
      console.log(err);
    }
  };

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="mb-4 text-center">Products</h2>

          <select
            className="form-select mb-3 w-75"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          <button className="btn-custom my-3 w-75" onClick={handleAddProduct}>
            Create new Product
          </button>

          {filteredProducts.map((p) => (
            <div key={p._id} className="p-3 mb-3 border rounded shadow-sm">
              <h5 className="mb-2">
                <strong>Name:</strong> {p.name}
              </h5>
              <p className="mb-2">
                <strong>Description:</strong> {p.description}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {p.categoryId?.title}
              </p>
              <p className="mb-2">
                <strong>price: </strong>
                {p.price}
              </p>
              <p className="mb-2">
                <strong>Stock Quantity:</strong> {p.stockQuantity}
              </p>

              <img
                className="mb-2"
                src={p.imageUrl}
                alt={p.name}
                style={{ width: "100px", height: "auto" }}
              />
              <div className="d-flex">
                <button
                  className="btn-custom my-3 mx-2"
                  onClick={() => handleUpdateProduct(p)}
                >
                  Update Category
                </button>

                <button
                  className="btn-custom my-3 mx-2"
                  onClick={() => handleDeleteProduct(p._id)}
                >
                  Delete Category
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Product;
