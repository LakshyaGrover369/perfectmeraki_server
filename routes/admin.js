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
  getWorkshopsByType,
  getLinksByName,
  createLinks,
  updateLinksByName,
  getWorkshopByType,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");
const uploadPhotoMiddleware = require("../middleware/uploadPhotoMiddleware");

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
router.post(
  "/getWorkshopsByType",
  protect,
  authorize("admin", "user"),
  getWorkshopsByType
);
router.delete("/deleteProduct/:id", protect, authorize("admin"), deleteProduct);
router.put("/editProduct/:id", protect, authorize("admin"), editProduct);
router.get("/getLinksByName", protect, authorize("admin"), getLinksByName);
router.post("/createLinks", protect, authorize("admin"), createLinks);
router.put(
  "/updateLinksByName",
  protect,
  authorize("admin"),
  updateLinksByName
);
router.get(
  "/getWorkshopByType",
  protect,
  authorize("admin", "user"),
  getWorkshopByType
);
router.post(
  "/createWorkshop",
  protect,
  authorize("admin"),
  uploadPhotoMiddleware.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  createWorkshop
);
router.put(
  "/updateWorkshop/:id",
  protect,
  authorize("admin"),
  uploadPhotoMiddleware.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  updateWorkshop
);
router.delete(
  "/deleteWorkshop/:id",
  protect,
  authorize("admin"),
  deleteWorkshop
);

module.exports = router;
