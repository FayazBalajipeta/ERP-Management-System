const router = require("express").Router();
const mongoose = require("mongoose");
const GRN = require("../models/GRN");
const PurchaseOrder = require("../models/PurchaseOrder");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/*
  Role Access:
  - READ    → Admin, Sales, User
  - CREATE  → Admin, User
  - UPDATE  → Admin, User
  - DELETE  → Admin only
*/

// ==============================
// 🔐 PROTECT ALL ROUTES
// ==============================
router.use(protect);

// =======================
// GET ALL GRNs
// =======================
router.get("/", authorizeRoles("Admin", "Sales", "User"), async (req, res) => {
  try {
    const grns = await GRN.find()
      .sort({ createdAt: -1 })
      .populate("purchaseOrderId");

    res.json(grns);
  } catch (err) {
    console.error("FETCH GRN ERROR:", err);
    res.status(500).json({ message: "Failed to fetch GRNs" });
  }
});

// =======================
// CREATE GRN
// =======================
router.post("/", authorizeRoles("Admin", "User"), async (req, res) => {
  try {
    const {
      vendorName,
      productName,
      quantityReceived,
      pricePerUnit,
      purchaseOrderId,
    } = req.body;

    if (!vendorName || !productName || !quantityReceived || !pricePerUnit) {
      return res.status(400).json({ message: "All fields required" });
    }

    const totalAmount =
      Number(quantityReceived) * Number(pricePerUnit);

    const grn = await GRN.create({
      vendorName,
      productName,
      quantityReceived: Number(quantityReceived),
      pricePerUnit: Number(pricePerUnit),
      totalAmount,
      purchaseOrderId: purchaseOrderId || null,
    });

    // 🔥 Auto update Purchase Order status to RECEIVED
    if (purchaseOrderId && mongoose.Types.ObjectId.isValid(purchaseOrderId)) {
      await PurchaseOrder.findByIdAndUpdate(purchaseOrderId, {
        status: "Received",
      });
    }

    res.status(201).json(grn);
  } catch (err) {
    console.error("CREATE GRN ERROR:", err);
    res.status(500).json({ message: "Create GRN failed" });
  }
});

// =======================
// UPDATE GRN
// =======================
router.put("/:id", authorizeRoles("Admin", "User"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid GRN ID" });
    }

    const {
      vendorName,
      productName,
      quantityReceived,
      pricePerUnit,
      purchaseOrderId,
    } = req.body;

    if (!vendorName || !productName || !quantityReceived || !pricePerUnit) {
      return res.status(400).json({ message: "All fields required" });
    }

    const totalAmount =
      Number(quantityReceived) * Number(pricePerUnit);

    const grn = await GRN.findByIdAndUpdate(
      id,
      {
        vendorName,
        productName,
        quantityReceived: Number(quantityReceived),
        pricePerUnit: Number(pricePerUnit),
        totalAmount,
        purchaseOrderId: purchaseOrderId || null,
      },
      { new: true }
    );

    if (!grn) {
      return res.status(404).json({ message: "GRN not found" });
    }

    // 🔁 Update PO status if linked
    if (purchaseOrderId && mongoose.Types.ObjectId.isValid(purchaseOrderId)) {
      await PurchaseOrder.findByIdAndUpdate(purchaseOrderId, {
        status: "Received",
      });
    }

    res.json(grn);
  } catch (err) {
    console.error("UPDATE GRN ERROR:", err);
    res.status(500).json({ message: "Update GRN failed" });
  }
});

// =======================
// DELETE GRN (Admin only)
// =======================
router.delete("/:id", authorizeRoles("Admin"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid GRN ID" });
    }

    const grn = await GRN.findByIdAndDelete(id);

    if (!grn) {
      return res.status(404).json({ message: "GRN not found" });
    }

    res.json({ message: "GRN deleted successfully" });
  } catch (err) {
    console.error("DELETE GRN ERROR:", err);
    res.status(500).json({ message: "Delete GRN failed" });
  }
});

module.exports = router;
