const express=require("express");
const router= express.Router();
const {auth, isSuperAdmin} = require("../middleware/auth");
const {getUser} = require("../controller/user.controller");
const userController = require("../controller/user.controller");

router.post("/signup", userController.signUp);
router.post("/create-account",auth, isSuperAdmin, userController.createAccount);
router.post("/login",userController.login)
router.get("/getUser", auth, getUser);
router.post("/change-password", auth, userController.changePassword);

module.exports= router;