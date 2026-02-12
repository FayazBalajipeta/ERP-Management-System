const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplier: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Received"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
