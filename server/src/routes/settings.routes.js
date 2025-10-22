const express = require("express");
const {
  getSettings,
  updateProfile,
  updateNotifications,
  updateStudy,
  updateApp,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const protection = require("../middlewares/arcjet");

const router = express.Router();

// router.use(protection({ max: 2, interval: 60 }));

router.get("/", auth, getSettings);
router.put("/notifications", auth, updateNotifications);
router.put("/study", auth, updateStudy);
router.put("/app", auth, updateApp);

module.exports = router;
