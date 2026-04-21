import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../context/basics";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      if (!form.email) return setError("Email is required");
      if (!form.password) return setError("Password is required");

      setError("");

      const res = await login(form);
      const { token, role, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      showSuccess("Welcome ❤️ Successfully Login");

      if (role === "admin") navigate("/products");
      else if (role === "user") navigate("/products");
      else navigate("/signup");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      window.dispatchEvent(new Event("authChange"));
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center">
      <div
        className="card shadow-lg py-5 px-5 mx-5 my-5"
        style={{
          width: "500px",
          height: "auto",
          backgroundColor: "#fdeee3",
          borderRadius: "15px",
        }}
      >
        <h3 className="text-center mb-4 fw-bold">Login</h3>

        <div style={{ height: "40px" }}>
          {error && (
            <div className="alert alert-danger py-1 text-center m-0">
              {error}
            </div>
          )}
        </div>

        <div className="mb-3 ">
          <input
            type="email"
            name="email"
            className="form-control input-class"
            placeholder="Enter email"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control input-class"
            placeholder="Enter password"
            onChange={handleChange}
          />
        </div>

        <button onClick={handleLogin} className=" w-100 fw-bold btn-custom">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
