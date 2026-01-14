const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function requireGoogleOnly() {
  return String(process.env.REQUIRE_GOOGLE_AUTH || "false").toLowerCase() === "true";
}

// POST /api/auth/google
// Body: { credential: "<google_id_token>" }
async function googleAuth(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing Google credential." });

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) return res.status(500).json({ message: "Missing GOOGLE_CLIENT_ID on server." });

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    const emailVerified = Boolean(payload?.email_verified);
    const sub = payload?.sub;

    if (!email || !sub) return res.status(401).json({ message: "Invalid Google token." });
    if (!emailVerified) return res.status(403).json({ message: "Google email is not verified." });

    // Optional: enforce Gmail-only (email exists + verified + google)
    if (process.env.GMAIL_ONLY === "true" && !email.endsWith("@gmail.com")) {
      return res.status(403).json({ message: "Please use a Gmail account." });
    }

    // Prevent using admin email via Google user login
    if (email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "This email is reserved." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: null,
        authProvider: "google",
        googleSub: sub,
        emailVerified: true,
        role: "user",
      });
    } else {
      // If existing local user, keep it but mark verified/provider as google if they sign in with google
      user.authProvider = "google";
      user.googleSub = sub;
      user.emailVerified = true;
      await user.save();
    }

    if (user.isBlocked) return res.status(403).json({ message: "Your account is blocked." });

    const token = createToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
      googleOnly: requireGoogleOnly(),
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({ message: "Google authentication failed." });
  }
}

module.exports = { googleAuth };

