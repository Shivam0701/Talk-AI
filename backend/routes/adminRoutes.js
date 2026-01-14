const express = require("express");
const { adminOnly } = require("../middleware/authMiddleware");
const { overview, listUsers, setBlocked } = require("../controllers/adminController");

const router = express.Router();

router.get("/overview", adminOnly, overview);
router.get("/users", adminOnly, listUsers);
router.patch("/users/:id/block", adminOnly, setBlocked);

module.exports = router;

