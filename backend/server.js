const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const path = require("path");
if (process.env.NODE_ENV === "production") {
  app._router.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var FoodRouter = require("./routes/Food");
var OrderRouter = require("./routes/Order");
var GeneralRouter = require("./routes/general");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(
  "mongodb+srv://root:toor@Database.t2ikc.mongodb.net/Database?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/item", FoodRouter);
app.use("/order", OrderRouter);
app.use("/general", GeneralRouter);
app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
