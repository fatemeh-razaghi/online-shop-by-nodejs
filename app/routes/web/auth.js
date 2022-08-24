const express = require("express");
const router = express.Router();


/*authentication controllers*/

const loginController = require("app/http/controllers/auth/loginController");
const registerController = require("app/http/controllers/auth/registerController");
const forgotPasswordController = require("app/http/controllers/auth/forgotPasswordController");
const resetPasswordController = require("app/http/controllers/auth/resetPasswordController");

/***validators*/
const registerValidator = require("app/http/validators/registerValidator");
const loginValidator = require("app/http/validators/loginValidator");
const forgotPasswordValidator = require("app/http/validators/forgotPasswordValidator");
const resetPasswordValidator = require("app/http/validators/resetPasswordValidator");

//login rotes
router.get("/login", loginController.showLoginForm);
router.post("/login", loginValidator.handle(), loginController.loginProccess);

//register routes
router.get("/register", registerController.showRegisterationForm);
router.post(
  "/register",
  registerValidator.handle(),
  registerController.registerProccess
);

//forgotpassword routes
router.get("/password/reset", forgotPasswordController.showForgotPasswordForm);
router.post(
  "/password/email",
  forgotPasswordValidator.handle(),
  forgotPasswordController.sendResetPasswordLink
);

//password reset routes
router.get(
  "/password/reset/:token",
  resetPasswordController.showpasswordResetForm
);
router.post(
  "/password/reset",
  resetPasswordValidator.handle(),
  resetPasswordController.resetPasswordProcess
);

module.exports = router;
