const userModel = require("../models/user.model");
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

    const isUserExits = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
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
    const newUser = new userModel({
      email: email,
      phone: phone,
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
    const { contact, password } = req.body;

    if (!contact || !password) {
      return next(new ApiError("Email/Phone and Password are required", 400));
    }

    // Allow login via email or phone
    const isUserExit = await userModel.findOne({
      $or: [{ email:contact }, { phone:contact }],
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
        userId: isUserExit._id,
        email: isUserExit.email,
        phone: isUserExit.phone,
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

// ======================= GET ALL USERS =========================
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({ isDeleted: false }).select("-password");
    res.status(200).json(new ApiResponse(200, "All users fetched", users));
  } catch (error) {
    next(error);
  }
};

// ======================= GET USER BY ID =========================
const getUserById = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.userId).select("-password");

    if (!user || user.isDeleted) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "User fetched", user));
  } catch (error) {
    next(error);
  }
};

// ======================= UPDATE USER =========================
// const updateUser = async (req, res, next) => {
//   try {
//     const { email, phone, password } = req.body;
//     const user = await userModel.findById(req.params.userId);

//     if (!user || user.isDeleted) {
//       return next(new ApiError("User not found", 404));
//     }

//     if (email) user.email = email;
//     if (phone) user.phone = phone;
//     if (password) {
//       const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS || 10));
//       user.password = await bcrypt.hash(password, salt);
//     }
//     user.updatedAt = new Date();

//     const updatedUser = await user.save();
//     const userResponse = {
//       _id: updatedUser._id,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//     };

//     res.status(200).json(new ApiResponse(200, "User updated", userResponse));
//   } catch (error) {
//     next(error);
//   }
// };

// ======================= DELETE USER (Soft Delete) =========================
const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.userId);

    if (!user || user.isDeleted) {
      return next(new ApiError("User not found", 404));
    }

    user.isDeleted = true;
    user.updatedAt = new Date();

    await user.save();
    res.status(200).json(new ApiResponse(200, "User deleted", null));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  login,
  logout,
  getAllUsers,
  getUserById,
  // updateUser,
  deleteUser,
};
