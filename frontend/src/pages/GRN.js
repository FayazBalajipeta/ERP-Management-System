import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./GRN.css";

// ✅ API Base URL (works in local + Vercel)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const GRN = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [grns, setGrns] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Safe user parsing
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const isAdmin = role === "Admin";

  // ================================
  // Prefill when coming from PO page
  // ================================
  useEffect(() => {
    if (location.state?.purchaseOrderId) {
      setPurchaseOrderId(location.state.purchaseOrderId || null);
      setVendorName(location.state.vendorName || "");
      setProductName(location.state.productName || "");
      setQuantityReceived(location.state.quantity?.toString() || "");
    }
  }, [location.state]);

  // ================================
  // Fetch GRNs
  // ================================
  const fetchGRNs = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/grn`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrns(res.data);
    } catch (err) {
      console.error("FETCH GRN ERROR 👉", err.response?.data || err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchGRNs();
  }, [fetchGRNs]);

  // ================================
  // Reset Form
  // ================================
  const resetForm = () => {
    setVendorName("");
    setProductName("");
    setQuantityReceived("");
    setPricePerUnit("");
    setPurchaseOrderId(null);
    setEditId(null);
  };

  // ================================
  // Create / Update GRN
  // ================================
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
        purchaseOrderId: purchaseOrderId || null,
      };

      if (editId) {
        await axios.put(`${API_BASE_URL}/api/grn/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/grn`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchGRNs();
      navigate("/grn", { replace: true });
    } catch (err) {
      console.error("GRN ERROR 👉", err.response?.data || err.message);
      alert(err.response?.data?.message || "GRN failed");
    }
  };

  // ================================
  // Edit GRN (Admin only UI-wise)
  // ================================
  const editGRN = (g) => {
    setEditId(g._id);
    setVendorName(g.vendorName || "");
    setProductName(g.productName || "");
    setQuantityReceived(g.quantityReceived?.toString() || "");
    setPricePerUnit(g.pricePerUnit?.toString() || "");
    setPurchaseOrderId(g.purchaseOrderId || null);
  };

  // ================================
  // Delete GRN (Admin only)
  // ================================
  const deleteGRN = async (id) => {
    if (!isAdmin) {
      alert("Only Admin can delete GRNs");
      return;
    }

    if (!window.confirm("Delete this GRN?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/grn/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGRNs();
    } catch (err) {
      console.error("DELETE GRN ERROR 👉", err.response?.data || err.message);
      alert("Delete failed");
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

        {purchaseOrderId && (
          <div className="linked-po">
            Linked PO ID: <b>{purchaseOrderId}</b>
          </div>
        )}

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
            <th>Linked PO</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grns.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
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
                <td>₹{g.totalAmount ?? g.quantityReceived * g.pricePerUnit}</td>
                <td>{g.purchaseOrderId ? "Linked" : "Manual"}</td>
                <td>
                  <button className="edit-btn" onClick={() => editGRN(g)}>
                    Edit
                  </button>

                  {isAdmin && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteGRN(g._id)}
                    >
                      Delete
                    </button>
                  )}
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
