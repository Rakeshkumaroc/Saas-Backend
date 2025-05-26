const adminModel = require("../models/admin.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ======================= SIGNUP =========================
const signUp = async (req, res, next) => {
  try {
    const { userName, email, phone, password } = req.body;

    // Validate input
    if (!userName || !email || !phone || !password) {
      return next(new ApiError("All fields are required", 400));
    }

    // Check if user already exists
    const isUserExits = await adminModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (isUserExits) {
      return next(
        new ApiError(
          isUserExits.email === email
            ? "Email already exists"
            : "Phone already exists",
          400 // Use 400 for client errors
        )
      );
    }

    // Hash password
    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Create and save new user
    const newUser = new adminModel({
      userName, // Add userName
      email,
      phone,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const userResponse = {
      _id: savedUser._id,
      userName: savedUser.userName,
      email: savedUser.email,
      phone: savedUser.phone,
    };

    res
      .status(200)
      .json(
        new ApiResponse(200, "Register successfully completed", userResponse)
      );
  } catch (error) {
    console.error(error); // Log error for debugging
    next(new ApiError(error.message || "Server error", 500));
  }
};

// ======================= LOGIN =========================

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password || (!email)) {
      return next(new ApiError("Password and either Email  are required", 400));
    }

    // Allow login via email  
    const isUserExit = await adminModel.findOne({
      $or: [{ email: email || "" }],
    });

    if (!isUserExit) {
      return next(new ApiError("User not found", 404));
    }

    const verifyPassword = await bcrypt.compare(password, isUserExit.password);
    if (!verifyPassword) {
      return next(new ApiError("Invalid password", 401));
    }

    const token = jwt.sign(
      {
        adminId: isUserExit._id,
        email: isUserExit.email, 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const responseData = {
      id: isUserExit._id, 
      username: isUserExit.userName, 
    };

    res
      .status(200)
      .json(new ApiResponse(200, "Login successful", responseData));
  } catch (error) {
    console.error(error); // Log error for debugging
    next(new ApiError(error.message || "Server error", 500));
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
