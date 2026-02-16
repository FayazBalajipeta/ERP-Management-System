import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ open, toggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem("user");
  let userRole = "";

  try {
    userRole = JSON.parse(userStr)?.role?.toLowerCase();
  } catch {
    userRole = "";
  }

  const canAccess = (roles) => roles.map(r => r.toLowerCase()).includes(userRole);

  return (
    <>
      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={toggle}>
        ☰
      </button>

      <div className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="sidebar-header">SmartERP</div>

        <ul className="sidebar-menu">

          {/* Dashboard → Admin, User, Sales */}
          {canAccess(["Admin", "User", "Sales"]) && (
            <li className={location.pathname === "/dashboard" ? "active" : ""} onClick={() => navigate("/dashboard")}>
              📊 Dashboard
            </li>
          )}

          {/* Products → Admin, User */}
          {canAccess(["Admin", "User"]) && (
            <li className={location.pathname === "/products" ? "active" : ""} onClick={() => navigate("/products")}>
              📦 Products
            </li>
          )}

          {/* Customers → Admin, Sales */}
          {canAccess(["Admin", "Sales"]) && (
            <li className={location.pathname === "/customers" ? "active" : ""} onClick={() => navigate("/customers")}>
              👥 Customers
            </li>
          )}

          {/* Sales Orders → Admin, Sales */}
          {canAccess(["Admin", "Sales"]) && (
            <li className={location.pathname === "/sales-orders" ? "active" : ""} onClick={() => navigate("/sales-orders")}>
              🧾 Sales Orders
            </li>
          )}

          {/* Purchase Orders → Admin, User */}
          {canAccess(["Admin", "User"]) && (
            <li className={location.pathname === "/purchase-orders" ? "active" : ""} onClick={() => navigate("/purchase-orders")}>
              🛒 Purchase Orders
            </li>
          )}

          {/* GRN → Admin, User */}
          {canAccess(["Admin", "User"]) && (
            <li className={location.pathname === "/grn" ? "active" : ""} onClick={() => navigate("/grn")}>
              🚚 GRN
            </li>
          )}

          {/* Invoice → Admin, Sales */}
          {canAccess(["Admin", "Sales"]) && (
            <li className={location.pathname === "/invoice" ? "active" : ""} onClick={() => navigate("/invoice")}>
              💳 Invoice
            </li>
          )}

        </ul>
      </div>
    </>
  );
}

export default Sidebar;
