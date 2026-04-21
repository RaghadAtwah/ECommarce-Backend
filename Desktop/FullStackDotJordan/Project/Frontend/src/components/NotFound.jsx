import React from "react";

const NotFound = () => {
  return (
    <div className="container my-5">

      <div className="text-center mx-5 my-5 px-5 py-5">
        <h1 className="fw-bold">404 - Page Not Found</h1>
        <p className="text-muted">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>
      </div>

      <div className="row text-center mt-5 g-4">

        <div className="col-md-4">
          <div className="p-4 shadow-sm rounded h-100 features-class">
            <h5 className="fw-bold">🔐 Sign In</h5>
            <p className="text-muted mb-0">
              Sign in to your account to manage orders and enjoy a personalized experience.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm rounded features-class">
            <h5 className="fw-bold">📝 Create Account</h5>
            <p className="text-muted mb-0">
              Don’t have an account? Sign up quickly and start shopping with us.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 shadow-sm rounded features-class h-100">
            <h5 className="fw-bold">🛍️ Browse Products</h5>
            <p className="text-muted mb-0">
              Explore our latest collection and discover great deals and products.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default NotFound;