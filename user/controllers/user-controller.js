const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { subscribeToQueue } = require("../service/rabbit");
const EventEmitter = require("events");
const rideEventEmitter = new EventEmitter();

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const isUser = await userModel.findOne({ email });
    if (isUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    delete user._doc.password;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { expiresIn: "1h" });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { expiresIn: "1h" });
    delete user._doc.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports.profile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports.acceptedRide = async (req, res) => {
  // Long polling: wait for 'ride-accepted' event
  rideEventEmitter.once("ride-accepted", (data) => {
    res.send(data);
  });

  // Set timeout for long polling (e.g., 30 seconds)
  setTimeout(() => {
    res.status(204).send();
  }, 30000);
};

subscribeToQueue("ride-accepted", async (msg) => {
  const data = JSON.parse(msg);
  rideEventEmitter.emit("ride-accepted", data);
});
