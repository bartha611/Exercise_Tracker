const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, function(
  err
) {
  if (err) {
    console.log(err);
  }
  console.log("You are connected to database");
});

var Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  exercise: [
    {
      description: String,
      duration: Number,
      date: Date
    }
  ]
});

var User = mongoose.model("User", userSchema);
module.exports = {
  User
};
