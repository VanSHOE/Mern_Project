var express = require("express");
var router = express.Router();

// Load User model
const Buyer = require("../models/Buyer");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");
const Order = require("../models/Order");
// GET request
// Getting all the users

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request
// Add a user to db
router.post("/add", (req, res) => {
  console.log(req.body);
  var today = new Date();
  const newOrder = new Order({
    food_id: req.body.food_id,
    add_ons: req.body.add_ons,
    b_email: req.body.b_email,
    qty: req.body.qty,
    date: Date.now(),
    time:
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    id: req.body.id,
  });

  newOrder
    .save()
    .then((user) => {
      console.log(user);
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/del", (req, res) => {
  console.log(req.body);

  Food.deleteOne({
    name: req.body.name,
    vendor_email: req.body.vendor_email,
  })
    .then((result) => {
      res.status(200).json({
        message: "Address Deleted",
        result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Error Occured",
        error: err,
      });
    });
});

module.exports = router;