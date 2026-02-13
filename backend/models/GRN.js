const mongoose = require("mongoose");

const grnSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    quantityReceived: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // 🔗 Optional Link to Purchase Order
    purchaseOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GRN", grnSchema);
