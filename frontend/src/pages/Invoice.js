import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Invoice.css";

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [editId, setEditId] = useState(null);
  const [salesOrderId, setSalesOrderId] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    productName: "",
    quantity: "",
    price: "",
  });

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Invoices
  // =========================
  const fetchInvoices = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/invoice", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInvoices(res.data);
  }, [token]);

  // =========================
  // Fetch Sales Orders
  // =========================
  const fetchSalesOrders = useCallback(async () => {
    const res = await axios.get("http://localhost:5000/api/sales-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSalesOrders(res.data);
  }, [token]);

  useEffect(() => {
    fetchInvoices();
    fetchSalesOrders();
  }, [fetchInvoices, fetchSalesOrders]);

  // =========================
  // Auto Prefill on Sales Order Select
  // =========================
  const handleSalesOrderSelect = (e) => {
    const soId = e.target.value;
    setSalesOrderId(soId);

    const so = salesOrders.find((o) => o._id === soId);
    if (so) {
      setForm({
        customerName: so.customerName,
        productName: so.productName,
        quantity: so.quantity,
        price: "",
      });
    }
  };

  // =========================
  // Create / Update
  // =========================
  const handleSubmit = async () => {
    if (!form.customerName || !form.productName || !form.quantity || !form.price) {
      alert("All fields required");
      return;
    }

    const payload = {
      ...form,
      salesOrderId: salesOrderId || null,
    };

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/invoice/${editId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post("http://localhost:5000/api/invoice", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setForm({
      customerName: "",
      productName: "",
      quantity: "",
      price: "",
    });
    setSalesOrderId("");
    setEditId(null);
    fetchInvoices();
  };

  // =========================
  // Edit
  // =========================
  const handleEdit = (invoice) => {
    setEditId(invoice._id);
    setSalesOrderId(invoice.salesOrderId?._id || "");
    setForm({
      customerName: invoice.customer,
      productName: invoice.product,
      quantity: invoice.quantity,
      price: invoice.price,
    });
  };

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    await axios.delete(`http://localhost:5000/api/invoice/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchInvoices();
  };

  // =========================
  // PDF Download
  // =========================
  const downloadPDF = async (id) => {
    const res = await fetch(`http://localhost:5000/api/invoice/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    a.click();
  };

  return (
    <div className="invoice-container">
      <h2 className="page-title">Invoice</h2>

      {/* ================= FORM ================= */}
      <div className="invoice-form professional-card">
        <select value={salesOrderId} onChange={handleSalesOrderSelect}>
          <option value="">Link to Sales Order (optional)</option>
          {salesOrders.map((so) => (
            <option key={so._id} value={so._id}>
              {so.customerName} - {so.productName}
            </option>
          ))}
        </select>

        <input
          placeholder="Customer Name"
          value={form.customerName}
          disabled={!!salesOrderId}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
        />

        <input
          placeholder="Product Name"
          value={form.productName}
          disabled={!!salesOrderId}
          onChange={(e) =>
            setForm({ ...form, productName: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          disabled={!!salesOrderId}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price Per Unit"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <button className="invoice-create-btn" onClick={handleSubmit}>
          {editId ? "Update Invoice" : "Create Invoice"}
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="invoice-table professional-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Linked SO</th>
            <th>PDF</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">No Invoices</td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.customer}</td>
                <td>{inv.product}</td>
                <td>{inv.quantity}</td>
                <td>₹{inv.total}</td>
                <td>{inv.salesOrderId ? "Linked" : "Manual"}</td>
                <td>
                  <button className="download-btn" onClick={() => downloadPDF(inv._id)}>
                    Download
                  </button>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(inv)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(inv._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Invoice;
