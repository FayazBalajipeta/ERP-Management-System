import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./GRN.css";

const GRN = () => {
  const [grns, setGrns] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchGRNs = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/grn", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrns(res.data);
    } catch (err) {
      console.error("FETCH GRN ERROR 👉", err);
    }
  }, [token]);

  useEffect(() => {
    fetchGRNs();
  }, [fetchGRNs]);

  const resetForm = () => {
    setVendorName("");
    setProductName("");
    setQuantityReceived("");
    setPricePerUnit("");
    setEditId(null);
  };

  const createOrUpdateGRN = async () => {
    try {
      if (!vendorName || !productName || !quantityReceived || !pricePerUnit) {
        alert("All fields required");
        return;
      }

      const payload = {
        vendorName,
        productName,
        quantityReceived: Number(quantityReceived),
        pricePerUnit: Number(pricePerUnit),
      };

      if (editId) {
        await axios.put(`http://localhost:5000/api/grn/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/grn", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchGRNs();
    } catch (err) {
      console.error("GRN ERROR 👉", err);
      alert("GRN failed");
    }
  };

  const editGRN = (g) => {
    setEditId(g._id);
    setVendorName(g.vendorName);
    setProductName(g.productName);
    setQuantityReceived(g.quantityReceived);
    setPricePerUnit(g.pricePerUnit);
  };

  const deleteGRN = async (id) => {
    if (!window.confirm("Delete this GRN?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/grn/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGRNs();
    } catch (err) {
      console.error("DELETE GRN ERROR 👉", err);
    }
  };

  return (
    <div className="grn-container">
      <h2>Goods Received Note (GRN)</h2>

      {/* ================= FORM ================= */}
      <div className="grn-form">
        <input
          placeholder="Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
        />
        <input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantityReceived}
          onChange={(e) => setQuantityReceived(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price Per Unit"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
        />

        {/* Same style as Create Order */}
        <button className="grn-create-btn" onClick={createOrUpdateGRN}>
          {editId ? "Update GRN" : "Create GRN"}
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="grn-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grns.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                No GRNs Found
              </td>
            </tr>
          ) : (
            grns.map((g) => (
              <tr key={g._id}>
                <td>{g.vendorName}</td>
                <td>{g.productName}</td>
                <td>{g.quantityReceived}</td>
                <td>₹{g.pricePerUnit}</td>
                <td>
                  ₹
                  {g.totalAmount ??
                    g.quantityReceived * g.pricePerUnit}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => editGRN(g)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteGRN(g._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GRN;
