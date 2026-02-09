const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createInvoice,
  getInvoices,
} = require("../controllers/invoiceController");

router.post("/", protect, createInvoice);
router.get("/", protect, getInvoices);

module.exports = router;
