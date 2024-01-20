const express = require("express");

const settingsController = require("../controllers/settings");
const isNotLoggedin = require("../middlewares/isNotLoggedIn");

const router = express.Router();

router.get("/settings", isNotLoggedin, settingsController.getSettings);
router.post("/change-name", isNotLoggedin, settingsController.postChangeName);
router.get("/change-email", isNotLoggedin, settingsController.getChangeEmail);
router.post("/change-email", isNotLoggedin, settingsController.postChangeEmail);
router.get(
  "/change-password",
  isNotLoggedin,
  settingsController.getChangePassword
);
router.post(
  "/change-password",
  isNotLoggedin,
  settingsController.postChangePassword
);

module.exports = router;
