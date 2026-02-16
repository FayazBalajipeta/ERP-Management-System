import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import SalesOrders from "./pages/SalesOrders";
import GRN from "./pages/GRN";
import Customers from "./pages/Customers";
import Invoice from "./pages/Invoice";
import PurchaseOrders from "./pages/PurchaseOrders";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} toggle={() => setSidebarOpen((o) => !o)} />

      <div className={`app-content ${sidebarOpen ? "with-sidebar" : "full"}`}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ===================== */}
        {/* Public Routes         */}
        {/* ===================== */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ===================== */}
        {/* Protected Routes      */}
        {/* ===================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["Admin", "User", "Sales"]}>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute roles={["Admin", "User"]}>
              <AppLayout>
                <Products />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute roles={["Admin", "Sales"]}>
              <AppLayout>
                <Customers />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-orders"
          element={
            <ProtectedRoute roles={["Admin", "Sales"]}>
              <AppLayout>
                <SalesOrders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-orders"
          element={
            <ProtectedRoute roles={["Admin", "User"]}>
              <AppLayout>
                <PurchaseOrders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/grn"
          element={
            <ProtectedRoute roles={["Admin", "User"]}>
              <AppLayout>
                <GRN />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice"
          element={
            <ProtectedRoute roles={["Admin", "Sales"]}>
              <AppLayout>
                <Invoice />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
