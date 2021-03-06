const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  contact: {
    type: String,
    required: true,
  },
  shop_name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  can_open: {
    type: String,
    required: true,
  },
  can_close: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("Vendor", VendorSchema);
