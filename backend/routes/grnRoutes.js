const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createGRN,
  getGRNs,
  deleteGRN,
  updateGRN,
} = require("../controllers/grnController");

router.post("/", protect, createGRN);
router.get("/", protect, getGRNs);
router.put("/:id", protect, updateGRN);
router.delete("/:id", protect, deleteGRN);

module.exports = router;
