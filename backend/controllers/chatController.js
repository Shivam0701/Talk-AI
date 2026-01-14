const Message = require("../models/Message");
const User = require("../models/User");
const { callChatModel } = require("../ai/aiClient");
const { toISODateString } = require("../utils/date");

const DAILY_MESSAGE_LIMIT = Number(process.env.DAILY_MESSAGE_LIMIT || 40);

async function ensureDailyReset(user) {
  const today = toISODateString(new Date());
  const last = user.lastResetDate ? toISODateString(new Date(user.lastResetDate)) : null;
  if (last !== today) {
    user.messagesUsedToday = 0;
    user.lastResetDate = new Date();
    await user.save();
  }
}

// GET /api/chat/history
async function getHistory(req, res) {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins do not have chat history." });
    }

    const messages = await Message.find({ userId: req.user.id })
      .sort({ timestamp: 1 })
      .limit(200);

    res.json({ messages });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Could not load chat history." });
  }
}

// POST /api/chat
async function sendChat(req, res) {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot use chat." });
    }

    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found." });
    if (user.isBlocked) return res.status(403).json({ message: "Your account is blocked." });

    await ensureDailyReset(user);

    if (user.messagesUsedToday >= DAILY_MESSAGE_LIMIT) {
      return res.status(429).json({
        message: "Daily message limit reached. Please come back tomorrow.",
      });
    }

    const now = new Date();

    // Save user message
    const userMsg = await Message.create({
      userId: user._id,
      role: "user",
      content: message.trim(),
      timestamp: now,
    });

    // Build context (short)
    const recent = await Message.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(12);

    const context = recent.reverse().map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const aiText = await callChatModel({ messages: context });

    const aiMsg = await Message.create({
      userId: user._id,
      role: "assistant",
      content: aiText,
      timestamp: new Date(),
    });

    user.messagesUsedToday += 1;
    await user.save();

    res.json({
      userMessage: userMsg,
      aiMessage: aiMsg,
      messagesUsedToday: user.messagesUsedToday,
      dailyLimit: DAILY_MESSAGE_LIMIT,
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "AI is unavailable right now. Please try again soon." });
  }
}

module.exports = { sendChat, getHistory };

