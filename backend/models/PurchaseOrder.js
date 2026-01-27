const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplierName: String,
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ["Ordered", "Received"],
      default: "Ordered",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
