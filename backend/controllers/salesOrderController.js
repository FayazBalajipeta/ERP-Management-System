const SalesOrder = require("../models/SalesOrder");

/* ============================= */
/* CREATE SALES ORDER            */
/* Admin + Sales                 */
/* ============================= */
exports.createSalesOrder = async (req, res) => {
  try {
    if (!["Admin", "Sales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await SalesOrder.create({
      customerName: req.body.customerName,
      productName: req.body.productName,
      quantity: req.body.quantity,
      totalAmount: req.body.totalAmount,
      status: req.body.status || "Pending",
      createdBy: req.user._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================= */
/* UPDATE SALES ORDER            */
/* Admin + Sales                 */
/* ============================= */
exports.updateSalesOrder = async (req, res) => {
  try {
    if (!["Admin", "Sales"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedOrder = await SalesOrder.findByIdAndUpdate(
      req.params.id,
      {
        customerName: req.body.customerName,
        productName: req.body.productName,
        quantity: req.body.quantity,
        totalAmount: req.body.totalAmount,
        status: req.body.status,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================= */
/* GET SALES ORDERS              */
/* Admin + Sales + Inventory     */
/* ============================= */
exports.getSalesOrders = async (req, res) => {
  try {
    if (!["Admin", "Sales", "Inventory"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await SalesOrder.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================= */
/* DELETE SALES ORDER            */
/* Admin only                    */
/* ============================= */
exports.deleteSalesOrder = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const order = await SalesOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    res.json({ message: "Sales order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
