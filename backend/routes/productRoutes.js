const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/*
  Role Access:
  - View Products  → Admin, User, Sales
  - Create Product → Admin, User
  - Update Product → Admin, User
  - Delete Product → Admin only
*/

router.get("/", protect, authorizeRoles("Admin", "User", "Sales"), getProducts);

router.post("/", protect, authorizeRoles("Admin", "User"), createProduct);

router.put("/:id", protect, authorizeRoles("Admin", "User"), updateProduct);

router.delete("/:id", protect, authorizeRoles("Admin"), deleteProduct);

module.exports = router;
