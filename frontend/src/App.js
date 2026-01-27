import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import SalesOrders from "./pages/SalesOrders";
import GRN from "./pages/GRN";
import Customers from "./pages/Customers";
import Invoice from "./pages/Invoice";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="app-content">
        {children}
      </div>
    </>
  );
};


function App() {
  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

       <Route
  path="/products"
  element={
    <ProtectedRoute roles={["admin", "inventory", "sales"]}>
      <AppLayout>
        <Products />
      </AppLayout>
    </ProtectedRoute>
  }
/>


        <Route
          path="/sales-orders"
          element={
            <ProtectedRoute roles={["Sales", "Admin", "Inventory"]}>
              <AppLayout>
                <SalesOrders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute roles={["Sales", "Admin"]}>
              <AppLayout>
                <Customers />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/grn"
          element={
            <ProtectedRoute roles={["Inventory", "Admin"]}>
              <AppLayout>
                <GRN />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice"
          element={
            <ProtectedRoute roles={["Admin"]}>
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
