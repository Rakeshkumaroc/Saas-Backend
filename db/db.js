const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = async () => {
  try {
    data = await mongoose.connect(process.env.MONGO_URL || 5000);
    console.log("database connected successfully ");
  } catch (error) {
    console.log("database not connected successfully ", error);
    process.exit(1);
  }
};

module.exports = dbConnect;
