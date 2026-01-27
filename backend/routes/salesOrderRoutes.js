const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../middleware/authMiddleware");

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

// CREATE → Admin + Sales
router.post("/", allowRoles("Admin", "Sales"), createSalesOrder);

// READ → Admin + Sales + Inventory
router.get("/", allowRoles("Admin", "Sales", "Inventory"), getSalesOrders);

// UPDATE → Admin + Sales
router.put("/:id", allowRoles("Admin", "Sales"), updateSalesOrder);

// DELETE → Admin only
router.delete("/:id", allowRoles("Admin"), deleteSalesOrder);

module.exports = router;
