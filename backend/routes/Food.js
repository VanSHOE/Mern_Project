var express = require("express");
var router = express.Router();

// Load User model
const Buyer = require("../models/Buyer");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");
// GET request
// Getting all the users
router.get("/", function (req, res) {
  console.log(req.query);
  const vendor = req.query.vendor;
  Food.find({ vendor }).then((items) => {
    if (!items) {
      return res.status(400).send();
    } else {
      console.log(items);
      return res.json(items);
    }
  });
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request
// Add a user to db
router.post("/add", (req, res) => {
  console.log(req.body);

  const newFood = new Food({
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating,
    type: req.body.type,
    addons: req.body.addons,
    tags: req.body.tags,
    vendor: req.body.vendor,
  });
  newFood
    .save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// POST request
// Login
router.post("/login", (req, res) => {
  const email = req.body.email;
  // Find user by email
  Buyer.findOne({ email }).then((buyer) => {
    // Check if user email exists
    if (!buyer) {
      Vendor.findOne({ email }).then((vendor) => {
        // Check if user email exists
        if (!vendor) {
          return res.status(404).json({
            error: "Email not found",
          });
        } else {
          return vendor.password == req.body.password
            ? res.status(200).json({ email, type: "Vendor" })
            : res.status(401).json({
                error: "Invalid Credentials",
              });
        }
      });
    } else {
      return buyer.password == req.body.password
        ? res.status(200).json({ email, type: "buyer" })
        : res.status(401).json({
            error: "Invalid Credentials",
          });
    }
  });
});

module.exports = router;
