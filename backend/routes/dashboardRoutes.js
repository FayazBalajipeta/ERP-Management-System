const router = require("express").Router();
const Product = require("../models/Product");
const SalesOrder = require("../models/SalesOrder");
const PurchaseOrder = require("../models/PurchaseOrder");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  const data = {
    products: await Product.countDocuments(),
    salesOrders: await SalesOrder.countDocuments(),
    purchaseOrders: await PurchaseOrder.countDocuments(),
  };
  res.json(data);
});

module.exports = router;
