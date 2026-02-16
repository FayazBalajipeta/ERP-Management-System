const router = require("express").Router();
const GRN = require("../models/GRN");
const PurchaseOrder = require("../models/PurchaseOrder"); // 🔗 Link to PO
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
      .populate("purchaseOrderId"); // 🔗 populate linked PO

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

    const totalAmount = Number(quantityReceived) * Number(pricePerUnit);

    const grn = await GRN.create({
      vendorName,
      productName,
      quantityReceived: Number(quantityReceived),
      pricePerUnit: Number(pricePerUnit),
      totalAmount,
      purchaseOrderId: purchaseOrderId || null,
    });

    // 🔥 Auto update Purchase Order status to RECEIVED
    if (purchaseOrderId) {
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
    const {
      vendorName,
      productName,
      quantityReceived,
      pricePerUnit,
      purchaseOrderId,
    } = req.body;

    const totalAmount = Number(quantityReceived) * Number(pricePerUnit);

    const grn = await GRN.findByIdAndUpdate(
      req.params.id,
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
    const grn = await GRN.findByIdAndDelete(req.params.id);

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
