const User = require("../models/User");

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.user.id).select("role");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 🔥 Normalize roles for safety
      const userRole = user.role?.toLowerCase();
      const allowed = allowedRoles.map((r) => r.toLowerCase());

      if (!allowed.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Access Forbidden: Insufficient Role" });
      }

      req.role = user.role;
      next();
    } catch (error) {
      console.error("ROLE MIDDLEWARE ERROR:", error);
      res.status(500).json({ message: "Role authorization failed" });
    }
  };
};

module.exports = authorizeRoles;
