const GRN = require("../models/GRN");
const Product = require("../models/Product");

// CREATE GRN
exports.createGRN = async (req, res) => {
  try {
    const { vendorName, productName, quantityReceived, pricePerUnit } = req.body;

    if (!vendorName || !productName || !quantityReceived || !pricePerUnit) {
      return res.status(400).json({ message: "All fields required" });
    }

    const totalAmount =
      Number(quantityReceived) * Number(pricePerUnit);

    // Save GRN
    const grn = await GRN.create({
      vendorName,
      productName,
      quantityReceived: Number(quantityReceived),
      pricePerUnit: Number(pricePerUnit),
      totalAmount,
      receivedBy: req.user._id,
    });

    // 🔥 Auto Stock Update + Auto Product Create
    let product = await Product.findOne({ title: productName });

    if (product) {
      product.stock += Number(quantityReceived);
      await product.save();
    } else {
      await Product.create({
        title: productName,               // required
        sku: "SKU-" + Date.now(),         // auto generate
        price: Number(pricePerUnit),
        stock: Number(quantityReceived),
      });
    }

    res.status(201).json(grn);
  } catch (err) {
    console.error("❌ GRN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL GRNs
exports.getGRNs = async (req, res) => {
  try {
    const grns = await GRN.find().sort({ createdAt: -1 });
    res.json(grns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE GRN
exports.deleteGRN = async (req, res) => {
  try {
    await GRN.findByIdAndDelete(req.params.id);
    res.json({ message: "GRN deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE GRN
exports.updateGRN = async (req, res) => {
  try {
    const { vendorName, productName, quantityReceived, pricePerUnit } = req.body;

    const totalAmount =
      Number(quantityReceived) * Number(pricePerUnit);

    const updated = await GRN.findByIdAndUpdate(
      req.params.id,
      {
        vendorName,
        productName,
        quantityReceived: Number(quantityReceived),
        pricePerUnit: Number(pricePerUnit),
        totalAmount,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
