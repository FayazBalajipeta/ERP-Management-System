const router = require("express").Router();
const { createGRN } = require("../controllers/grnController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/", protect, allowRoles("Inventory", "Admin"), createGRN);

module.exports = router;
