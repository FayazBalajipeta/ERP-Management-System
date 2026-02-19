import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PurchaseOrders.css";

// ✅ API Base URL (Vercel env + Render fallback)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://erp-management-system-071t.onrender.com";

function PurchaseOrders() {
  const [supplierName, setSupplierName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Safe user role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const isAdmin = role === "Admin";
  const isUser = role === "User";

  // ================= FETCH PURCHASE ORDERS =================
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/purchase-orders`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("FETCH PO ERROR:", err.response?.data || err.message);
      alert("❌ Failed to load purchase orders");
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= CREATE / UPDATE =================
  const createOrUpdateOrder = async () => {
    if (!supplierName || !productName || !quantity) {
      alert("All fields required");
      return;
    }

    const payload = {
      supplierName,
      productName,
      quantity: Number(quantity),
      status,
    };

    try {
      if (editId) {
        await axios.put(
          `${API_BASE_URL}/api/purchase-orders/${editId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/purchase-orders`, payload, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }

      clearForm();
      fetchOrders();
    } catch (err) {
      console.error("CREATE/UPDATE PO ERROR:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "❌ You are not allowed to perform this action"
      );
    }
  };

  // ================= EDIT =================
  const editOrder = (order) => {
    if (!isAdmin && !isUser) {
      alert("You are not allowed to edit purchase orders");
      return;
    }

    setSupplierName(order.supplier);
    setProductName(order.product);
    setQuantity(order.quantity?.toString());
    setStatus(order.status);
    setEditId(order._id);
  };

  // ================= DELETE (Admin only) =================
  const deleteOrder = async (id) => {
    if (!isAdmin) {
      alert("Only Admin can delete purchase orders");
      return;
    }

    if (!window.confirm("Delete this Purchase Order?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/purchase-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchOrders();
    } catch (err) {
      console.error("DELETE PO ERROR:", err.response?.data || err.message);
      alert("❌ Delete failed");
    }
  };

  const clearForm = () => {
    setSupplierName("");
    setProductName("");
    setQuantity("");
    setStatus("Pending");
    setEditId(null);
  };

  return (
    <div className="po-container">
      <h2>Purchase Orders</h2>

      {/* ================= FORM ================= */}
      {(isAdmin || isUser) && (
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button className="po-create-btn" onClick={createOrUpdateOrder}>
            {editId ? "Update Purchase Order" : "Create Purchase Order"}
          </button>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <table className="po-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
            <th>GRN</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
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
                        : order.status === "Received"
                        ? "approved"
                        : "pending"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </td>

                {/* 🔗 LINK TO GRN */}
                <td>
                  {order.status !== "Received" ? (
                    <button
                      className="link-btn"
                      onClick={() =>
                        navigate("/grn", {
                          state: {
                            purchaseOrderId: order._id,
                            vendorName: order.supplier,
                            productName: order.product,
                            quantity: order.quantity,
                          },
                        })
                      }
                    >
                      Create GRN
                    </button>
                  ) : (
                    <span className="completed-text">Completed</span>
                  )}
                </td>

                <td>
                  {(isAdmin || isUser) && (
                    <button
                      className="edit-btn"
                      onClick={() => editOrder(order)}
                    >
                      Edit
                    </button>
                  )}

                  {/* ✅ Delete only for Admin */}
                  {isAdmin && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(order._id)}
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
}

export default PurchaseOrders;
