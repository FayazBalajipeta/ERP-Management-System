const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/*
  Role Access:
  - READ    → Admin, Sales
  - CREATE  → Admin, Sales
  - UPDATE  → Admin, Sales   ✅ FIXED
  - DELETE  → Admin only
*/

router.get("/", protect, authorizeRoles("Admin", "Sales"), getCustomers);

router.post("/", protect, authorizeRoles("Admin", "Sales"), createCustomer);

// 🔥 FIX: Allow Sales to UPDATE
router.put("/:id", protect, authorizeRoles("Admin", "Sales"), updateCustomer);

// ❌ Only Admin can delete
router.delete("/:id", protect, authorizeRoles("Admin"), deleteCustomer);

module.exports = router;
