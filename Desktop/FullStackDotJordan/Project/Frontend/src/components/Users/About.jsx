import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="text-center mx-5 my-5 px-5 py-5">
        <h1 className="fw-bold">About Us</h1>
        <p className="text-muted">Discover who we are and what we stand for</p>
      </div>

      <div
        className="row align-items-center g-5 p-4 shadow-sm rounded"
        style={{ backgroundColor: "#fdeee3" }}
      >
        <div className="col-md-6 text-center">
          <img
            src="/RAStore.png"
            alt="about"
            className="img-fluid rounded shadow logo-img"
            style={{
              maxHeight: "350px",
              objectFit: "contain",
            }}
          />
        </div>

        <div className="col-md-6">
          <h3 className="fw-bold mb-3">Welcome to RAStore</h3>

          <p className="text-muted">
            We are a modern e-commerce platform specializing in perfumes,
            skincare, accessories, and watches.
          </p>

          <p className="text-muted">
            Our goal is to bring high-quality products that match your lifestyle
            and elegance with a smooth shopping experience.
          </p>

          <button className=" btn-custom" onClick={() => navigate("/products")}>
            Show Products
          </button>
        </div>
      </div>

      <div className="row text-center mt-5 g-4">
        <div className="col-md-4">
          <div className="p-4 shadow-sm rounded h-100 features-class">
            <h5 className="fw-bold">✨ Premium Quality</h5>
            <p className="text-muted mb-0">Only the best products for you</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm rounded features-class">
            <h5 className="fw-bold">🚚 Fast Delivery</h5>
            <p className="text-muted mb-0">Quick and reliable shipping</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm rounded features-class h-100">
            <h5 className="fw-bold">💎 Trusted Brand</h5>
            <p className="text-muted mb-0">Thousands of happy customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
