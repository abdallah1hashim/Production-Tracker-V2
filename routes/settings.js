const express = require("express");

const settingsController = require("../controllers/settings");
const isNotLoggedin = require("../middlewares/isNotLoggedIn");

const router = express.Router();

router.get("/settings", isNotLoggedin, settingsController.getSettings);
router.post("/change-name", isNotLoggedin, settingsController.postChangeName);
router.get("/change-email", isNotLoggedin, settingsController.getChangeEmail);
router.get(
  "/change-password",
  isNotLoggedin,
  settingsController.getChangePassword
);

module.exports = router;
