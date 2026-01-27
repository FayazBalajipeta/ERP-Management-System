import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Safe read from localStorage
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
      {/* LEFT : LOGO */}
      <div className="navbar-left">
        <span className="navbar-logo">⚙ SmartERP</span>
      </div>

      {/* RIGHT : USER + LOGOUT */}
      <div className="navbar-right">
        {user && (
          <span className="navbar-user">
            {user.role ? user.role.toUpperCase() : "USER"}
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
