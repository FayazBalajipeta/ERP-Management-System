const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =============================
// Middlewares
// =============================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Allow Vercel URL in prod
    credentials: true,
  })
);
app.use(express.json());

// =============================
// MongoDB Connection
// =============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// =============================
// Routes
// =============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/sales-orders", require("./routes/salesOrderRoutes"));
app.use("/api/grn", require("./routes/grnRoutes"));
app.use("/api/invoice", require("./routes/invoiceRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/purchase-orders", require("./routes/purchaseOrderRoutes"));

// =============================
// Health Check
// =============================
app.get("/", (req, res) => {
  res.status(200).send("🚀 SmartERP Backend is running!");
});

// =============================
// 404 Handler
// =============================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =============================
// Global Error Handler
// =============================
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
  });
});

// =============================
// Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
