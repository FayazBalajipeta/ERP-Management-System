import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./PurchaseOrders.css";

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/purchase-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrUpdate = async () => {
    if (!vendorName || !productName || !quantity || !pricePerUnit) {
      alert("All fields required");
      return;
    }

    const payload = { vendorName, productName, quantity, pricePerUnit };

    if (editId) {
      await axios.put(`http://localhost:5000/api/purchase-orders/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post("http://localhost:5000/api/purchase-orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setVendorName("");
    setProductName("");
    setQuantity("");
    setPricePerUnit("");
    setEditId(null);
    fetchOrders();
  };

  const editOrder = (o) => {
    setEditId(o._id);
    setVendorName(o.vendorName);
    setProductName(o.productName);
    setQuantity(o.quantity);
    setPricePerUnit(o.pricePerUnit);
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this PO?")) return;
    await axios.delete(`http://localhost:5000/api/purchase-orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  };

  return (
    <div className="purchase-orders-container">
      <h2>Purchase Orders</h2>

      <div className="po-form">
        <input placeholder="Vendor Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
        <input placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <input type="number" placeholder="Qty" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input type="number" placeholder="Price Per Unit" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} />
      </div>

      <button className="po-create-btn" onClick={createOrUpdate}>
        {editId ? "Update PO" : "Create PO"}
      </button>

      <table className="po-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.vendorName}</td>
              <td>{o.productName}</td>
              <td>{o.quantity}</td>
              <td>₹{o.pricePerUnit}</td>
              <td>₹{o.totalAmount}</td>
              <td>{o.status}</td>
              <td>
                <button className="edit-btn" onClick={() => editOrder(o)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteOrder(o._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrders;
