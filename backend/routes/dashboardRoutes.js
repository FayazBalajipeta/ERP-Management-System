const router = require("express").Router();
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const SalesOrder = require("../models/SalesOrder");
const PurchaseOrder = require("../models/PurchaseOrder");
const GRN = require("../models/GRN");
const Invoice = require("../models/Invoice");
const { protect } = require("../middleware/authMiddleware");

/* ===========================
   DASHBOARD STATS (REALTIME)
=========================== */
router.get("/", protect, async (req, res) => {
  try {
    const [
      products,
      customers,
      salesOrders,
      purchaseOrders,
      grns,
      invoices,
      totalRevenueAgg,
    ] = await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      SalesOrder.countDocuments(),
      PurchaseOrder.countDocuments(),
      GRN.countDocuments(),
      Invoice.countDocuments(),
      Invoice.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    res.json({
      products,
      customers,
      salesOrders,
      purchaseOrders,
      grns,
      invoices,
      totalRevenue,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Dashboard stats failed" });
  }
});

/* ===========================
   REVENUE GRAPH
=========================== */
router.get("/revenue-graph", protect, async (req, res) => {
  try {
    const data = await Invoice.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" }, // FIXED FIELD
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formatted = data.map((item) => ({
      month: months[item._id - 1],
      sales: item.revenue,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Revenue graph error:", err);
    res.status(500).json({ message: "Revenue graph failed" });
  }
});

/* ===========================
   LOW STOCK ALERT
=========================== */
router.get("/low-stock", protect, async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select("title stock");

    res.json(lowStockProducts);
  } catch (err) {
    console.error("Low stock error:", err);
    res.status(500).json({ message: "Low stock failed" });
  }
});

module.exports = router;
