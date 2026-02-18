import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./SalesOrders.css";

// ✅ API Base URL (local + deployed)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const isAdmin = role === "Admin";
  const isSales = role === "Sales";

  /* ============================= */
  /* Fetch Orders                  */
  /* ============================= */
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sales-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("FETCH SALES ORDERS ERROR:", err.response?.data || err.message);
      alert("Failed to load sales orders");
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ============================= */
  /* Create / Update Order         */
  /* ============================= */
  const saveOrder = async () => {
    if (!customerName || !productName || !quantity || !totalAmount) {
      alert("All fields are required");
      return;
    }

    const payload = {
      customerName,
      productName,
      quantity: Number(quantity),
      totalAmount: Number(totalAmount),
    };

    try {
      setLoading(true);

      if (editId) {
        // UPDATE
        await axios.put(
          `${API_BASE_URL}/api/sales-orders/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // CREATE
        await axios.post(
          `${API_BASE_URL}/api/sales-orders`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      clearForm();
      fetchOrders();
    } catch (err) {
      console.error("SAVE SALES ORDER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save order");
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* Edit Order                    */
  /* ============================= */
  const editOrder = (order) => {
    if (!isAdmin && !isSales) return;

    setEditId(order._id);
    setCustomerName(order.customerName);
    setProductName(order.productName);
    setQuantity(order.quantity);
    setTotalAmount(order.totalAmount);
  };

  /* ============================= */
  /* Delete Order (Admin only)     */
  /* ============================= */
  const deleteOrder = async (id) => {
    if (!isAdmin) {
      alert("Only Admin can delete sales orders");
      return;
    }

    if (!window.confirm("Delete order?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/sales-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("DELETE SALES ORDER ERROR:", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  /* ============================= */
  /* Clear Form                    */
  /* ============================= */
  const clearForm = () => {
    setEditId(null);
    setCustomerName("");
    setProductName("");
    setQuantity("");
    setTotalAmount("");
  };

  return (
    <div className="sales-orders-container">
      <h2>Sales Orders</h2>

      {/* ============================= */}
      {/* CREATE / UPDATE FORM          */}
      {/* ============================= */}
      {(isAdmin || isSales) && (
        <div className="sales-form">
          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="number"
            placeholder="Total Amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />

          <button onClick={saveOrder} disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Order" : "Create Order"}
          </button>

          {editId && (
            <button
              style={{
                background: "#6b7280",
                color: "white",
                borderRadius: "6px",
                height: "42px",
                cursor: "pointer",
              }}
              onClick={clearForm}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* ============================= */}
      {/* ORDERS TABLE                 */}
      {/* ============================= */}
      <table className="sales-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
            {(isAdmin || isSales) && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                No Sales Orders
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id}>
                <td>{o.customerName}</td>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>₹{o.totalAmount}</td>
                <td>{o.status || "Pending"}</td>

                {(isAdmin || isSales) && (
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => editOrder(o)}
                    >
                      Edit
                    </button>

                    {isAdmin && (
                      <button
                        className="delete-btn"
                        onClick={() => deleteOrder(o._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesOrders;
