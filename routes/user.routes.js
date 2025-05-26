const express = require("express");
const {
  signUp,
  login,
  logout,
  getAllUsers,
  getUserById,
//   updateUser,
  deleteUser,
}= require("../controllers/user.controller")
const router = express.Router();




router.post("/sign-up" ,signUp);
router.post("/login" , login);
router.post("/logout" , logout);
router.get("/get-all-Users" ,  getAllUsers);
router.get("/get-user-by-id/:userId" ,  getUserById);
// router.post("/update-user/:userId" ,  updateUser);
router.delete("/delete-user/:userId" ,  deleteUser);


module.exports = router;
