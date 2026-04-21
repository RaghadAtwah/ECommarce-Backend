import { useState, useEffect } from "react";
import { getToken, getUserId, getRole } from "../context/AuthContext";
import Dropdown from "bootstrap/js/dist/dropdown";

const Navbar = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
    dropdownElementList.forEach((el) => {
      new Dropdown(el);
    });
  }, []);

  useEffect(() => {
    const updateAuth = () => {
      setToken(getToken());
      setRole(getRole());
    };

    updateAuth();

    window.addEventListener("authChange", updateAuth);

    return () => {
      window.removeEventListener("authChange", updateAuth);
    };
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{ backgroundColor: "#fdeee3" }}
    >
      <div className="container position-relative">
        <a className="navbar-brand" href="/">
          <img src="/RAStore.png" alt="RAStore" height="80" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto text-center gap-5">
            <li className="nav-item fs-4">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>

            {token && role === "admin" && (
              <li className="nav-item fs-4">
                <a className="nav-link" href="/dashboard">
                  Dashboard
                </a>
              </li>
            )}

            <li className="nav-item fs-4">
              <a className="nav-link" href="/products">
                Products
              </a>
            </li>

            <li className="nav-item fs-4">
              <a className="nav-link" href="/about">
                About
              </a>
            </li>

            {token && role && (
              <>
                <li className="nav-item fs-4">
                  <a className="nav-link" title="Your Cart Page" href="/cart">
                    🛒
                  </a>
                </li>

                <li className="nav-item fs-4">
                  <a
                    className="nav-link"
                    title="Your Wishlist Page"
                    href="/wishlist"
                  >
                    ❤️
                  </a>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto  dropdownNav-class">
            {!token && (
              <li className="nav-item dropdown fs-4">
                <button
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  👤
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="/login">
                      Login
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/signup">
                      Sign Up
                    </a>
                  </li>
                </ul>
              </li>
            )}

            {token && (
              <li className="nav-item dropdown fs-4">
                <button
                  className="nav-link dropdown-toggle mx-auto my-5"
                  data-bs-toggle="dropdown"
                >
                  👤
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="/profile">
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/orders">
                      Orders
                    </a>
                  </li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        localStorage.clear();

                        window.dispatchEvent(new Event("authChange"));

                        window.location.href = "/";
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
