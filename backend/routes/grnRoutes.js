const router = require("express").Router();
const GRN = require("../models/GRN");
const PurchaseOrder = require("../models/PurchaseOrder");
const { protect } = require("../middleware/authMiddleware");

// GET GRNs
router.get("/", protect, async (req, res) => {
  try {
    const grns = await GRN.find()
      .populate("purchaseOrder", "supplier product status")
      .sort({ createdAt: -1 });

    res.json(grns);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch GRNs" });
  }
});

// CREATE GRN (Linked to PO)
router.post("/", protect, async (req, res) => {
  try {
    const {
      vendorName,
      productName,
      quantityReceived,
      pricePerUnit,
      purchaseOrderId,
    } = req.body;

    if (!purchaseOrderId)
      return res.status(400).json({ message: "Purchase Order required" });

    const totalAmount = quantityReceived * pricePerUnit;

    const grn = await GRN.create({
      vendorName,
      productName,
      quantityReceived,
      pricePerUnit,
      totalAmount,
      purchaseOrder: purchaseOrderId,
    });

    // 🔥 UPDATE PO STATUS
    await PurchaseOrder.findByIdAndUpdate(purchaseOrderId, {
      status: "Received",
    });

    res.status(201).json(grn);
  } catch (err) {
    console.error("GRN CREATE ERROR:", err);
    res.status(500).json({ message: "Create GRN failed" });
  }
});

module.exports = router;
