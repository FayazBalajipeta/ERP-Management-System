import React, { useState } from "react";
import axios from "axios";

const GRN = () => {
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const token = localStorage.getItem("token");

  const submitGRN = async () => {
    if (!purchaseOrderId) {
      alert("Enter Purchase Order ID");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/grn",
        {
          purchaseOrder: purchaseOrderId,
          receivedItems: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("GRN created successfully");
      setPurchaseOrderId("");
    } catch {
      alert("Failed to create GRN");
    }
  };

  return (
    <div className="products-container">
      <h2>Goods Receipt Note (GRN)</h2>

      <input
        placeholder="Purchase Order ID"
        value={purchaseOrderId}
        onChange={(e) => setPurchaseOrderId(e.target.value)}
      />

      <button onClick={submitGRN} style={{ marginLeft: 10 }}>
        Create GRN
      </button>
    </div>
  );
};

export default GRN;
