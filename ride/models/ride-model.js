const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    captain: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "started", "completed"],
      default: "requested",
    },
  },
  {
    timestamps: true,
  }
);

const rideModel = mongoose.model("ride", rideSchema);

module.exports = rideModel;
