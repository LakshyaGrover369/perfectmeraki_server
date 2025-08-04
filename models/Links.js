const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Links", LinkSchema);
