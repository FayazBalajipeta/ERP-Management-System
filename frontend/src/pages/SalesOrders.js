import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./SalesOrders.css";

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  /* ============================= */
  /* Fetch Orders                  */
  /* ============================= */
  const fetchOrders = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/sales-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
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
      quantity,
      totalAmount,
    };

    if (editId) {
      // UPDATE
      await axios.put(
        `http://localhost:5000/api/sales-orders/${editId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      // CREATE
      await axios.post(
        "http://localhost:5000/api/sales-orders",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    clearForm();
    fetchOrders();
  };

  /* ============================= */
  /* Edit Order                    */
  /* ============================= */
  const editOrder = (order) => {
    setEditId(order._id);
    setCustomerName(order.customerName);
    setProductName(order.productName);
    setQuantity(order.quantity);
    setTotalAmount(order.totalAmount);
  };

  /* ============================= */
  /* Delete Order                  */
  /* ============================= */
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete order?")) return;

    await axios.delete(`http://localhost:5000/api/sales-orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchOrders();
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
      {(user.role === "Admin" || user.role === "Sales") && (
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

          <button onClick={saveOrder}>
            {editId ? "Update Order" : "Create Order"}
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
            {(user.role === "Admin" || user.role === "Sales") && (
              <th>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.customerName}</td>
              <td>{o.productName}</td>
              <td>{o.quantity}</td>
              <td>₹{o.totalAmount}</td>
              <td>{o.status || "Pending"}</td>

              {(user.role === "Admin" || user.role === "Sales") && (
                <td>
                  <button
                    className="edit-btn"
                    style={{
                      background: "#ffc107",
                      border: "none",
                      padding: "6px 12px",
                      marginRight: "8px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => editOrder(o)}
                  >
                    Edit
                  </button>

                  {user.role === "Admin" && (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesOrders;
