const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ======================= SIGNUP =========================
const signUp = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    // Validate input

    if (!email || !phone || !password) {
      return next(new ApiError("missing filed", 400));
    }

    // Check if user already exists

    const isUserExits = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (isUserExits) {
      return next(
        new ApiError(
          isUserExits.email == email
            ? "email already exits ."
            : "phone already exits .",
          500
        )
      );
    }

    // Hash password
    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Create and save new user
    const newUser = new userModel({
      email: email,
      phone: phone,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const userResponse = {
      _id: savedUser._id,
      email: savedUser.email,
      phone: savedUser.phone,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, "register successfully complete", userResponse)
      );
  } catch (error) {
    next(error);
  }
};

// ======================= LOGIN =========================

const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return next(new ApiError("Email/Phone and Password are required", 400));
    }

    // Allow login via email or phone
    const isUserExit = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (!isUserExit) {
      return next(new ApiError("User not found", 404));
    }

    const verifyPassword = await bcrypt.compare(password, isUserExit.password);
    if (!verifyPassword) {
      return next(new ApiError("Password is invalid", 401));
    }

    const token = jwt.sign(
      {
        userId: isUserExit._id,
        email: isUserExit.email,
        phone: isUserExit.phone,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // 🍪 Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on live server (HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Optional response data
    const responseData = {
      email: isUserExit.email,
      phone: isUserExit.phone,
    };

    res
      .status(200)
      .json(new ApiResponse(200, "Login successful", responseData));
  } catch (error) {
    next(error);
  }
};

// ======================= LOGOUT =========================
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json(new ApiResponse(200, "Logout successful", null));
};

module.exports = { signUp, login, logout };
