const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "username, email, and password are required",
      });
    }


    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User with given email or username already exists",
      });
    }

    
    const user = new User({ username, email, password });
    await user.save();

    return res.status(201).json({
      message: "User created successfully.",
      user_id: user._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({
        status: false,
        message: "email/username and password are required",
      });
    }

    
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid Username and password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid Username and password",
      });
    }

    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      jwt_token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
