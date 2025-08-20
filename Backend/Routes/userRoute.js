const express = require("express");
const {loginUser,registerUser, logoutUser} = require("../controller/userController")

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);



module.exports = router;