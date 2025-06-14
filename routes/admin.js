const express = require("express");
const router = express.Router();
const {
  getAdminDashboardData,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  createProduct,
  getProductsByType,
  deleteProduct,
  editProduct,
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
router.post("/createProduct", protect, authorize("admin"), createProduct);
router.get(
  "/getProductsByType",
  protect,
  authorize("admin"),
  getProductsByType
);
router.delete("/deleteProduct/:id", protect, authorize("admin"), deleteProduct);
router.put("/editProduct/:id", protect, authorize("admin"), editProduct);

module.exports = router;
