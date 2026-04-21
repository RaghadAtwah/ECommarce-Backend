import { useState, useEffect } from "react";
import { getToken, getRole } from "../../context/AuthContext";
import {
  getRoles,
  getRoleById,
  createRole,
  createPermission,
  updateRole,
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
import { Button } from "bootstrap";

const Role = () => {
  const navigate = useNavigate();
  const [roles, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        showLoading("Please wait...");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await getRoles(token);
        setRole(res.data.data);

        closeAlert();
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    };

    fetchRoles();
  }, []);

  const handleViewRoles = async (roleId) => {
    try {
      const token = getToken();

      const res = await getRoleById(roleId, token);
      console.log(res.data.data);
      const role = res.data.data;

      Swal.fire({
        title: role.roleType,
        html: `
        <ul>
          ${role.permissions.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      `,
      });
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  const handleAddRole = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Create New Role",
      html: `
      <input id="roleType" class="swal2-input" placeholder="Role Name" />
      <textarea id="permissions" class="swal2-textarea" placeholder="Enter permissions (comma separated)"></textarea>
    `,
      focusConfirm: false,
      preConfirm: () => {
        const roleType = document.getElementById("roleType").value;
        const permissionsText = document.getElementById("permissions").value;

        if (!roleType) {
          Swal.showValidationMessage("Role name is required");
          return;
        }

        const permissions = permissionsText
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== "");

        return { roleType, permissions };
      },
      showCancelButton: true,
      confirmButtonText: "Create",
    });

    if (formValues) {
      try {
        showLoading("Creating...");

        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        await createRole(formValues.roleType, formValues.permissions, token);

        const res = await getRoles(token);

        setRole(res.data.data);
        showSuccess("Successfully, created Role");
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    }
  };

  const handleAddPermission = async (roleId) => {
    const { value: formValues } = await Swal.fire({
      title: "Create New Permission",
      html: `
      <textarea id="permissions" class="swal2-textarea" placeholder="Enter Single permission"></textarea>
    `,
      focusConfirm: false,
      preConfirm: () => {
        const permissionsText = document.getElementById("permissions").value;

        if (!permissionsText) {
          Swal.showValidationMessage("Permission is required");
          return;
        }

        const permissions = permissionsText.trim();

        return { permissions };
      },
      showCancelButton: true,
      confirmButtonText: "Create",
    });

    if (formValues) {
      try {
        showLoading("Creating...");

        const token = getToken();

        await createPermission(roleId, formValues.permissions, token);

        const res = await getRoles(token);
        console.log(res);

        setRole(res.data.data);
        showSuccess("Successfully, created Permission");
      } catch (err) {
        closeAlert();
        showError(err.response?.data?.message || " Server error");
      }
    }
  };

  const handleUpdateRole = async (role) => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Update Role",
        html: `<input id="roleType" class="swal2-input" value="${role.roleType}"/>
      <textarea id="permissions" class="swal2-textarea">${role.permissions.join(", ")}</textarea>`,

        preConfirm: () => {
          const roleType = document.getElementById("roleType").value;

          const permissionsText = document.getElementById("permissions").value;

          const permissions = permissionsText
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p !== "");

          return { roleType, permissions };
        },

        showCancelButton: true,
        confirmButtonText: "Update",
      });

      if (!formValues) return;

      const token = getToken();

      await updateRole(
        role._id,
        formValues.roleType,
        formValues.permissions,
        token,
      );

      const res = await getRoles(token);
      setRole(res.data.data);
      console.log(res.data.data);

      showSuccess("Successfully updated Role");
    } catch (err) {
      closeAlert();
      showError(err.response?.data?.message || " Server error");
    }
  };

  return (
    <div className="container py-2 mx-auto">
      <div className="row justify-content-center mx-auto">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="mb-4 text-center">Roles</h2>
          <button className="btn-custom my-3 w-75" onClick={handleAddRole}>
            Create new role
          </button>

          <select
            className="form-select my-3 w-75"
            onChange={(e) => {
              const role = roles.find((r) => r._id === e.target.value);
              setSelectedRoleId(e.target.value);
              setSelectedRole(role);
            }}
            value={selectedRoleId}
          >
            <option value="">--Select Role--</option>
            {roles.map((i) => (
              <option key={i._id} value={i._id}>
                {i.roleType}
              </option>
            ))}
          </select>

          {selectedRole && (
            <div className="p-3 dropdownById-class my-4 ">
              <h5>{selectedRole.roleType}</h5>
              <small className="text-muted">Permissions:</small>

              <ul>
                {selectedRole.permissions?.map((p, i) => (
                  <li key={i}> {p}</li>
                ))}
              </ul>
            </div>
          )}

          {roles.map((item) => (
            <div key={item._id} className="p-3 mb-3 border rounded shadow-sm">
              <h5 className="mb-2">{item.roleType}</h5>

              <small className="text-muted">Permissions:</small>

              <ul className="mt-2 mb-0">
                {item.permissions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <div className="d-flex flex-wrap gap-3 my-3">
                <button
                  className="btn-custom"
                  onClick={() => handleAddPermission(item._id)}
                >
                  Add Permission
                </button>
                <button
                  className="btn-custom"
                  onClick={() => handleUpdateRole(item)}
                >
                  Update Role
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Role;
