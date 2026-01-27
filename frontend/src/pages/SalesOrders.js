import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sales-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => alert("Failed to load sales orders"));
  }, [token]);

  return (
    <div className="products-container">
      <h2>Sales Orders</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.customerName}</td>
              <td>₹{o.totalAmount}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesOrders;
