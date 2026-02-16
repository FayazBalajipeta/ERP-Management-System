import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // 🔐 Not logged in
  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (err) {
    console.error("Invalid user data in storage", err);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // 🔥 Normalize role
  const userRole = user?.role?.toLowerCase();

  // 🛑 If roles are provided & user role not allowed
  if (roles.length > 0) {
    const allowedRoles = roles.map((r) => r.toLowerCase());

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
