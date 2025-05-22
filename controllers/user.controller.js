const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signUp = async (req, res, next) => {
  try {
    // console.log(req.body.aboutMe)
    const { email, phone, password } = req.body;
    if (!email || !phone || !password) {
      return next(new ApiError("missing filed", 500));
    }

    const isUserExits = await User.findOne({
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
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      phone: phone,
      password: hashPassword,
    });

    const saveData = await newUser.save();
    // console.log(saveData);
    res
      .status(200)
      .json(new ApiResponse(200, "register successfully complete", saveData));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return next(new ApiError("Missing fields", 400));
    }

    const isUserExit = await User.findOne({ email, phone });
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

module.exports = { signUp, login };
