import { useState, useEffect } from "react";
import { getToken, getRole, getUserId } from "../../context/AuthContext";
import { getUsers, getUserById, deleteUserById } from "../../api/auth";
import Swal from "sweetalert2";
import {
  showError,
  showConfirm,
  showSuccess,
  closeAlert,
  showLoading,
} from "../../context/basics";
import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        showLoading("Please wait...");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await getUsers(token);
        setUsers(res.data.data);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };

    fetchUsers();
  }, []);

  const handleViewUser = async (userId) => {
    try {
      const token = getToken();

      const res = await getUserById(userId, token);

      const role = res.data.data;
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const confirm = await showConfirm("Remove this User?");
      if (!confirm) return;

      await deleteUserById(userId, token);

      setUsers((prev) => prev.filter((u) => u._id !== userId));

      showSuccess("Successfully deleted User");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="mb-4 text-center">Users</h2>

          <select
            className="form-select my-3 w-75"
            onChange={(e) => {
              const user = users.find((u) => u._id === e.target.value);
              setSelectedUserId(e.target.value);
              setSelectedUser(user);
            }}
            value={selectedUserId}
          >
            <option value="">--Select User--</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>

          {selectedUser && (
            <div className="p-3 my-4 border rounded shadow-sm " style={{background:"#fff8f3"}}>
              <h5>{selectedUser.email}</h5>
              <small className="text-muted">User Information:</small>

              <ul>
                <li>Email: {selectedUser.email}</li>
                <li>Name: {selectedUser.name}</li>
                <li>Role: {selectedUser.role?.roleType}</li>
                <li>
                  <small className="text-muted">Permissions</small>
                  <ul>
                    {selectedUser.role?.permissions?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          )}

          {users.map((u) => (
            <div key={u._id} className="p-3 mb-3 border rounded shadow-sm">
              <p className="mb-2">
                <strong>Name: </strong>
                {u.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {u.email}
              </p>
              <button
                className="btn-custom mt-2"
                onClick={() => handleDeleteUser(u._id)}
              >
                Remove User
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default User;
