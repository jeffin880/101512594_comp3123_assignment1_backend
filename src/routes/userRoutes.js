const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/userController");

// POST /api/v1/user/signup
router.post("/signup", signup);

// POST /api/v1/user/login
router.post("/login", login);

module.exports = router;
