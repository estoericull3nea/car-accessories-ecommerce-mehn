const mongoose = require("mongoose");

const prodAddedSchema = new mongoose.Schema({
  imgURL: {
    type: String,
    requried: true,
  },
  title: {
    type: String,
    requried: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("prodAdded", prodAddedSchema);
