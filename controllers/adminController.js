const User = require("../models/User");
const Product = require("../models/Product");
const Links = require("../models/Links");
const Workshop = require("../models/Workshop");
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

    const imageFile = req.file;
    const imageUrl = imageFile && imageFile.path ? imageFile.path : "";
    // Create product
    const product = await Product.create({
      name,
      description,
      image: imageUrl,
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

// Get workshops by type
const getWorkshopsByType = async (req, res) => {
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

// Get links by name (GET version using query params)
const getLinksByName = async (req, res) => {
  try {
    const { name } = req.query; // <-- changed to query
    let links;
    if (!name) {
      links = await Links.find();
    } else {
      links = await Links.find({ name: name });
    }
    console.log("Links fetched:", links);
    res.status(200).json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update links by name
const updateLinksByName = async (req, res) => {
  try {
    const { name, link } = req.body;

    // Validate required fields
    if (!name || !link) {
      return res.status(400).json({
        message: "Both name and link are required to update the link.",
      });
    }

    const updatedLink = await Links.findOneAndUpdate(
      { name: name },
      { link: link },
      { new: true, runValidators: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create links
const createLinks = async (req, res) => {
  try {
    const { name, link } = req.body;

    // Validate required fields
    if (!name || !link) {
      return res.status(400).json({
        message: "Both name and link are required to create a link.",
      });
    }

    // Check if link already exists
    const existingLink = await Links.findOne({ name });
    if (existingLink) {
      return res
        .status(400)
        .json({ message: "Link with this name already exists." });
    }

    const newLink = await Links.create({ name, link });

    res.status(201).json({
      success: true,
      data: newLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get workshop by name
const getWorkshopByType = async (req, res) => {
  try {
    const { type } = req.query; // Use query params for type
    let workshops;
    if (!type) {
      workshops = await Workshop.find();
    } else {
      workshops = await Workshop.find({ type: type });
    }
    res.status(200).json({
      success: true,
      data: workshops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create Workshop
const createWorkshop = async (req, res) => {
  try {
    const { image1, image2, image3, name, type, description } = req.body;

    // Required fields check
    if (!image1 || !image2 || !image3 || !name || !type || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const image1File = req.image1;
    const image2File = req.image2;
    const image3File = req.image3;
    const image1Url = image1File && image1File.path ? image1File.path : "";
    const image2Url = image2File && image2File.path ? image2File.path : "";
    const image3Url = image3File && image3File.path ? image3File.path : "";

    // Enum validation
    const WORKSHOP_TYPES = [
      "corperate team building",
      "festival themed",
      "fridge magnets",
      "kids",
      "lipan art",
      "mandala",
      "nameplate",
    ];

    if (!WORKSHOP_TYPES.includes(type)) {
      return res.status(400).json({
        message: `Invalid workshop type. Allowed types: ${WORKSHOP_TYPES.join(
          ", "
        )}`,
      });
    }

    const newWorkshop = new Workshop({
      image1: image1Url,
      image2: image2Url,
      image3: image3Url,
      name: name.trim(),
      type,
      description: description.trim(),
    });

    const savedWorkshop = await newWorkshop.save();
    res.status(201).json(savedWorkshop);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Workshop by ID without image
const updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const { image1, image2, image3, name, type, description } = req.body;

    // Enum validation if type is provided
    const WORKSHOP_TYPES = [
      "corperate team building",
      "festival themed",
      "fridge magnets",
      "kids",
      "lipan art",
      "mandala",
      "nameplate",
    ];

    if (type && !WORKSHOP_TYPES.includes(type)) {
      return res.status(400).json({
        message: `Invalid workshop type. Allowed types: ${WORKSHOP_TYPES.join(
          ", "
        )}`,
      });
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      id,
      {
        ...(image1 && { image1 }),
        ...(image2 && { image2 }),
        ...(image3 && { image3 }),
        ...(name && { name: name.trim() }),
        ...(type && { type }),
        ...(description && { description: description.trim() }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(updatedWorkshop);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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
  getWorkshopsByType,
  getLinksByName,
  updateLinksByName,
  createLinks,
  getWorkshopByType,
  createWorkshop,
  updateWorkshop,
};
