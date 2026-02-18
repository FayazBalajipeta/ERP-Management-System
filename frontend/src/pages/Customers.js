import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Customers.css";

// ✅ API base URL (works for both local + production)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔐 Get role from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const isAdmin = role === "Admin";
  const isSales = role === "Sales";

  // =========================
  // Fetch customers
  // =========================
  const fetchCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("FETCH CUSTOMERS ERROR:", err.response?.data || err.message);
      alert("Failed to load customers");
    }
  }, [token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // =========================
  // Add / Update customer
  // =========================
  const saveCustomer = async () => {
    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    const payload = { name, email, phone, address };

    try {
      if (editId) {
        await axios.put(
          `${API_BASE_URL}/api/customers/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/customers`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      clearForm();
      fetchCustomers();
    } catch (err) {
      console.error("SAVE CUSTOMER ERROR:", err.response?.data || err.message);

      if (err.response?.status === 403) {
        alert("❌ You don’t have permission to do this");
      } else {
        alert("❌ Failed to save customer");
      }
    }
  };

  // =========================
  // Edit
  // =========================
  const editCustomer = (c) => {
    setEditId(c._id);
    setName(c.name || "");
    setEmail(c.email || "");
    setPhone(c.phone || "");
    setAddress(c.address || "");
  };

  // =========================
  // Delete (Admin only)
  // =========================
  const deleteCustomer = async (id) => {
    if (!isAdmin) {
      alert("❌ Only Admin can delete customers");
      return;
    }

    if (!window.confirm("Delete customer?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
    } catch (err) {
      console.error("DELETE CUSTOMER ERROR:", err.response?.data || err.message);
      alert("❌ Delete failed");
    }
  };

  const clearForm = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  return (
    <div className="customers-container">
      <h2>Customers</h2>

      {/* ================= FORM ================= */}
      {(isAdmin || isSales) && (
        <div className="customer-form">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button onClick={saveCustomer}>
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button className="cancel-btn" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>
      )}

      {/* ================= TABLE ================= */}
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No customers found
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
                <td>
                  {(isAdmin || isSales) && (
                    <button
                      className="action-btn edit-btn"
                      onClick={() => editCustomer(c)}
                    >
                      Edit
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteCustomer(c._id)}
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

export default Customers;
