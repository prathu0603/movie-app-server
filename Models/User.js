const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
  resetToken: String,
  expireTime: Date,
  movies: [String],
});

module.exports = mongoose.model("user", UserSchema);
