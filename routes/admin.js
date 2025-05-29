const express = require("express");
const router = express.Router();
const {
  getAdminDashboardData,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

// Routes
router.get(
  "/getAdminDashboardData",
  protect,
  authorize("admin"),
  getAdminDashboardData
);
router.post("/create", protect, authorize("admin"), createAdmin);
router.get("/getAllAdmins", protect, authorize("admin"), getAllAdmins);
router.delete("/delete/:id", protect, authorize("admin"), deleteAdmin);

module.exports = router;
