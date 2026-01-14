const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const REQUIRE_GOOGLE_AUTH = String(process.env.REQUIRE_GOOGLE_AUTH || "false").toLowerCase() === "true";

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Shared admin check
function isAdminCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return email === adminEmail && password === adminPassword;
}

// POST /api/auth/signup
async function signup(req, res) {
  try {
    if (REQUIRE_GOOGLE_AUTH) {
      return res.status(403).json({ message: "Please continue with Google to sign up." });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (!validator.isEmail(email || "")) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    // Prevent registering with admin email
    if (email === process.env.ADMIN_EMAIL) {
      return res
        .status(400)
        .json({ message: "This email is reserved. Please use a different one." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      authProvider: "local",
      emailVerified: false,
      role: "user",
    });

    const token = createToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Could not create account." });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    if (REQUIRE_GOOGLE_AUTH) {
      return res.status(403).json({ message: "Please continue with Google to log in." });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (!validator.isEmail(email || "")) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    // Hidden admin login: uses same form as users
    if (isAdminCredentials(email, password)) {
      const token = createToken({
        email,
        role: "admin",
      });
      return res.json({
        token,
        user: {
          id: null,
          email,
          role: "admin",
          isBlocked: false,
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.password) {
      return res.status(403).json({ message: "This account uses Google sign-in. Please continue with Google." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked." });
    }

    const token = createToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Could not log in." });
  }
}

module.exports = { signup, login };

