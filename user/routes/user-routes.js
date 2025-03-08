const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const userMiddleware = require("../middlewares/userMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/profile", userMiddleware.authUser, userController.profile);

module.exports = router;
