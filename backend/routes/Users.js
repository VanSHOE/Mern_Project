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
      name: req.body.name,
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

router.post("/update", (req, res) => {
  let email = req.body.email;
  if (!email) return res.status(400).send("no");
  console.log("Email is:" + email);
  if (req.body.type == "Buyer") {
    Buyer.findOne({ email }).then((buyer) => {
      if (!buyer) return res.status(400).send("no");
      if (req.body.name) buyer.name = req.body.name;
      if (req.body.phone) buyer.contact = req.body.phone;
      if (req.body.age) buyer.age = req.body.age;
      if (req.body.batch) buyer.batch = req.body.batch;
      if (req.body.password) buyer.password = req.body.password;
      buyer
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });
  } else if (req.body.type == "Vendor") {
    Vendor.findOne({ email }).then((vendor) => {
      if (!vendor) return res.status(400).send("no");

      if (req.body.name) vendor.name = req.body.name;
      if (req.body.email) vendor.email = req.body.email;
      if (req.body.phone) vendor.contact = req.body.phone;
      if (req.body.s_name) vendor.shop_name = req.body.s_name;
      if (req.body.start_time) vendor.can_open = req.body.start_time;
      if (req.body.end_time) vendor.can_close = req.body.end_time;
      if (req.body.password) vendor.password = req.body.password;
      vendor
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
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
        ? res.status(200).json({ email, type: "Buyer", wallet: buyer.wallet })
        : res.status(401).json({
            error: "Invalid Credentials",
          });
    }
  });
});

router.post("/profile", (req, res) => {
  //  console.log(req.body);
  const email = req.body.email;
  //  console.log(email);
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
          return res.status(200).json(vendor);
        }
      });
    } else {
      return res.status(200).json(buyer);
    }
  });
});

router.post("/deposit", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  // Find user by email
  Buyer.findOne({ email }).then((buyer) => {
    // Check if user email exists
    if (!buyer) return res.status(400).send("no");
    if (req.body.wallet)
      buyer.wallet = parseInt(buyer.wallet, 10) + parseInt(req.body.wallet, 10);
    buyer
      .save()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
});

module.exports = router;
