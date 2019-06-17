const express = require("express");
const bodyParser = require("body-parser");

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
  console.log(username);
});
