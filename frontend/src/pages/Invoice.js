import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Invoice.css";

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [editId, setEditId] = useState(null);

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
    try {
      const res = await axios.get("http://localhost:5000/api/invoice", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      console.error("FETCH INVOICE ERROR:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // =========================
  // Create / Update
  // =========================
  const handleSubmit = async () => {
    try {
      if (!form.customerName || !form.productName || !form.quantity || !form.price) {
        alert("All fields required");
        return;
      }

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/invoice/${editId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/invoice", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        customerName: "",
        productName: "",
        quantity: "",
        price: "",
      });

      setEditId(null);
      fetchInvoices();
    } catch (err) {
      console.error("CREATE/UPDATE INVOICE ERROR:", err);
      alert("Invoice failed. Check backend logs.");
    }
  };

  // =========================
  // Edit
  // =========================
  const handleEdit = (invoice) => {
    setEditId(invoice._id);
    setForm({
      customerName: invoice.customer || "",
      productName: invoice.product || "",
      quantity: invoice.quantity?.toString() || "",
      price: invoice.price?.toString() || "",
    });
  };

  // =========================
  // Delete
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInvoices();
    } catch (err) {
      console.error("DELETE INVOICE ERROR:", err);
    }
  };

  // =========================
  // PDF Download
  // =========================
  const downloadPDF = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/invoice/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF DOWNLOAD ERROR:", err);
      alert("PDF download failed");
    }
  };

  return (
    <div className="invoice-container">
      <h2>Invoice</h2>

      {/* ========================= */}
      {/* Form */}
      {/* ========================= */}
      <div className="invoice-form">
        <input
          placeholder="Customer Name"
          value={form.customerName}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
        />
        <input
          placeholder="Product Name"
          value={form.productName}
          onChange={(e) =>
            setForm({ ...form, productName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
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

      {/* ========================= */}
      {/* Table */}
      {/* ========================= */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>PDF</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">No Invoices</td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.customer}</td>
                <td>{inv.product}</td>
                <td>{inv.quantity}</td>
                <td>₹{inv.total}</td>
                <td>
                  <button className="download-btn" onClick={() => downloadPDF(inv._id)}>
                    Download
                  </button>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(inv)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(inv._id)}>
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

export default Invoice;
