const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", protect, getProducts);
router.post("/", protect, allowRoles("Admin", "Inventory"), createProduct);
router.put("/:id", protect, allowRoles("Admin", "Inventory"), updateProduct);
router.delete("/:id", protect, allowRoles("Admin"), deleteProduct);

module.exports = router;
