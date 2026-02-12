const router = require("express").Router();
const Invoice = require("../models/Invoice");
const PDFDocument = require("pdfkit");
const { protect } = require("../middleware/authMiddleware");

// GET all invoices
router.get("/", protect, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});

// CREATE invoice
router.post("/", protect, async (req, res) => {
  try {
    const { customerName, productName, quantity, price } = req.body;

    if (!customerName || !productName || !quantity || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    const total = Number(quantity) * Number(price);

    const invoice = await Invoice.create({
      customer: customerName,
      product: productName,
      quantity,
      price,
      total,
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Create invoice failed" });
  }
});

// UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    const { customerName, productName, quantity, price } = req.body;
    const total = Number(quantity) * Number(price);

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        customer: customerName,
        product: productName,
        quantity,
        price,
        total,
      },
      { new: true }
    );

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ==============================
// DOWNLOAD PDF
// ==============================
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

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

    // Logo / Header
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

    doc.moveDown(2);
    doc.text("Thank you for your business!", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

module.exports = router;
