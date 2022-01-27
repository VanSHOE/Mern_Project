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
  Vendor.findOne({ email: req.query.vendor_email }).then((vendor) => {
    if (!vendor) {
      console.log("no");
    } else {
      console.log(vendor);
      res.json({
        shop_name: vendor.shop_name,
        vendor_email: req.query.vendor_email,
      });
    }
  });
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request
// Add a user to db

const validatePhone = (phone) => {
  return String(phone)
    .toLowerCase()
    .match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

router.post("/register", (req, res) => {
  console.log(req.body);
  if (!validateEmail(req.body.email)) {
    console.log("email wrong");
    return res.status(400).send("Invalid email");
  }
  if (!validatePhone(req.body.phone)) {
    console.log("contact wrong");
    return res.status(400).send("Invalid phone");
  }
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
        res.status(400).send({
          message: "This is an error!",
        });
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
        res.status(400).send("no");
      });
  } else {
    res.status(401).send({
      message: "This is an error!",
    });
  }
});

router.post("/update", (req, res) => {
  let email = req.body.email;
  if (!email) return res.status(400).send("no");
  if (!validatePhone(req.body.phone)) {
    console.log("contact wrong");
    return res.status(400).send("Invalid phone");
  }
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
      if (req.body.phone) vendor.contact = req.body.phone;
      if (req.body.s_name) vendor.shop_name = req.body.s_name;
      if (req.body.start_time) vendor.can_open = req.body.start_time;
      if (req.body.end_time) vendor.can_close = req.body.end_time;
      if (req.body.password) vendor.password = req.body.password;
      vendor
        .save()
        .then((user) => {
          res.status(200).json(user);
          console.log(vendor.email);
          console.log("Updating?");
          Food.updateMany(
            { vendor_email: vendor.email },
            { $set: { vendor: vendor.name, shop: vendor.shop_name } }
          ).then((lol) => {
            console.log(lol);
          });
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

router.post("/glogin", (req, res) => {
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
          return res.status(200).json({ email, type: "Vendor" });
        }
      });
    } else {
      return res
        .status(200)
        .json({ email, type: "Buyer", wallet: buyer.wallet });
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
router.get("/get_fav", function (req, res) {
  console.log(req.query);
  Buyer.findOne({ email: req.query.email }).then((buyer) => {
    if (!buyer) {
      res.status(400).send("no");
    } else {
      console.log(buyer);
      res.json({
        favs: buyer.favs,
      });
    }
  });
});

router.post("/add_fav", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  let to_add = req.body.id;
  //  console.log(email);
  // Find user by email
  Buyer.findOne({ email }).then((buyer) => {
    // Check if user email exists
    if (!buyer) {
      return res.status(404).json({
        error: "Email not found",
      });
    } else {
      if (!buyer.favs.some((item) => item == to_add)) {
        buyer.favs.push(to_add);
      }
    }
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

router.post("/del_fav", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  let to_del = req.body.id;

  //  console.log(email);
  // Find user by email
  Buyer.findOne({ email }).then((buyer) => {
    // Check if user email exists
    if (!buyer) {
      return res.status(404).json({
        error: "Email not found",
      });
    } else {
      buyer.favs = buyer.favs.filter((item) => item != to_del);
    }
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

router.post("/deposit", (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  // Find user by email
  Buyer.findOne({ email }).then((buyer) => {
    // Check if user email exists
    if (!buyer) return res.status(400).send("no");
    if (req.body.wallet && parseInt(req.body.wallet) > 0)
      buyer.wallet = parseInt(buyer.wallet, 10) + parseInt(req.body.wallet, 10);
    else return res.status(400).send("Invalid money");
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

router.get("/getWallet", (req, res) => {
  console.log("wallet");
  console.log(req.query);
  const email = req.query.email;
  // Find user by email
  Buyer.findOne({ email }).then((buyer) => {
    // Check if user email exists
    if (!buyer) return res.status(400).send("no");
    return res.status(200).json({ money: buyer.wallet });
  });
});
module.exports = router;
