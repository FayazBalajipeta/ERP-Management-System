const router = require("express").Router();
const Invoice = require("../models/Invoice");
const SalesOrder = require("../models/SalesOrder"); // 🔗 Link to Sales Orders
const PDFDocument = require("pdfkit");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/*
  Role Access:
  - READ    → Admin, Sales, User
  - CREATE  → Admin, Sales
  - UPDATE  → Admin, Sales
  - DELETE  → Admin only
  - PDF     → Admin, Sales, User
*/

// ==============================
// 🔐 PROTECT ALL ROUTES
// ==============================
router.use(protect);

// ==============================
// GET all invoices (with Sales Order link)
// ==============================
router.get("/", authorizeRoles("Admin", "Sales", "User"), async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("salesOrderId") // 🔗 populate linked sales order
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    console.error("FETCH INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});

// ==============================
// CREATE invoice (link to sales order optional)
// ==============================
router.post("/", authorizeRoles("Admin", "Sales"), async (req, res) => {
  try {
    const { customerName, productName, quantity, price, salesOrderId } =
      req.body;

    if (!customerName || !productName || !quantity || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    const total = Number(quantity) * Number(price);

    const invoice = await Invoice.create({
      customer: customerName,
      product: productName,
      quantity: Number(quantity),
      price: Number(price),
      total,
      salesOrderId: salesOrderId || null, // 🔗 optional link
    });

    // 🔥 Auto mark Sales Order as Invoiced
    if (salesOrderId) {
      await SalesOrder.findByIdAndUpdate(salesOrderId, {
        status: "Invoiced",
      });
    }

    res.status(201).json(invoice);
  } catch (err) {
    console.error("CREATE INVOICE ERROR:", err);
    res.status(500).json({ message: "Create invoice failed" });
  }
});

// ==============================
// UPDATE invoice (including sales order link)
// ==============================
router.put("/:id", authorizeRoles("Admin", "Sales"), async (req, res) => {
  try {
    const { customerName, productName, quantity, price, salesOrderId } =
      req.body;

    const total = Number(quantity) * Number(price);

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        customer: customerName,
        product: productName,
        quantity: Number(quantity),
        price: Number(price),
        total,
        salesOrderId: salesOrderId || null, // 🔗 update link
      },
      { new: true }
    );

    res.json(invoice);
  } catch (err) {
    console.error("UPDATE INVOICE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// ==============================
// DELETE invoice (Admin only)
// ==============================
router.delete("/:id", authorizeRoles("Admin"), async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted" });
  } catch (err) {
    console.error("DELETE INVOICE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// ==============================
// DOWNLOAD PDF (All roles)
// ==============================
router.get("/:id/pdf", authorizeRoles("Admin", "Sales", "User"), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "salesOrderId"
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(24).text("SmartERP Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text(`Customer: ${invoice.customer}`);
    doc.text(`Product: ${invoice.product}`);
    doc.text(`Quantity: ${invoice.quantity}`);
    doc.text(`Price Per Unit: ₹${invoice.price}`);
    doc.moveDown();

    doc.fontSize(16).text(`Total Amount: ₹${invoice.total}`, {
      underline: true,
    });

    if (invoice.salesOrderId) {
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Linked Sales Order ID: ${invoice.salesOrderId._id}`);
    }

    doc.moveDown(2);
    doc.text("Thank you for your business!", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

module.exports = router;
