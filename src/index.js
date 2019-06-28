const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("./../mongo-db");
const mongoose = require("mongoose");
const moment = require("moment");
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
      } else {
        const user = new User({ username: username });
        user
          .save()
          .then(name => {
            res.json({ id: name.id });
          })
          .catch(err => {
            console.log(err);
          });
      }
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
  if (!req.query.username) {
    return res.send("Username not entered");
  }
  var query = [];
  query.push({ $match: { username: req.query.username } });
  query.push({ $unwind: "$exercise" });
  if (req.query.from) {
    var from = moment(req.query.from, "YYYY-MM-DD");
    if (!from.isValid()) {
      return res.send("Invalid from date");
    }
    from = from.toArrray();
    query.push({
      $match: { "exercise.date": { $gte: new Date(from[0], from[1], from[2]) } }
    });
  }
  if (req.query.to) {
    var to = moment(req.query.to, "YYYY-MM-DD");
    if (!to.isValid()) {
      return res.send("Invalid to date");
    }
    to = to.toArray();
    query.push({
      $match: { "exercise.date": { $lte: new Date(to[0], to[1], to[2]) } }
    });
  }
  if (req.query.limit) {
    const numberRegex = /^\d+$/;
    if (!numberRegex.test(req.query.limit)) {
      return res.send("Invald limit");
    }
    query.push({ $limit: parseInt(req.query.limit) });
  }
  query.push({
    $group: {
      _id: req.query.username,
      count: { $sum: 1 },
      exercises: { $push: "$exercise" }
    }
  });
  const matches = await User.aggregate(query);
  res.json(matches);
});
