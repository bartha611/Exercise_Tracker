const mongoose = require("mongoose");

var Schema = mongoose.Schema;
const userSchema = Schema({
  exercises: [
    {
      description: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: true
      }
    }
  ]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
