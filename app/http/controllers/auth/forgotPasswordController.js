//call controllers
const controller = require("app/http/controllers/controller");

//require user model
const User = require("app/models/user");

//require unique string for token
const uniqueString = require("unique-string");

//require password-reset model
const PasswordReset = require("app/models/password-reset");

class forgotPasswordController extends controller {
  showForgotPasswordForm(req, res) {
    const title = " فراموشی رمز عبور";
    res.render("home/auth/passwords/email", {
      recaptcha: this.recaptcha.render(),
      title,
    });
  }

  //process of validate and reset password
  async sendResetPasswordLink(req, res, next) {
      //first read recaptcha validation method from controllers and then read validation data
      await this.recaptchaValidation(req, res);
      let result = await this.validationData(req);

      if (result) return this.sendResetLink(req, res);

      return this.back(req, res);
  }

  //send reset link process
  async sendResetLink(req, res) {
      //is there this email ?
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash("چنین کاربری وجود ندارد");
        return this.back(req, res);
      }
      const newPasswordReset = new PasswordReset({
        email: req.body.email,
        token: uniqueString(),
      });

      await newPasswordReset.save();

      //send mail

      // req.flash("success" , "ایمیل بازیابی رمز عبور با موفت انجام شد");
      res.redirect("/");
  }
}

module.exports = new forgotPasswordController();
