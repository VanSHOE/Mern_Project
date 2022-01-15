var express = require("express");
var router = express.Router();

// Load User model
const Buyer = require("../models/Buyer");
const Vendor = require("../models/Vendor");
// GET request
// Getting all the users
router.get("/", function (req, res) {
  Buyer.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request
// Add a user to db
router.post("/register", (req, res) => {
  console.log(req.body);
  if (req.body.type == "Buyer") {
    const newUser = new Buyer({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.phone,
      age: req.body.age,
      batch: req.body.batch,
      password: req.body.password,
    });

    newUser
      .save()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } else if (req.body.type == "Vendor") {
    const newUser = new Vendor({
      m_name: req.body.name,
      email: req.body.email,
      contact: req.body.phone,
      shop_name: req.body.s_name,
      can_open: req.body.start_time,
      can_close: req.body.end_time,
      password: req.body.password,
    });

    newUser
      .save()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } else {
    res.status(400).send("no");
  }
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
        if (!user) {
          return res.status(404).json({
            error: "Email not found",
          });
        } else {
          return res.status(200).json(vendor);
        }
      });
    } else {
      return res.status(200).json(buyer);
    }
  });
});

module.exports = router;
