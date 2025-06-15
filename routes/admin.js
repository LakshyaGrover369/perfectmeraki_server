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
const upload = require("../middleware/uploadPhotoMiddleware");

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
router.post(
  "/createProduct",
  protect,
  authorize("admin"),
  (req, res, next) => {
    uploadPhotoMiddleware.single("image")(req, res, function (err) {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ message: err.message });
      } else {
        console.log("Multer success:", req.file); // Log the file information
      }
      next();
    });
  },
  createProduct
);
router.post(
  "/getProductsByType",
  protect,
  authorize("admin", "user"),
  getProductsByType
);
router.delete("/deleteProduct/:id", protect, authorize("admin"), deleteProduct);
router.put("/editProduct/:id", protect, authorize("admin"), editProduct);

module.exports = router;
