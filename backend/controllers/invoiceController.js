const Invoice = require("../models/Invoice");

exports.createInvoice = async (req, res) => {
  try {
    const { customerName, productName, quantity, pricePerUnit } = req.body;

    if (!customerName || !productName || !quantity || !pricePerUnit) {
      return res.status(400).json({ message: "All fields required" });
    }

    const totalAmount = Number(quantity) * Number(pricePerUnit);

    const invoice = await Invoice.create({
      customerName,
      productName,
      quantity,
      pricePerUnit,
      totalAmount,
      createdBy: req.user._id,
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error("❌ CREATE INVOICE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("❌ FETCH INVOICE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
