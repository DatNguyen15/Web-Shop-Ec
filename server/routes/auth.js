const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");

const passport = require("../config/passport");

router.post("/isadmin", authController.isAdmin);
router.post("/signup", authController.postSignup);
router.post("/signin", authController.postSignin);
router.get(
  "/google-signin",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google-signin/callback",
  passport.authenticate("google"),
  authController.googleSigninCallback
);
router.post("/user", loginCheck, isAuth, isAdmin, authController.allUser);

module.exports = router;
