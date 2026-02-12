const router = require("express").Router();
const PurchaseOrder = require("../models/PurchaseOrder");
const { protect } = require("../middleware/authMiddleware");

// GET all
router.get("/", protect, async (req, res) => {
  try {
    const orders = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchase orders" });
  }
});

// CREATE
router.post("/", protect, async (req, res) => {
  try {
    const { supplierName, productName, quantity, status } = req.body;

    if (!supplierName || !productName || !quantity) {
      return res.status(400).json({ message: "All fields required" });
    }

    const order = await PurchaseOrder.create({
      supplier: supplierName,
      product: productName,
      quantity,
      status: status || "Pending",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Create purchase order failed" });
  }
});

// UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    const { supplierName, productName, quantity, status } = req.body;

    const updated = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      {
        supplier: supplierName,
        product: productName,
        quantity,
        status,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
