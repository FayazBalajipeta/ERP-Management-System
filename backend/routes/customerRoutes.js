const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

// Admin & Sales allowed
router.get("/", protect, allowRoles("Admin", "Sales"), getCustomers);
router.post("/", protect, allowRoles("Admin", "Sales"), createCustomer);
router.put("/:id", protect, allowRoles("Admin"), updateCustomer);
router.delete("/:id", protect, allowRoles("Admin"), deleteCustomer);

module.exports = router;
