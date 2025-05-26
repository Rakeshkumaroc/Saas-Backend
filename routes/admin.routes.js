const express = require("express");
const {signUp,login}= require("../controllers/admin.controller")
const {tokenChecker} =require("../middleware/authChecker")
const router = express.Router();




router.post("/sign-up" ,signUp);
router.post("/login" , login);
router.get("/helo" , (login, res) => {
  res.status(200).json({ message: "Hello from admin route" });
});

module.exports = router;
