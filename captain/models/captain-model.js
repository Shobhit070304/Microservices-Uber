const mongoose = require("mongoose");

const captainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

const captainModel = mongoose.model("Captain", captainSchema);

module.exports = captainModel;
