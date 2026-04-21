import { useState, useEffect } from "react";
import { getToken, getRole } from "../../context/AuthContext";
import {
  getCategoriesDashboard,
  createCategoryDashboard,
  updateCategoryDashboard,
  deleteCategoryById,
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

const Category = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        showLoading("Please wait...");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await getCategoriesDashboard(token);
        setCategory(res.data.data);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Create New Category",
        html: `
        <input id="title" class="swal2-input" placeholder="Title" />
        <input id="description" class="swal2-input" placeholder="Description" />
        <input id="imageUrl" class="swal2-input" placeholder="Image Link" />
        
      `,
        focusConfirm: false,
        preConfirm: () => {
          const title = document.getElementById("title").value;
          const description = document.getElementById("description").value;
          const imageUrl = document.getElementById("imageUrl").value;

          if (!title) {
            Swal.showValidationMessage("Title is required");
            return;
          }

          if (!imageUrl || !imageUrl.startsWith("http")) {
            Swal.showValidationMessage(
              "Image URL is requires (Starts with Http)",
            );
          }

          return { title, description, imageUrl };
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

        await createCategoryDashboard(
          formValues.title,
          formValues.description,
          formValues.imageUrl,
          token,
        );

        const res = await getCategoriesDashboard(token);

        setCategory(res.data.data);
        closeAlert();
        showSuccess("Successfully, created Category");
      }
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleUpdateCategory = async (category) => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Update Category",
        html: `
        <input id="title" class="swal2-input" value="${category.title}" />
        <input id="description" class="swal2-input" value="${category.description}" />
        <input id="imageUrl" class="swal2-input" value="${category.imageUrl}" />
      `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Update",
        preConfirm: () => {
          const title = document.getElementById("title").value.trim();
          const description = document
            .getElementById("description")
            .value.trim();
          const imageUrl = document.getElementById("imageUrl").value.trim();

          if (!title) {
            Swal.showValidationMessage("Title is required");
            return;
          }

          return { title, description, imageUrl };
        },
      });

      if (formValues) {
        const token = getToken();

        await updateCategoryDashboard(
          category._id,
          formValues.title,
          formValues.description,
          formValues.imageUrl,
          token,
        );

        const res = await getCategoriesDashboard(token);
        setCategory(res.data.data);

        showSuccess("Category updated successfully");
      }
    } catch (err) {
      showError(err.response?.data?.message || "Server error");
    }
  };

  const handleDeleteCategory = async (categoryId, token) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const confirm = await showConfirm("Remove this Category?");
      if (!confirm) return;

      const res = await deleteCategoryById(categoryId, token);

      setCategory((prev) => prev.filter((c) => c._id !== categoryId));

      showSuccess("Successfully deleted Category");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="mb-4 text-center">Categories</h2>

          <button className="btn-custom my-3 w-75" onClick={handleAddCategory}>
            Create new Category
          </button>

          {category.map((c) => (
            <div key={c._id} className="p-3 mb-3 border rounded shadow-sm">
              <h5 className="mb-2">Title: {c.title}</h5>
              <p className="mb-2">
                <strong>Description:</strong> {c.description}
              </p>
              <img
                className="mb-2"
                src={c.imageUrl}
                alt={c.title}
                style={{ width: "100px", height: "auto" }}
              />
              <div className="d-flex">
                <button
                  className="btn-custom my-3 mx-2"
                  onClick={() => handleUpdateCategory(c)}
                >
                  Update Category
                </button>

                <button
                  className="btn-custom my-3 mx-2"
                  onClick={() => handleDeleteCategory(c._id)}
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
export default Category;
