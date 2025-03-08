const rideModel = require("../models/ride-model");
const { subscribeToQueue, publishToQueue } = require("../service/rabbit");

module.exports.createRide = async (req, res) => {
  const { pickup, destination } = req.body;
  const ride = await rideModel.create({
    userId: req.user.id,
    pickup,
    destination,
  });

  publishToQueue("new-ride", JSON.stringify(ride));
  res.send(ride);
};

module.exports.acceptRide = async (req, res) => {
  const { rideId } = req.query;
  const ride = await rideModel.findById(rideId);
  if (!ride) {
    return res.status(404).send("Ride not found");
  }

  ride.status = "accepted";
  await ride.save();
  publishToQueue("ride-accepted", JSON.stringify(ride));
  res.send(ride);
};
