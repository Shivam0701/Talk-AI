const User = require("../models/User");
const Message = require("../models/Message");
const { toISODateString } = require("../utils/date");

// GET /api/admin/overview
async function overview(_req, res) {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const today = toISODateString(new Date());
    const start = new Date(`${today}T00:00:00.000Z`);
    const end = new Date(`${today}T23:59:59.999Z`);

    const totalMessagesToday = await Message.countDocuments({
      timestamp: { $gte: start, $lte: end },
      role: "user",
    });

    res.json({ totalUsers, totalMessagesToday });
  } catch (err) {
    console.error("Admin overview error:", err);
    res.status(500).json({ message: "Could not load admin overview." });
  }
}

// GET /api/admin/users
async function listUsers(_req, res) {
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .select("email messagesUsedToday lastResetDate isBlocked createdAt");

    res.json({ users });
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ message: "Could not load users." });
  }
}

// PATCH /api/admin/users/:id/block
async function setBlocked(req, res) {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.isBlocked = Boolean(isBlocked);
    await user.save();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        isBlocked: user.isBlocked,
        messagesUsedToday: user.messagesUsedToday,
      },
    });
  } catch (err) {
    console.error("Admin block error:", err);
    res.status(500).json({ message: "Could not update user." });
  }
}

module.exports = { overview, listUsers, setBlocked };

