const roleAccess = {
  Dashboard: ["Admin", "User", "Sales"],
  Products: ["Admin", "User"],
  Customers: ["Admin", "Sales"],
  SalesOrders: ["Admin", "Sales"],
  GRN: ["Admin", "User"],
  Invoice: ["Admin", "Sales"],
};

export default roleAccess;
