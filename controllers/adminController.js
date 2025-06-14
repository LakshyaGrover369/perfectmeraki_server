const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Get admin dashboard data
const getAdminDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });

    const totalProspects = await Prospect.countDocuments();
    const totalMaleProspects = await Prospect.countDocuments({
      Gender: "Male",
    });
    const totalFemaleProspects = await Prospect.countDocuments({
      Gender: "Female",
    });

    const totalMaleOpenBadge = await Prospect.countDocuments({
      Gender: "Male",
      Badge_Status: "Open",
    });
    const totalFemaleOpenBadge = await Prospect.countDocuments({
      Gender: "Female",
      Badge_Status: "Open",
    });

    const totalMalePermanentBadge = await Prospect.countDocuments({
      Gender: "Male",
      Badge_Status: "Permanent",
    });
    const totalFemalePermanentBadge = await Prospect.countDocuments({
      Gender: "Female",
      Badge_Status: "Permanent",
    });

    const totalMaleElderlyBadge = await Prospect.countDocuments({
      Gender: "Male",
      Badge_Status: "Elderly",
    });
    const totalFemaleElderlyBadge = await Prospect.countDocuments({
      Gender: "Female",
      Badge_Status: "Elderly",
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        totalProspects,
        totalMaleProspects,
        totalFemaleProspects,
        totalMaleOpenBadge,
        totalFemaleOpenBadge,
        totalMalePermanentBadge,
        totalFemalePermanentBadge,
        totalMaleElderlyBadge,
        totalFemaleElderlyBadge,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, BatchNumber } = req.body;

    // Check if admin exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email" });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      phoneNumber,
      password,
      BatchNumber,
      role: "admin", // Set role as admin
    });

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        BatchNumber: admin.BatchNumber,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    res.status(200).json({
      success: true,
      message: "Admin removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      type,
      originalPrice,
      discountedPrice,
      category,
      stock,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !image ||
      !type ||
      originalPrice === undefined ||
      discountedPrice === undefined
    ) {
      return res.status(400).json({
        message:
          "All required fields (name, description, image, type, originalPrice, discountedPrice) must be provided.",
      });
    }

    // Check if product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product already exists with this name" });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      image,
      type,
      originalPrice,
      discountedPrice,
      category,
      stock,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductsByType = async (req, res) => {
  try {
    const { type } = req.body;
    let products;
    if (!type) {
      products = await Product.find();
    } else {
      products = await Product.find({ type: type });
    }
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updateFields = {};

    const allowedFields = [
      "image",
      "name",
      "type",
      "description",
      "originalPrice",
      "discountedPrice",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAdminDashboardData,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  createProduct,
  getProductsByType,
  deleteProduct,
  editProduct,
};
