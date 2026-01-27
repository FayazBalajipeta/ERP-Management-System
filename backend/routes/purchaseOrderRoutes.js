const router = require("express").Router();
const PurchaseOrder = require("../models/PurchaseOrder");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/", protect, allowRoles("Purchase", "Admin"), async (req, res) => {
  const po = await PurchaseOrder.create(req.body);
  res.status(201).json(po);
});

router.get("/", protect, allowRoles("Admin", "Inventory"), async (req, res) => {
  const pos = await PurchaseOrder.find().populate("products.product");
  res.json(pos);
});

module.exports = router;
