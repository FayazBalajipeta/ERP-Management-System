import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/customers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCustomers(res.data);
  }, [token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Add / Update customer
  const saveCustomer = async () => {
    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    const payload = { name, email, phone, address };

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/customers/${editId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/customers",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    clearForm();
    fetchCustomers();
  };

  const editCustomer = (c) => {
    setEditId(c._id);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setAddress(c.address);
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete customer?")) return;

    await axios.delete(`http://localhost:5000/api/customers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCustomers();
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

      {/* FORM */}
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

      {/* TABLE */}
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
          {customers.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => editCustomer(c)}
                >
                  Edit
                </button>

                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteCustomer(c._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
