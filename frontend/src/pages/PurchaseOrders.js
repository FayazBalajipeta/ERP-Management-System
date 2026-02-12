import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./PurchaseOrders.css";

function PurchaseOrders() {
  const [supplierName, setSupplierName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("FETCH PO ERROR:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrUpdateOrder = async () => {
    if (!supplierName || !productName || !quantity) {
      alert("All fields required");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/purchase-orders/${editId}`,
          { supplierName, productName, quantity, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/purchase-orders",
          { supplierName, productName, quantity, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSupplierName("");
      setProductName("");
      setQuantity("");
      setStatus("Pending");
      setEditId(null);
      fetchOrders();
    } catch (err) {
      console.error("CREATE/UPDATE PO ERROR:", err);
    }
  };

  const editOrder = (order) => {
    setSupplierName(order.supplier);
    setProductName(order.product);
    setQuantity(order.quantity);
    setStatus(order.status);
    setEditId(order._id);
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/purchase-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("DELETE PO ERROR:", err);
    }
  };

  return (
    <div className="po-container">
      <h2>Purchase Orders</h2>

      <div className="po-form">
        <input
          placeholder="Supplier Name"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
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
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <button className="po-create-btn" onClick={createOrUpdateOrder}>
          {editId ? "Update Purchase Order" : "Create Purchase Order"}
        </button>
      </div>

      <table className="po-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No Purchase Orders
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.supplier}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>
                  <span
                    className={`status-pill ${
                      order.status === "Approved"
                        ? "approved"
                        : order.status === "Rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => editOrder(order)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order._id)}
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
}

export default PurchaseOrders;
