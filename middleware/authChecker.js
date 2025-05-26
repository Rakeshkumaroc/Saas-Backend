const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/user.model");
// token validator middleware

const tokenChecker = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ApiError("Token not found in cookies", 401));
    }
    // Verify token
    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if user exists
    const userExits = await userModel.findOne({ _id: tokenVerify.userId });

    if (!userExits) {
      return next(new ApiError("you are not valid user", 401));
    }
    // Attach token data to req for later use
    req.tokenData = tokenVerify;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { tokenChecker };
