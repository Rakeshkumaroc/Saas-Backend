const express = require("express");
const {signUp,login}= require("../controllers/admin.controller")
const router = express.Router();




router.post("/sign-up" ,signUp);
router.post("/login" , login);

module.exports = router;
