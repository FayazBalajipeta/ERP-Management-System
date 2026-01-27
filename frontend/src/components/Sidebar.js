import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">

      <ul className="sidebar-menu">
        <li
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </li>

        <li
          className={location.pathname === "/products" ? "active" : ""}
          onClick={() => navigate("/products")}
        >
          Products
        </li>

        <li
          className={location.pathname === "/customers" ? "active" : ""}
          onClick={() => navigate("/customers")}
        >
          Customers
        </li>

        <li
          className={location.pathname === "/sales-orders" ? "active" : ""}
          onClick={() => navigate("/sales-orders")}
        >
          Sales Orders
        </li>

        <li
          className={location.pathname === "/grn" ? "active" : ""}
          onClick={() => navigate("/grn")}
        >
          GRN
        </li>

        <li
          className={location.pathname === "/invoice" ? "active" : ""}
          onClick={() => navigate("/invoice")}
        >
          Invoice
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
