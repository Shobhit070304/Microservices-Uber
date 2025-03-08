const captainModel = require("../models/captain-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const isCaptain = await captainModel.findOne({ email });
    if (isCaptain) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const captain = await captainModel.create({
      name,
      email,
      password: hashPassword,
    });
    delete captain._doc.password;
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { expiresIn: "1h" });

    res.status(200).json({ token, captain });
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
    const captain = await captainModel.findOne({ email });
    if (!captain) {
      return res.status(400).json({ message: "Captain does not exist" });
    }
    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { expiresIn: "1h" });
    delete captain._doc.password;
    res.status(200).json({ token, captain });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.status(200).json({ message: "Captain logged out successfully" });
};

module.exports.profile = async (req, res) => {
  try {
    const captain = req.captain;
    res.status(200).json(captain);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain.id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    delete captain._doc.password;
    res.send(captain);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
