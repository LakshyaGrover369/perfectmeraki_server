const mongoose = require("mongoose");

const PRODUCT_TYPES = [
  "nameplates",
  "spiritual hangings",
  "kitchen decor",
  "fridge magnets",
  "danglers",
  "evil eye",
  "jarokha",
  "mandala mirrors",
  "kids special",
  "key holders",
];

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: PRODUCT_TYPES,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
