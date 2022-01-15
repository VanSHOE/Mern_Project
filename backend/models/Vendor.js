const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendorSchema = new Schema({
	m_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	contact: {
		type: String,
		required: true
	},
	shop_name: {
		type: String,
		required: true
	},
	can_open: {
		type: String,
		required: true
	},
	can_close: {
		type: String,
		required: true
	},
});

module.exports = User = mongoose.model("Vendor", VendorSchema);
