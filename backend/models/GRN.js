const mongoose = require("mongoose");

const grnSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true },
    productName: { type: String, required: true },
    quantityReceived: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GRN", grnSchema);
