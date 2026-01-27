const GRN = require("../models/GRN");
const Product = require("../models/Product");

exports.createGRN = async (req, res) => {
  const grn = await GRN.create(req.body);

  // Update stock
  for (let item of req.body.receivedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  res.status(201).json(grn);
};

