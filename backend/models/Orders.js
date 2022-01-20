const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
  food_id: {
    type: String,
    required: true,
  },
  add_ons: {
    type: Array,
    required: true,
  },
  b_email: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("Order", OrderSchema);
