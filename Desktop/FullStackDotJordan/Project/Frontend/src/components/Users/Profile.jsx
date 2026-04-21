import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { getUser, getAllUsers, updateUser } from "../../api/auth";
import {
  showError,
  showConfirm,
  showSuccess,
  closeAlert,
  showLoading,
} from "../../context/basics";
import { getToken, getUserId, getRole } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const token = getToken();
  const userId = getUserId();
  const role = getRole();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        showLoading("Please wait...");

        const res = await getUser(userId, token);
        setUser(res.data.data);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };
    if (token && userId) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        phoneNumber: "",
        address: "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const confirm = await showConfirm("Update your profile?");
      if (!confirm) return;

      showLoading("Update profile...");

      const data = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
      };

      if (form.password.trim() !== "") {
        data.password = form.password;
      }
      // if (phoneNumber !== typeof Number) {
      //   showError("Invalid Data");
      // }

      await updateUser(userId, data, token);

      const res = await getUser(userId, token);
      setUser(res.data.data);

      closeAlert();
      showSuccess("Successfully updated profile");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-6">
          <div className="card shadow p-4 ">
            <h2 className="text-center mb-4">⚙️ Settings</h2>

            {user && (
              <div className="mb-4">
                <div className="d-flex border-bottom py-2">
                  <strong className="me-2">Name:</strong>
                  <span>{user.name}</span>
                </div>

                <div className="d-flex border-bottom py-2">
                  <strong className="me-2">Email:</strong>
                  <span>{user.email}</span>
                </div>

                <div className="d-flex py-2">
                  <strong className="me-2">Role:</strong>
                  <span>{user.role?.roleType}</span>
                </div>

                <div className="d-flex border-bottom py-2">
                  <strong className="me-2">Phone number:</strong>
                  <span>{user.phoneNumber}</span>
                </div>

                <div className="d-flex border-bottom py-2">
                  <strong className="me-2">Address:</strong>
                  <span>{user.address}</span>
                </div>
              </div>
            )}

            <input
              className="form-control mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />

            <input
              className="form-control mb-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="New password (optional)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <input
              type="text"
              className="form-control mb-4"
              placeholder="Phone number"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />

            <input
              type="text"
              className="form-control mb-4"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <button className="btn-custom w-50  mx-auto" onClick={handleUpdate}>
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
