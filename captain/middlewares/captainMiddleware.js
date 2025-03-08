const captainModel = require("../models/captain-model");
const jwt = require("jsonwebtoken");

module.exports.authCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findOne({ _id: decoded.id });
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    delete captain._doc.password;

    req.captain = captain;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
