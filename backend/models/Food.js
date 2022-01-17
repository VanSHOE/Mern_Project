const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FoodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  addons: {
    type: Array,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  vendor_email: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("Food", FoodSchema);
