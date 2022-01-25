var express = require("express");
const nodemailer = require("nodemailer");
var router = express.Router();
require("dotenv").config();
// Load User model
const Buyer = require("../models/Buyer");
const Vendor = require("../models/Vendor");
const Food = require("../models/Food");
const Order = require("../models/Order");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

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
    //var curTime = Date.now().getHours() * 60 + Date.now().getMinutes();
    Food.aggregate([
      {
        $lookup: {
          from: "vendors",
          localField: "vendor_email",
          foreignField: "email",
          as: "ven_foo",
        },
      },
    ])
      .then((products) => {
        console.log(products);
        return res.status(200).json(products);
      })
      .catch((err) => {
        return res.status(400).send("Failed");
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
  //  console.log(req.body);
  if (!id) return res.status(400).send("no");

  Order.findOne({ id: id }).then((order) => {
    // console.log(order);

    if (!order) return res.status(400).send("no");
    //console.log(order.status);
    if (parseInt(order.status) == -1) {
      return res.status(400).send("Order has been rejected");
    }
    if (parseInt(order.status) < 4) {
      order.status = parseInt(order.status) + 1;
      console.log(parseInt(order.status));
      if (parseInt(order.status) == 4) {
        Food.findOne({ id: order.food_id }).then((food) => {
          food.sold = parseInt(food.sold) + 1;
          food.save().then((user) => {
            console.log("Food sold");
          });
        });
      } else if (parseInt(order.status) == 1) {
        Food.findOne({ id: order.food_id }).then((food) => {
          Vendor.findOne({ email: food.vendor_email }).then((vendor) => {
            console.log(vendor);
            let mailOptions = {
              from: "rahulgargofficial@gmail.com",
              to: order.b_email,
              subject: "Order #" + id + " Accepted",
              text:
                vendor.name +
                " has accepted your order. (This is a test email, if you are seeing this i probably entered the recieving email wrong, I apologize)",
            };

            // transporter.sendMail(mailOptions, function (err, data) {
            //   if (err) {
            //     console.log("Error " + err);
            //   } else {
            //     console.log("Email sent successfully");
            //   }
            // });
          });
        });
      }
      order
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    } else res.status(400).send("Order is already finished");
  });
});

router.post("/reject", (req, res) => {
  let id = req.body.id;
  console.log(req.body);
  if (!id) return res.status(400).send("no");

  Order.findOne({ id: id }).then((order) => {
    console.log(order);

    if (!order) return res.status(400).send("no");
    if (order.status == -1) return res.status(400).send("no");
    if (parseInt(order.status) < 4) {
      Buyer.findOne({ email: order.b_email }).then((buyer) => {
        var wallet = buyer.wallet;
        Food.findOne({ id: order.food_id }).then((food) => {
          var price = parseInt(food.price);
          for (var i = 0; i < order.add_ons.length; i++) {
            price = parseInt(price) + parseInt(order.add_ons[i].price);
          }
          price = parseInt(order.qty) * parseInt(price);
          buyer.wallet = parseInt(buyer.wallet) + parseInt(price);
          buyer.save().then((user) => {
            console.log("Refunded");
          });

          Vendor.findOne({ email: food.vendor_email }).then((vendor) => {
            let mailOptions = {
              from: "rahulgargofficial@gmail.com",
              to: order.b_email,
              subject: "Order #" + id + " Rejected",
              text:
                vendor.name +
                " has rejected your order. Your money has been refunded. (This is a test email, if you are seeing this i probably entered the recieving email wrong, I apologize)",
            };

            // transporter.sendMail(mailOptions, function (err, data) {
            //   if (err) {
            //     console.log("Error " + err);
            //   } else {
            //     console.log("Email sent successfully");
            //   }
            // });
          });
        });
      });

      order.status = -1;
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
    id: req.body.id,
  })
    .then((result) => {
      Order.deleteMany({ food_id: req.body.id }).then((resp) => {
        console.log(resp);
      });
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
