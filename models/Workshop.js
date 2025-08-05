const mongoose = require("mongoose");

const WORKSHOP_TYPES = [
  "corperate team building",
  "festival themed",
  "fridge magnets",
  "kids",
  "lipan art",
  "mandala",
  "nameplate",
];

const WorkshopSchema = new mongoose.Schema(
  {
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
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
      enum: WORKSHOP_TYPES,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workshop", WorkshopSchema);
