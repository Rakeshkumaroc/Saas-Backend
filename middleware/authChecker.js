const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// token validator middleware

const tokenChecker = async (req, res, next) => {
  try {
    //console.log(req.headers.authorization.split(" ")[1]);
    if (!req.headers.authorization) {
      return next(new ApiError("token nhi hai", 500));
    }

    // token sath me laya hai user to hm check krenge mere hi app se bnaya gya user hai
    const tokenVerify = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );
    // console.log(tokenVerify);
    const userExits = await User.findOne({ _id: tokenVerify.userId });

    if (!userExits) {
      return next(new ApiError("you are not valid user", 500));
    }
    //  console.log(userExits)
    req.tokenData = tokenVerify;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { tokenChecker };
