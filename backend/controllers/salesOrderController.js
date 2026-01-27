const SalesOrder = require("../models/SalesOrder");

exports.createSalesOrder = async (req, res) => {
  const order = await SalesOrder.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(201).json(order);
};

exports.getSalesOrders = async (req, res) => {
  const orders = await SalesOrder.find()
    .populate("products.product")
    .populate("createdBy", "name");
  res.json(orders);
};
