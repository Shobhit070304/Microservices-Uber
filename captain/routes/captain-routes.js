const express = require("express");
const router = express.Router();
const captainController = require("../controllers/captain-controller");
const captainMiddleware = require("../middlewares/captainMiddleware");

router.post("/register", captainController.register);
router.post("/login", captainController.login);
router.get("/logout", captainController.logout);
router.get(
  "/profile",
  captainMiddleware.authCaptain,
  captainController.profile
);
router.patch(
  "/toggle-availability",
  captainMiddleware.authCaptain,
  captainController.toggleAvailability
);
router.get(
  "/new-ride",
  captainMiddleware.authCaptain,
  captainController.waitForNewRide
);

module.exports = router;
