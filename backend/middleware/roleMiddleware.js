const User = require("../models/User");

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access Forbidden: Insufficient Role" });
    }

    req.role = user.role;
    next();
  };
};

module.exports = authorizeRoles;
