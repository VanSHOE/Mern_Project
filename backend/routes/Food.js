var express = require("express");
var router = express.Router();

// Load User model
const Buyer = require("../models/Buyer");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");
const Order = require("../models/Order");
// GET request
// Getting all the users
router.get("/", function (req, res) {
  //  console.log(req.query);
  const vendor_email = req.query.vendor_email;
  if (vendor_email) {
    Food.find({ vendor_email }).then((items) => {
      if (!items) {
        return res.status(400).send();
      } else {
        // console.log(items);
        return res.json(items);
      }
    });
  } else {
    Food.find().then((items) => {
      if (!items) {
        return res.status(400).send();
      } else {
        // console.log(items);
        return res.json(items);
      }
    });
  }
});

router.post("/update", (req, res) => {
  let email = req.body.vendor_email;
  let name = req.body.oldName;
  if (!email) return res.status(400).send("no");
  console.log("Email is:" + email);

  Food.findOne({ name: name, vendor_email: email }).then((food) => {
    if (!food) return res.status(400).send("no");
    if (req.body.name) food.name = req.body.name;
    if (req.body.price) food.price = req.body.price;
    if (req.body.type) food.type = req.body.type;
    if (req.body.addons) food.addons = req.body.addons;
    if (req.body.tags) food.tags = req.body.tags;
    food
      .save()
      .then((user) => {
        //res.status(200).json(user);
        Food.find({ vendor_email: email }).then((items) => {
          if (!items) {
            return res.status(400).send();
          } else {
            //console.log(items);
            return res.json(items);
          }
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
});

router.post("/next", (req, res) => {
  let id = req.body.id;
  console.log(req.body);
  if (!id) return res.status(400).send("no");

  Order.findOne({ id: id }).then((order) => {
    console.log(order);

    if (!order) return res.status(400).send("no");
    if (parseInt(order.status) < 4) {
      order.status = parseInt(order.status) + 1;
      order
        .save()
        .then((user) => {
          return res.status(200).json(user);
        })
        .catch((err) => {
          return res.status(400).send(err);
        });
    } else return res.status(400).send("Order is already finished");
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
    type: req.body.type,
    addons: req.body.addons,
    tags: req.body.tags,
    vendor: req.body.vendor,
    vendor_email: req.body.vendor_email,
    shop: req.body.shop,
    id: req.body.id,
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
