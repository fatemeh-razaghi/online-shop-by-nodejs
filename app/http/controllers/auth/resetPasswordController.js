//call controllers
const controller = require("app/http/controllers/controller");

//require user model
const User = require("app/models/user");

//require password-reset model
const PasswordReset = require("app/models/password-reset");

class resetPasswordController extends controller {
  showpasswordResetForm(req, res) {
    const title = "بازیابی رمز عبور";
    res.render("home/auth/passwords/reset", {
      recaptcha: this.recaptcha.render(),
      title,
      token: req.params.token,
    });
  }

  //reset password validation
  async resetPasswordProcess(req, res, next) {
      //first read recaptcha validation method from controllers and then read validation data
      await this.recaptchaValidation(req, res);
      let result = await this.validationData(req);

      if (result) return this.resetPassword(req, res);

      return this.back(req, res);
  }

  //reset password and save in MD
  async resetPassword(req, res) {
      //is there any email & token?
      let field = await PasswordReset.findOne({
        $and: [{ email: req.body.email }, { token: req.body.token }],
      });
      if (!field) {
        req.flash("errors", "اطلاعات وارد شده صحیح نمی باشند لطفا دقت کنید");
        return this.back(req, res);
      }

      let user = await User.findOneAndUpdate(
        { email: field.email },
        { $set: { password: req.body.password } }
      );

      await field.update({ use: true });

      //if it didnt work
      if (!user) {
        req.flash("errors", "اطلاعات بروزرسانی نشد");
        return this.back(req, res);
      }

      //twise use forgot password link
      if (field.use) {
        req.flash(
          "errors",
          "از این لینک برای بازیابی رمز عبور قبلا استفاده شده است "
        );
        return this.back(req, res);
      }
      return res.redirect("/auth/login");
  }
}

module.exports = new resetPasswordController();
