const express = require("express");
const router = express.Router();
const {
  getUserDashboardData,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// Routes
router.get(
  "/getUserDashboardData",
  protect,
  authorize("admin"),
  getUserDashboardData
);
router.get("/getAllUsers", protect, authorize("admin"), getAllUsers);
router.delete("/delete/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
