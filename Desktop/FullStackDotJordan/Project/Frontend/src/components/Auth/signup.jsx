import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/auth";
import { showSuccess } from "../../context/basics";

const Signup = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    location: null,
  });

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject("Geolocation not support");
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => reject(err),
      );
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{8,15}$/;
    return regex.test(phone);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      if (!form.name) {
        setError("Name is required");
        return;
      }

      if (!form.email) {
        setError("Email is required");
        return;
      }

      if (!validateEmail(form.email)) {
        setError("Invalid email format");
        return;
      }

      if (!form.password) {
        setError("Password is required");
        return;
      }

      if (!validatePassword(form.password)) {
        setError(
          "Password must be at least 6 characters and contain letters + numbers",
        );
        return;
      }

      if (!form.phoneNumber) {
        setError("Phone number is required");
        return;
      }
      if (!validatePhone(form.phoneNumber)) {
        setError("Invalid phone number");
        return;
      }

      if (!form.address) {
        setError("Address is required");
        return;
      }

      setError("");
      let location = null;
      try {
        location = await getLocation();
      } catch (err) {
        console.log("Location not allowed or failed");
      }

      const res = await signup({ ...form, location });

      navigate("/login");
      showSuccess("Successfully Created account - please Login");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center">
      <div
        className="card shadow-lg py-5 px-5 mx-5 my-5"
        style={{
          width: "90%",
          maxWidth: "500px",
          backgroundColor: "#fdeee3",
          borderRadius: "15px",
        }}
      >
        <h3 className="text-center mb-4 fw-bold">Signup</h3>

        <div style={{ height: "70px" }}>
          {error && (
            <div className="alert alert-danger py-1 text-center m-0">
              {error}
            </div>
          )}
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control input-class"
            placeholder="Enter name"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
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

        <div className="mb-3">
          <input
            type="number"
            name="phoneNumber"
            className="form-control input-class"
            placeholder="Enter Phone number"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="address"
            className="form-control input-class"
            placeholder="Enter Address"
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-100 fw-bold btn-custom shadow-lg"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
