var express = require("express");
var router = express.Router();

// GET request
// Just a test API to check if server is working properly or not
router.get("/getTime", function (req, res) {
  let date_ob = new Date();
  let hours = date_ob.getHours();
  let mins = date_ob.getMinutes();

  return res.status(200).json(hours * 60 + mins);
});

module.exports = router;
