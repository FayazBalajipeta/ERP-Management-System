const Product = require("../models/Product");
const Customer = require("../models/Customer");
const SalesOrder = require("../models/SalesOrder");
const GRN = require("../models/GRN");
const Invoice = require("../models/Invoice");

exports.getDashboardStats = async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const customers = await Customer.countDocuments();
    const salesOrders = await SalesOrder.countDocuments();
    const grns = await GRN.countDocuments();
    const invoices = await Invoice.countDocuments();

    res.json({
      products,
      customers,
      salesOrders,
      grns,
      invoices,
    });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
