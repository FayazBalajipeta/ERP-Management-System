import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./Invoice.css";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");

  const token = localStorage.getItem("token");

  // ✅ FIXED: useCallback to remove warning
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

  const createInvoice = async () => {
    if (!customerName || !productName || !quantity || !pricePerUnit) {
      alert("All fields required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/invoice",
        {
          customerName,
          productName,
          quantity: Number(quantity),
          pricePerUnit: Number(pricePerUnit),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomerName("");
      setProductName("");
      setQuantity("");
      setPricePerUnit("");

      fetchInvoices();
    } catch (err) {
      console.error("CREATE INVOICE ERROR:", err);
      alert("Invoice creation failed");
    }
  };

  const downloadPDF = (invoice) => {
    const doc = new jsPDF();
    doc.text("SmartERP Invoice", 20, 20);
    doc.text(`Customer: ${invoice.customerName}`, 20, 40);
    doc.text(`Product: ${invoice.productName}`, 20, 50);
    doc.text(`Quantity: ${invoice.quantity}`, 20, 60);
    doc.text(`Price: ₹${invoice.pricePerUnit}`, 20, 70);
    doc.text(`Total: ₹${invoice.totalAmount}`, 20, 80);
    doc.save(`invoice-${invoice._id}.pdf`);
  };

  return (
    <div className="invoice-container">
      <h2>Invoice</h2>

      <div className="invoice-form">
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
          placeholder="Price Per Unit"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
        />
        <button className="invoice-create-btn" onClick={createInvoice}>
  Create Invoice
</button>

      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((i) => (
            <tr key={i._id}>
              <td>{i.customerName}</td>
              <td>{i.productName}</td>
              <td>{i.quantity}</td>
              <td>₹{i.totalAmount}</td>
              <td>
                <button onClick={() => downloadPDF(i)}>Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;
