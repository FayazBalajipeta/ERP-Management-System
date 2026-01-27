import React from "react";
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

const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 18000 },
  { month: "Mar", sales: 15000 },
  { month: "Apr", sales: 22000 },
  { month: "May", sales: 28000 },
  { month: "Jun", sales: 45000 },
];

const stockData = [
  { name: "Mobiles", stock: 20 },
  { name: "Laptops", stock: 12 },
  { name: "Headphones", stock: 30 },
  { name: "Keyboards", stock: 8 },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* ================= CARDS ================= */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p>120</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Sales</h3>
          <p>₹45,000</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Orders</h3>
          <p>8</p>
        </div>

        <div className="dashboard-card">
          <h3>Low Stock Items</h3>
          <p>5</p>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="dashboard-charts">
        {/* SALES LINE CHART */}
        <div className="chart-card">
          <h3>Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#1e3c72"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* STOCK BAR CHART */}
        <div className="chart-card">
          <h3>Stock Levels</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
