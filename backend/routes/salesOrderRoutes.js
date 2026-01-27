const express = require("express");
const router = express.Router();

const {
  createSalesOrder,
  getSalesOrders,
} = require("../controllers/salesOrderController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

// Sales & Admin can create
router.post(
  "/",
  protect,
  allowRoles("Sales", "Admin"),
  createSalesOrder
);

// Sales, Admin, Inventory can view
router.get(
  "/",
  protect,
  allowRoles("Sales", "Admin", "Inventory"),
  getSalesOrders
);

module.exports = router;
