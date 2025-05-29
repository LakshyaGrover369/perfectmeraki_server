const User = require("../models/User");

// Get user dashboard data
const getUserDashboardData = async (req, res) => {
  try {
    const totalProspects = await Prospect.countDocuments();
    const prospectsWithCallResultNull = await Prospect.countDocuments({
      Call_Result: null,
    });
    const prospectsWithCallResultCallback = await Prospect.countDocuments({
      Call_Result: "Call Back",
    });
    const prospectsWithOpenBadge = await Prospect.countDocuments({
      Badge_Status: "Open",
    });
    const prospectsWithPermanentBadge = await Prospect.countDocuments({
      Badge_Status: "Permanent",
    });
    const prospectsWithElderlyBadge = await Prospect.countDocuments({
      Badge_Status: "Elderly",
    });
    const prospectsWithGenderFemale = await Prospect.countDocuments({
      Gender: "Female",
    });
    const prospectsWithGenderMale = await Prospect.countDocuments({
      Gender: "Male",
    });

    res.status(200).json({
      success: true,
      data: {
        totalProspects,
        prospectsWithCallResultNull,
        prospectsWithCallResultCallback,
        prospectsWithOpenBadge,
        prospectsWithPermanentBadge,
        prospectsWithElderlyBadge,
        prospectsWithGenderFemale,
        prospectsWithGenderMale,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "user") {
      return res.status(400).json({ message: "User is not an user" });
    }

    res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserDashboardData,
  getAllUsers,
  deleteUser,
};
