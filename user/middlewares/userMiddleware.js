const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    delete user._doc.password;

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
