const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("./../mongo-db");
const mongoose = require("mongoose");
require("mongoose").Promise = require("bluebird");
mongoose.set("useFindAndModify", false);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/../dist"));

app.listen(8080, () => {
  console.log("You are listening on port 8000");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/../dist/index.html");
});

app.post("/api/adduser", function(req, res) {
  const { username } = req.body;
  User.findOne({ username: username })
    .exec()
    .then(response => {
      if (response) {
        res.send("Username already exists");
      }
      const user = new User({ username: username });
      user
        .save()
        .then(name => {
          res.json({ id: name.id });
        })
        .catch(err => {
          console.log(err);
        });
    });
});
app.post("/api/addExercise", function(req, res) {
  const { username, description, duration, date } = req.body;
  console.log(date);
  User.findOneAndUpdate(
    { username: username },
    {
      $push: {
        exercise: {
          description: description,
          duration: duration,
          date: date
        }
      }
    },
    { new: true }
  )
    .exec()
    .then(response => {
      res.json(req.body);
    })
    .catch(err => {
      res.json({ username: "invalid username" });
    });
});

app.get("/api/exercise/log", async function(req, res) {
  var myQuery = {};
  if (req.query.username) {
    myQuery["username"] = req.query.username;
  } else {
    res.send("Username was not set");
  }
  console.log(myQuery);
  try {
    const exercises = await User.findOne({
      username: req.query.username
    }).exec();
    res.json(exercises);
  } catch (err) {
    res.send(err);
  }
});
