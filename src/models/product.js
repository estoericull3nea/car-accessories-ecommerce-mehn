const mongoose = require("mongoose");

const prodSchema = new mongoose.Schema({
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

const ProductSchema = new mongoose.model("product", prodSchema);
module.exports = ProductSchema;
