const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  createUser,
  verifyEmail,
  newVerificationCode,
  loginUser,
  forgotPassword,
  resetPassword,
  newResetCode,
  changePassword,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");
const passport = require("passport");

// const defaultRateLimit = protection({ max: 2, interval: 60 });
router.post("/", createUser);
router.post("/new-verification-code", newVerificationCode);
router.post("/login-user", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/new-reset-code", newResetCode);

router.post("/verify-email", verifyEmail);
router.post("/change-password", auth, changePassword);

router.post("/logout", logout);

// google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const { user, accessToken, refreshToken } = req.user;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${process.env.CLIENT_URL}/auth/oauth-success?accessToken=${accessToken}?email=${user.email}`
    );
  }
);

module.exports = router;
