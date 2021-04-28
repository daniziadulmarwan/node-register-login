const mongoose = require("mongoose");

const santriSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Santri", santriSchema);
