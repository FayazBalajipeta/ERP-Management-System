const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createSalesOrder,
  getSalesOrders,
  updateSalesOrder,
  deleteSalesOrder,
} = require("../controllers/salesOrderController");

/* ============================= */
/* PROTECTED SALES ORDER ROUTES  */
/* ============================= */

// 🔐 All routes require login
router.use(protect);

/*
  Role Access:
  - CREATE → Admin, Sales
  - READ   → Admin, Sales, User
  - UPDATE → Admin, Sales
  - DELETE → Admin only
*/

// CREATE
router.post("/", authorizeRoles("Admin", "Sales"), createSalesOrder);

// READ
router.get("/", authorizeRoles("Admin", "Sales", "User"), getSalesOrders);

// UPDATE
router.put("/:id", authorizeRoles("Admin", "Sales"), updateSalesOrder);

// DELETE
router.delete("/:id", authorizeRoles("Admin"), deleteSalesOrder);

module.exports = router;
