const userModel = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const bcrypt = require("bcrypt");
const { oauth2client } = require("../helpers/googleConfig");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ======================= SIGNUP =========================
const signUp = async (req, res, next) => {
  try {
    const {  email, phone, password } = req.body;
    console.log("signUp request body", req.body);

    // Validate required fields
    if ( !email || !password) {
      return next(new ApiError("Email, and password are required", 400));
    }

    // Check if user already exists
    const isUserExits = await userModel.findOne({
      $or: [{ email: email }, ...(phone ? [{ phone: phone }] : [])],
    });

    if (isUserExits) {
      return next(
        new ApiError(
          isUserExits.email === email
            ? "Email already exists"
            : "Phone already exists",
          400
        )
      );
    }

    // Hash password
    const saltRounds = Number(process.env.SALT_ROUNDS || 10);
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const userCount = await userModel.countDocuments();

    // Create and save new user
    const newUser = new userModel({ 
      email: email,
      phone: phone || null, // Set phone to null if not provided (sparse index allows this)
      password: hashPassword,
      isAdmin: userCount === 0, //  true for first user, false otherwise
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

    if (!password || !email) {
      return next(new ApiError("Password and either Email  are required", 400));
    }

    // Allow login via email
    const isUserExit = await userModel.findOne({
<<<<<<< HEAD
      $or: [{ email: email || "" }],
=======
      $or: [{ email: contact }, { phone: contact }],
>>>>>>> 5fdda80a6b2375dbf5988701eab03fc96147498d
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
      email: isUserExit.email,
      phone: isUserExit.phone,
    };

    res
      .status(200)
      .json(new ApiResponse(200, "Login successful", responseData));
  } catch (error) {
    console.error(error); // Log error for debugging
    next(new ApiError(error.message || "Server error", 500));
  }
};

// ======================= GOOGLE SIGNUP =========================
const addUserWithGoogle = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(new ApiError("Authorization code is required", 400));
    }

    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();
    const { email, name, picture } = userInfo.data;

    let user = await userModel.findOne({ email });

    if (user) {
      return next(
        new ApiError("Email already exists, please log in", 400, {
          alreadyExists: true,
        })
      );
    }

    user = new userModel({ 
      email,
      phone: "",
      profilePic: picture,
      isGoogleUser: true,
      isGoogleVerified: true,
    });

    const savedUser = await user.save();

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: savedUser._id, 
      email: savedUser.email,
      phone: savedUser.phone,
      profilePic: savedUser.profilePic,
    };

    res.status(201).json(
      new ApiResponse(201, "Google signup successful", {
        crackItData: { token, user: userResponse },
      })
    );
  } catch (error) {
    console.error("Google Auth Error:", error);
    next(new ApiError("Google authentication failed", 500));
  }
};

// ======================= GOOGLE LOGIN =========================
const logInUserWithGoogle = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(new ApiError("Authorization code missing", 400));
    }

    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    const { email } = data;

    const user = await userModel.findOne({
      email,
      isGoogleUser: true,
    });

    if (!user) {
      return next(new ApiError("User not found. Please register first.", 404));
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: user._id, 
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
    };

    res.status(200).json(
      new ApiResponse(200, "Google login successful", {
        crackItData: { token, user: userResponse },
      })
    );
  } catch (error) {
    console.error("Google Login Error:", error);
    next(new ApiError("Google login failed", 500));
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
    const users = await userModel
      .find({ isDeleted: false })
      .select("-password");
    res.status(200).json(new ApiResponse(200, "All users fetched", users));
  } catch (error) {
    next(error);
  }
};

// ======================= GET USER BY ID =========================
const getUserById = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.params.userId)
      .select("-password");

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
  addUserWithGoogle,
  logInUserWithGoogle,
  logout,
  getAllUsers,
  getUserById,
  // updateUser,
  deleteUser,
};
