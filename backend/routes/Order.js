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
router.get("/stats", function (req, res) {
  console.log(req.query);
  const v_email = req.query.v_email;
  let result = {};
  if (v_email) {
    Order.find({ vendor_email: v_email }).then((orders) => {
      if (!orders) {
        result.num_orders = 0;
      } else {
        result.num_orders = orders.length;
      }
      let completed_orders = orders.filter((order) => order.status == 4);
      result.num_comp = completed_orders.length;

      let rejected_orders = orders.filter((order) => order.status == -1);
      result.num_rej = rejected_orders.length;
      result.num_pen =
        parseInt(result.num_orders) -
        parseInt(result.num_comp) -
        parseInt(result.num_rej);

      Food.find({ vendor_email: v_email })
        .sort({ sold: -1 })
        .then((foods) => {
          result.sorted = foods;
          if (result.sorted.length > 5) result.sorted.length = 5;
          return res.status(200).json(result);
        });
    });
  } else {
    return res.status(400).send();
  }
});

router.get("/", function (req, res) {
  // console.log(req.query);
  const b_email = req.query.b_email;
  const v_email = req.query.v_email;
  if (b_email) {
    Order.find({ b_email }).then((orders) => {
      if (!orders) {
        return res.status(400).send();
      } else {
        // console.log(items);
        if (orders.length == 0) {
          return res.status(200).send([]);
        }

        Order.aggregate([
          {
            $lookup: {
              from: "foods",
              localField: "food_id",
              foreignField: "id",
              as: "items",
            },
          },
        ])
          .then((products) => {
            //  console.log(products);
            res
              .status(200)
              .json(products.filter((item) => item.b_email == b_email));
          })
          .catch((err) => {
            next(err);
          });
      }
    });
  } else if (v_email) {
    Order.find({ vendor_email: v_email }).then((orders) => {
      if (!orders) {
        return res.status(400).send();
      } else {
        // console.log(items);
        if (orders.length == 0) {
          return res.status(200).send([]);
        }
        Order.aggregate([
          {
            $lookup: {
              from: "foods",
              localField: "food_id",
              foreignField: "id",
              as: "items",
            },
          },
        ])
          .then((products) => {
            // console.log(products);
            res
              .status(200)
              .json(products.filter((item) => item.vendor_email == v_email));
          })
          .catch((err) => {
            next(err);
          });
      }
    });
  } else {
    Order.find().then((items) => {
      if (!items) {
        return res.status(400).send();
      } else {
        // console.log(items);
        return res.json(items);
      }
    });
  }
});

router.post("/add", (req, res) => {
  console.log(req.body);
  var today = new Date();
  const newOrder = new Order({
    food_id: req.body.food_id,
    add_ons: req.body.add_ons,
    b_email: req.body.b_email,
    vendor_email: req.body.vendor_email,
    qty: req.body.qty,
    date: Date.now(),
    time:
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    id: req.body.id,
  });
  Buyer.findOne({ email: req.body.b_email }).then((buyer) => {
    var wallet = buyer.wallet;
    Food.findOne({ id: req.body.food_id }).then((food) => {
      var price = parseInt(food.price);
      for (var i = 0; i < req.body.add_ons.length; i++) {
        price = parseInt(price) + parseInt(req.body.add_ons[i].price);
      }
      price = parseInt(req.body.qty) * parseInt(price);
      if (parseInt(price) > parseInt(wallet)) {
        return res.status(400).send("Insufficient funds");
      }
      buyer.wallet = parseInt(buyer.wallet) - parseInt(price);
      buyer.save().then((user) => {
        console.log("Money deducted");
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

router.post("/rate", (req, res) => {
  console.log(req.body);
  Order.findOne({ id: req.body.id }).then((order) => {
    console.log(order);
    if (order.status != 4)
      return res.status(401).send("Not in position to be rated");

    order.status = 5;
    order.rating = req.body.rating;
    order
      .save()
      .then((user) => {
        Food.findOne({ id: req.body.food_id }).then((food) => {
          food.num_ratings = parseInt(food.num_ratings) + 1;
          food.rating = parseFloat(food.rating) + parseFloat(req.body.rating);
          food
            .save()
            .then((user) => {
              console.log(user);
              res.status(200).send("Finished");
            })
            .catch((err) => {
              res.status(400).send(err);
            });
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
});

module.exports = router;
