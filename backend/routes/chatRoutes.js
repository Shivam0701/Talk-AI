const express = require("express");
const rateLimit = require("express-rate-limit");
const { sendChat, getHistory } = require("../controllers/chatController");

const router = express.Router();

// Tighter limiter for chat endpoint
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/history", getHistory);
router.post("/", chatLimiter, sendChat);

module.exports = router;

