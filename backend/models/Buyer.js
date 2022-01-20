const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BuyerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  favs: {
    type: Array,
    default: [],
  },
});

module.exports = User = mongoose.model("Buyer", BuyerSchema);
