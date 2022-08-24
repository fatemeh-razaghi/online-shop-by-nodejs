//call controllers
const controller = require("app/http/controllers/controller");

//require passport package
const passport = require("passport");

class registerController extends controller {
  //show web elements
  showRegisterationForm(req, res) {
    const title = " عضویت";
    res.render("home/auth/register", {
      recaptcha: this.recaptcha.render(),
      title,
    });
  }

  //proccess register page
  async registerProccess(req, res, next) {
      //first read recaptcha validation method in controllers and then read validation data method
      await this.recaptchaValidation(req, res);
      let result = await this.validationData(req);

      if (result) return this.register(req, res, next);
      return this.back(req, res);
  }

  //authentication
  register(req, res, next) {
    passport.authenticate("local.register", {
      successRedirect: "/",
      failureRedirect: "/auth/register",
      failureFlash: true,
    })(req, res, next);
  }
}

module.exports = new registerController();
