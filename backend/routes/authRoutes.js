const express = require("express");
const { signup, login } = require("../controllers/authController");
const { googleAuth } = require("../controllers/googleAuthController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);

module.exports = router;

