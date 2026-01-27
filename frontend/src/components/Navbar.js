import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ SAFE read from localStorage
  let user = null;
  const rawUser = localStorage.getItem("user");

  if (rawUser && rawUser !== "undefined") {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        ⚙️ <span className="brand">SmartERP</span>
      </div>

      <div className="navbar-right">
        {user && (
          <span className="user-info">
            {user.email || "User"} ({user.role || "user"})
          </span>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
