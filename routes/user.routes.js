const express = require("express");
const {
  signUp,
  login,
  logout,
  getAllUsers,
  getUserById,
//   updateUser,
  deleteUser,
  addUserWithGoogle,
  logInUserWithGoogle,
}= require("../controllers/user.controller")
const router = express.Router();




router.post("/sign-up" ,signUp);
router.post("/login" , login);
router.post("/logout" , logout);
router.get("/get-all-Users" ,  getAllUsers);
router.get("/get-user-by-id/:userId" ,  getUserById);
router.post("/google-auth-signup", addUserWithGoogle);
router.post("/google-auth-login", logInUserWithGoogle); 
router.delete("/delete-user/:userId" ,  deleteUser);


module.exports = router;
