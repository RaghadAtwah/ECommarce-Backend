import React from "react";

const Footer = () => {
  return (
    <footer className="footer mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold footerLogo-class">RAStore</h4>
            <p className="text-muted">
              Your destination for perfumes, skincare, accessories, and watches.
              We bring elegance to your everyday life.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="footer-link">
                  Products
                </a>
              </li>
              <li>
                <a href="/" className="footer-link">
                  Categories
                </a>
              </li>
              <li>
                <a href="/about" className="footer-link">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Contact</h5>
            <p className="text-muted">📍 Amman, Jordan</p>
            <p className="text-muted">📧 support@rastore.com</p>
            <p className="text-muted">📞 +962 7 0000 0000</p>
          </div>
        </div>

        <hr />

        <div className="text-center text-muted">
          © {new Date().getFullYear()} RAStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
