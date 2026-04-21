import { Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import { getRole } from "../context/AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const role = getRole();

  if (role !== "admin") {
    return <Navigate to="/" />;
  }
  return (
    <div className="d-flex min-vh-100">
      {/* SideBar */}
      <div className="sideBar-class p-3 d-flex flex-column">
        <h4 className="mb-4"> Admin Panel</h4>

        <Link className="text-decoration-none mb-3" to="/dashboard">
          Statistics
        </Link>

        <Link className="text-decoration-none mb-3" to="/roles">
          Role
        </Link>

        <Link className="text-decoration-none mb-3" to="/users">
          Users
        </Link>

        <Link className="text-decoration-none mb-3" to="/categories">
          Categories
        </Link>

        <Link className="text-decoration-none mb-3" to="/productsDashboard">
          Products
        </Link>

        <Link className="text-decoration-none mb-3" to="/ordersDashboard">
          Orders
        </Link>
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        {/* TopBar*/}
        <div className=" p-2 d-flex justify-content-between align-items-center px-3 py-2 topBar-class">
          <h5 className="m-0">Dashboard </h5>
          <button className="btn-custom px-1 py-0 mx-2" onClick={() => navigate("/products")}>
            👤 User Mode
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
