import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data);
      } catch (err) {
        if (err.response?.status === 400) {
          setError(err.response.data.message);
        } else {
          setError("Server error");
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.data);
      } catch (err) {
        if (err.response?.status === 400) {
          setError(err.response.data.message);
        } else {
          setError("Server error");
        }
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div>
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="hero-slide">
              <img
                src="/SkinCare3.jpg"
                className="d-block w-100 hero-img"
                alt="1"
              />
              <div className="hero-overlay"></div>

              <div className="hero-content">
                <h1>Discover Your Signature Style</h1>
                <p className="Carousel-p">
                  Perfumes, skincare, accessories, and watches — carefully
                  selected to match your elegance and personality. Shop premium
                  products that define you.
                </p>
                <a
                  href="/products"
                  className="btn btn-light shadow-lg btn-custom"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <div className="hero-slide">
              <img
                src="/SkinCare1.jpg"
                className="d-block w-100 hero-img"
                alt="2"
              />
              <div className="hero-overlay"></div>

              <div className="hero-content">
                <h1>Natural Beauty</h1>
                <p className="Carousel-p">Feel confident in your skin</p>
                <button className="btn-custom">Shop Now</button>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <div className="hero-slide">
              <img
                src="/SkinCare2.jpg"
                className="d-block w-100 hero-img"
                alt="3"
              />
              <div className="hero-overlay"></div>

              <div className="hero-content">
                <h1>Glow Everyday</h1>
                <p className="Carousel-p">Premium skincare collection</p>
                <button className="btn btn-light">Shop Now</button>
              </div>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container my-5">
        <h2 className="mb-4 text-center header-class">Shop by Categories</h2>

        <div className="row g-4">
          {categories?.map((cat) => (
            <div className="col-md-3 col-sm-6" key={cat._id}>
              <div className="card h-100 shadow-sm category-card">
                <img
                  src={cat.imageUrl}
                  className="card-img-top"
                  alt={cat.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title">{cat.title}</h5>
                  <p className="card-text text-muted">{cat.description}</p>

                  <div className="mt-auto">
                    <button
                      className=" btn-custom"
                      onClick={() => navigate("/products")}
                    >
                      Show more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container my-5 bestSeller-class">
        <h2 className="mb-4 text-center header-class">🔥 Best Sellers</h2>

        <div className="row g-4">
          {products?.slice(0, 4).map((product) => (
            <div className="col-md-3 col-sm-6" key={product._id}>
              <div className="card h-100 shadow-lg best-card">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <span className="badge bg-danger best-badge">Best Seller</span>

                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title">{product.title}</h5>

                  <p className="card-text text-muted">{product.description}</p>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <strong>${product.price}</strong>

                    <button
                      className="btn-custom"
                      onClick={() => navigate("/products")}
                    >
                      Show
                    </button>
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

export default HomePage;
