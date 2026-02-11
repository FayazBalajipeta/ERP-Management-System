import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    salesOrders: 0,
    grns: 0,
    invoices: 0,
    totalRevenue: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      const statsRes = await axios.get("http://localhost:5000/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const revenueRes = await axios.get("http://localhost:5000/api/dashboard/revenue-graph", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const lowStockRes = await axios.get("http://localhost:5000/api/dashboard/low-stock", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(statsRes.data);
      setSalesData(revenueRes.data);
      setLowStock(lowStockRes.data);
    } catch (err) {
      console.error("DASHBOARD FETCH ERROR:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000); // 🔥 real-time refresh every 5 sec
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Products</h3>
          <p>{stats.products}</p>
        </div>

        <div className="dashboard-card">
          <h3>Customers</h3>
          <p>{stats.customers}</p>
        </div>

        <div className="dashboard-card">
          <h3>Sales Orders</h3>
          <p>{stats.salesOrders}</p>
        </div>

        <div className="dashboard-card">
          <h3>GRNs</h3>
          <p>{stats.grns}</p>
        </div>

        <div className="dashboard-card">
          <h3>Invoices</h3>
          <p>{stats.invoices}</p>
        </div>

        <div className="dashboard-card revenue">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Revenue Graph</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#1e3c72" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Low Stock Alert</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={lowStock}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
